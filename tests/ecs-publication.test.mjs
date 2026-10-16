import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const project = fileURLToPath(new URL('../', import.meta.url));

test('ECS preflight identifies missing rsync and directory failures without needing SSH credentials', (t) => {
  const temp = mkdtempSync(join(tmpdir(), 'nearblade-preflight-test-'));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const workflow = readFileSync(join(project, '.github/workflows/deploy-ecs.yml'), 'utf8');
  const script = workflow.match(/<<'REMOTE'\n([\s\S]*?)\n {10}REMOTE/)[1].replace(/^ {10}/gm, '');
  const bin = join(temp, 'bin');
  mkdirSync(bin);
  writeFileSync(join(bin, 'rsync'), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  const run = (target, path = `${bin}:/usr/bin:/bin`) => spawnSync('/bin/sh', ['-s', '--', target], { input: script, encoding: 'utf8', env: { ...process.env, PATH: path } });
  const target = join(temp, 'website');
  assert.equal(run(target).status, 0);
  assert.ok(existsSync(target));
  const missingRsync = run(target, join(temp, 'empty-path'));
  assert.notEqual(missingRsync.status, 0);
  assert.match(missingRsync.stdout, /::error::ECS is missing rsync/);
  writeFileSync(join(temp, 'file'), 'not a directory');
  const invalidDirectory = run(join(temp, 'file/website'));
  assert.notEqual(invalidDirectory.status, 0);
  assert.match(invalidDirectory.stdout, /::error::ECS_USER cannot create ECS_DEPLOY_PATH/);
  if (process.getuid?.() !== 0) {
    chmodSync(target, 0o555);
    try {
      const readOnly = run(target);
      assert.notEqual(readOnly.status, 0);
      assert.match(readOnly.stdout, /::error::ECS_USER cannot write to ECS_DEPLOY_PATH/);
    } finally { chmodSync(target, 0o755); }
  }
});

function fixture(t) {
  const temp = mkdtempSync(join(tmpdir(), 'nearblade-ecs-test-'));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const root = join(temp, 'source');
  const remote = join(temp, 'remote.git');
  mkdirSync(root);
  const git = (args, cwd = root) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git(['init', '--bare', remote]);
  git(['init', '-b', 'main']);
  git(['config', 'user.name', 'Publication Test']);
  git(['config', 'user.email', 'publication@example.invalid']);
  git(['remote', 'add', 'origin', remote]);
  mkdirSync(join(root, 'scripts'));
  mkdirSync(join(root, '.github/workflows'), { recursive: true });
  for (const name of ['build-ecs.mjs', 'publish-ecs.mjs']) {
    cpSync(join(project, 'scripts', name), join(root, 'scripts', name));
  }
  cpSync(join(project, '.github/workflows/deploy-ecs.yml'), join(root, '.github/workflows/deploy-ecs.yml'));
  writeFileSync(join(root, '.gitignore'), 'dist/\n');
  writeFileSync(join(root, 'package.json'), JSON.stringify({ scripts: { build: 'node compile.cjs', test: 'npm run build && node verify.cjs' } }));
  // A tiny compiler keeps the release tests independent of the application build.
  writeFileSync(join(root, 'compile.cjs'), `const fs = require('node:fs');
fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist/assets', { recursive: true });
fs.writeFileSync('dist/index.html', '<html>release</html>');
fs.writeFileSync('dist/assets/site.js', 'console.log("release")');
fs.mkdirSync('dist/about', { recursive: true });
fs.mkdirSync('dist/locales', { recursive: true });
fs.writeFileSync('dist/about/index.html', '<html>about</html>');
fs.writeFileSync('dist/404.html', '<html>not found</html>');
fs.writeFileSync('dist/sitemap.xml', '<urlset/>');
fs.writeFileSync('dist/robots.txt', 'User-agent: *');
fs.writeFileSync('dist/locales/zh-CN.json', '{"Home":"首页"}');
`);
  writeFileSync(join(root, 'verify.cjs'), `const fs = require('node:fs');
if (!fs.existsSync('dist/index.html')) throw new Error('Build must finish before tests');
fs.writeFileSync('dist/assets/tested.txt', 'release checks passed');
`);
  const commit = () => {
    git(['add', '-A']);
    git(['commit', '-m', 'Test source']);
    return git(['rev-parse', 'HEAD']);
  };
  commit();
  const run = (script, ...args) => spawnSync(process.execPath, [join(root, 'scripts', `${script}-ecs.mjs`), ...args], { cwd: root, encoding: 'utf8' });
  const ok = (script, ...args) => {
    const result = run(script, ...args);
    assert.equal(result.status, 0, result.stderr + result.stdout);
    return result.stdout;
  };
  const rejected = (script, message) => {
    const result = run(script);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, message);
  };
  const remoteGit = (...args) => git(['--git-dir', remote, ...args]);
  return { root, git, commit, run, ok, rejected, remoteGit };
}

