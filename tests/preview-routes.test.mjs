import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { preview } from 'vite';
import { checkSeoHttp } from '../scripts/check-seo-http.mjs';

test('preview serves all localized HTML, migrates legacy URLs directly and returns real localized 404s', async () => {
  const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
  try {
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    const audit = await checkSeoHttp(origin);
    assert.equal(audit.passed, true, JSON.stringify(audit.failures, null, 2));
    const redirects = [
      ['/', '/en/'], ['/index.html?lang=zh-CN&source=old', '/zh-cn/?source=old'],
      ['/products/sb-001', '/en/products/sb-001/'],
      ['/products/sb-001/?source=old&lang=zh-CN', '/zh-cn/products/sb-001/?source=old'],
      ['/products/sb-002/index.html?lang=ja&source=old', '/ja/products/sb-001/?source=old'],
      ['/zh-cn/products/sb-002?source=old', '/zh-cn/products/sb-001/?source=old'],
      ['/en/products/tb-001/', '/en/products/cp-001/'],
      ['/de/products/index.html?lang=ja&category=x', '/de/products/?category=x'],
      ['/ZH-CN/products/sb-001/', '/zh-cn/products/sb-001/'],
      ['/en', '/en/'], ['/en/index.html', '/en/'],
      ['/products?lang=invalid&lang=ja', '/en/products/'],
    ];
    for (const [from, to] of redirects) {
      const response = await fetch(origin + from, { redirect: 'manual' });
      assert.equal(response.status, 301, from);
      assert.equal(response.headers.get('location'), to, from);
      assert.equal((await fetch(origin + to, { redirect: 'manual' })).status, 200, to);
    }
    for (const route of ['/en/products/sb-001/', '/zh-cn/products/pb-radius-tooling/', '/ja/blog/custom-blade-inquiry-guide/']) {
      const expected = readFileSync(new URL(`../dist${route}/index.html`, import.meta.url), 'utf8');
      const response = await fetch(origin + route + '?source=test', { redirect: 'manual' });
      assert.equal(response.status, 200, route);
      assert.equal(await response.text(), expected);
      const head = await fetch(origin + route, { method: 'HEAD' });
      assert.equal(head.status, 200);
      assert.equal(await head.text(), '');
    }
    for (const route of ['/missing-seo-page', '/en/products/missing-product', '/zh-cn/blog/missing-article', '/xx/products', '/en/assets/missing.js', '/assets/missing.js', '/404.html']) {
      const response = await fetch(origin + route);
      assert.equal(response.status, 404, route);
      const html = await response.text();
      assert.match(html, /noindex, nofollow/);
      if (route.startsWith('/zh-cn/')) assert.match(html, /lang="zh-CN"/);
      const head = await fetch(origin + route, { method: 'HEAD' });
      assert.equal(head.status, 404);
      assert.equal(await head.text(), '');
    }
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
  }
});
