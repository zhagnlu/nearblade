import { execFileSync } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const marker = join(root, 'dist/.ecs-build.json');
rmSync(marker, { force: true });
if (git(['status', '--porcelain'])) throw new Error('Commit development changes before building the ECS publication.');
if (git(['branch', '--show-current']) === 'push_remote') throw new Error('Build from the development branch.');
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });
if (git(['status', '--porcelain'])) throw new Error('Build updated generated files. Commit them, then run build:ecs again.');
writeFileSync(marker, JSON.stringify({ sourceCommit: git(['rev-parse', 'HEAD']), builtAt: new Date().toISOString() }) + '\n');
console.log('ECS build ready in dist/. Preview it, then run npm run publish:ecs. Nothing pushed.');