const publishedFiles = script => [
  '.github/workflows/deploy-ecs.yml', '404.html', 'about/index.html', `assets/${script}`, 'assets/tested.txt', 'index.html', 'locales/zh-CN.json', 'robots.txt', 'sitemap.xml',
].sort();

test('build records the source commit without publishing; rejects dirty source and clears stale marker', (t) => {
  const f = fixture(t);
  f.ok('build');
  const marker = join(f.root, 'dist/.ecs-build.json');
  assert.equal(JSON.parse(readFileSync(marker)).sourceCommit, f.git(['rev-parse', 'HEAD']));
  assert.equal(readFileSync(join(f.root, 'dist/assets/tested.txt'), 'utf8'), 'release checks passed');
  assert.equal(f.remoteGit('for-each-ref', '--format=%(refname)'), '');
  writeFileSync(join(f.root, 'uncommitted.txt'), 'pending source change');
  f.rejected('build', /Commit development changes/);
  assert.equal(existsSync(marker), false);
});

test('failed release tests remove an earlier build marker and prevent publication', (t) => {
  const f = fixture(t);
  f.ok('build');
  writeFileSync(join(f.root, 'verify.cjs'), 'throw new Error("Release verification failed");\n');
  f.commit();
  f.rejected('build', /Release verification failed/);
  assert.equal(existsSync(join(f.root, 'dist/.ecs-build.json')), false);
  f.rejected('publish', /Run npm run build:ecs/);
  assert.equal(f.remoteGit('for-each-ref', '--format=%(refname)'), '');
});

test('a clean commit change during the build cannot receive a release marker', (t) => {
  const f = fixture(t);
  const verifier = join(f.root, 'verify.cjs');
  writeFileSync(verifier, readFileSync(verifier, 'utf8') + `require('node:child_process').execFileSync('git', ['commit', '--allow-empty', '-m', 'Concurrent source commit']);\n`);
  f.commit();
  f.rejected('build', /Development commit changed during/);
  assert.equal(existsSync(join(f.root, 'dist/.ecs-build.json')), false);
});

test('publishing requires a clean source tree and a build from the current commit', (t) => {
  const f = fixture(t);
  f.rejected('publish', /missing index.html/);
  f.ok('build');
  rmSync(join(f.root, 'dist/.ecs-build.json'));
  f.rejected('publish', /Run npm run build:ecs/);
  f.ok('build');
  writeFileSync(join(f.root, 'change.txt'), 'new source');
  f.rejected('publish', /Commit development changes/);
  f.commit();
  f.rejected('publish', /Development commit changed/);
});

test('dry run leaves the remote untouched and publishing includes only artifacts and workflow', (t) => {
  const f = fixture(t);
  const source = f.git(['rev-parse', 'HEAD']);
  f.ok('build');
  assert.match(f.ok('publish', '--dry-run'), /nothing pushed/);
  assert.equal(f.remoteGit('for-each-ref', '--format=%(refname)'), '');
  f.ok('publish');
  assert.deepEqual(f.remoteGit('ls-tree', '-r', '--name-only', 'push_remote').split('\n'), publishedFiles('site.js'));
  assert.equal(f.git(['branch', '--show-current']), 'main');
  assert.equal(f.git(['rev-parse', 'HEAD']), source);
  assert.equal(f.git(['status', '--porcelain']), '');
  assert.equal(existsSync(join(f.root, 'dist/.ecs-build.json')), true);
});

test('updated publications retain history and remove obsolete assets; identical artifacts create no commit', (t) => {
  const f = fixture(t);
  f.ok('build');
  f.ok('publish');
  const first = f.remoteGit('rev-parse', 'push_remote');
  assert.match(f.ok('publish'), /already match/);
  assert.equal(f.remoteGit('rev-parse', 'push_remote'), first);
  const compiler = join(f.root, 'compile.cjs');
  writeFileSync(compiler, readFileSync(compiler, 'utf8').replace('site.js', 'new-site.js'));
  f.commit();
  f.ok('build');
  f.ok('publish', '--dry-run');
  assert.equal(f.remoteGit('rev-parse', 'push_remote'), first);
  f.ok('publish');
  assert.equal(f.remoteGit('rev-parse', 'push_remote^'), first);
  assert.deepEqual(f.remoteGit('ls-tree', '-r', '--name-only', 'push_remote').split('\n'), publishedFiles('new-site.js'));
});

test('build and publish reject running on the publication branch', (t) => {
  const f = fixture(t);
  f.ok('build');
  f.git(['switch', '-c', 'push_remote']);
  f.rejected('build', /Build from the development branch/);
  f.rejected('publish', /not push_remote/);
});
