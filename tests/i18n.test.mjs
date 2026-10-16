import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { transformSync as compile } from 'esbuild';
import babel from '@babel/core';
import { collectMessages, languageCodes, root } from '../scripts/extract-locales.mjs';

const json = file => JSON.parse(readFileSync(new URL(file, `file://${root}/`), 'utf8'));
const english = json('content/locales/en.json');
const invariant = json('content/locales/invariants.json');
const importTs = async file => import(`data:text/javascript;base64,${Buffer.from(compile(readFileSync(new URL(file, `file://${root}/`), 'utf8'), { loader: 'ts', format: 'esm' }).code).toString('base64')}`);

test('all rendered pages, form hints and dynamic image controls have translations', async () => {
  assert.deepEqual(Object.keys(english).sort(), await collectMessages());
  assert.ok(english['Please describe the products you need, specifications, quantity, etc.']);
  for (const code of languageCodes) {
    const source = json(`content/locales/${code}.json`);
    assert.deepEqual(Object.keys(source), Object.keys(english), code);
    assert.deepEqual(json(`dist/locales/${code}.json`), source, `${code} published pack`);
    for (const [key, value] of Object.entries(source)) {
      assert.ok(typeof value === 'string' && value.trim(), `${code}: ${key}`);
      if (invariant.includes(key)) assert.equal(value, key, `${code}: technical identifier`);
    }
    if (code !== 'en') {
      for (const key of ['Home', 'Blade Heat Treatment Workshop', 'Your Requirements *', 'Custom Industrial Blade Quote: What to Include', 'Language could not be loaded. Please try again.']) {
        assert.ok(source[key], `${code}: ${key} exists`);
        assert.notEqual(source[key], key, `${code}: ${key}`);
      }
      const unchanged = Object.keys(source).filter(key => source[key] === key && !invariant.includes(key));
      assert.ok(unchanged.length < 10, `${code}: unexpectedly untranslated content: ${unchanged}`);
    }
  }
});

test('text lookup preserves whitespace and safely falls back for unknown strings', async () => {
  const { translateText, isLanguage } = await importTs('src/i18n/languages.ts');
  const dictionary = { Home: '首页', '$5': '$10' };
  assert.equal(translateText(' Home\n', dictionary), ' 首页\n');
  assert.equal(translateText(' $5 ', dictionary), ' $10 ');
  assert.equal(translateText('New content', dictionary), 'New content');
  assert.equal(translateText('toString', dictionary), 'toString');
  assert.equal(translateText('  ', dictionary), '  ');
  for (const language of languageCodes) assert.ok(isLanguage(language));
  for (const invalid of [null, '', 'zh', '__proto__', 'xx']) assert.equal(isLanguage(invalid), false);
});

test('build transform localizes native elements and router links while retaining refs and input values', async () => {
  const { default: plugin } = await importTs('scripts/localize-jsx.ts');
  const source = `const view = <><Link to="/about">About</Link><input ref={inputRef} value={typedValue} placeholder="Full Name *" onChange={update}/><span translate="no">42CrMo</span><dialog ref={dialogRef}>Close</dialog></>`;
  const transform = filename => babel.transformSync(source, { filename, babelrc: false, configFile: false, parserOpts: { plugins: ['jsx'] }, plugins: [plugin] }).code;
  const output = transform(`${root}/src/pages/Example.tsx`);
  assert.match(output, /import.*LocalizedElement.*from "@\/i18n\/LocalizedElement"/);
  assert.match(output, /as=\{Link\} to="\/about"/);
  assert.match(output, /as="input" ref=\{inputRef\} value=\{typedValue\}/);
  assert.match(output, /onChange=\{update\}/);
  assert.match(output, /as="dialog" ref=\{dialogRef\}/);
  assert.match(output, /translate="no"/);
  for (const file of ['src/i18n/LanguageSwitcher.tsx', 'src/components/common/PageMeta.tsx']) assert.doesNotMatch(transform(`${root}/${file}`), /import.*LocalizedElement/);
});

test('published organization uses the shared mobile number on every route', () => {
  const sitemap = readFileSync(`${root}/dist/sitemap.xml`, 'utf8');
  for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const html = readFileSync(`${root}/dist${new URL(url).pathname.replace(/\/$/, '')}/index.html`, 'utf8');
    const graph = JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)[1]);
    assert.equal(graph['@graph'].find(item => item['@type'] === 'Organization').telephone, '+8618966486485');
  }
});
