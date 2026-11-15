import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { preview } from 'vite';
import { checkSeoHttp } from '../scripts/check-seo-http.mjs';

test('preview serves the route HTML before hydration, including query strings and trailing slashes', async () => {
  const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
  try {
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    const audit = await checkSeoHttp(origin);
    assert.equal(audit.passed, true, JSON.stringify(audit.failures, null, 2));
    for (const route of ['/products/sb-001', '/products/pb-radius-tooling', '/blog/custom-blade-inquiry-guide']) {
      const expected = readFileSync(new URL(`../dist${route}/index.html`, import.meta.url), 'utf8');
      for (const suffix of ['', '?lang=zh-CN']) {
        const response = await fetch(`${origin}${route}${suffix}`);
        assert.equal(response.status, 200);
        assert.equal(await response.text(), expected, `${route}${suffix}`);
      }
      for (const suffix of ['/', '/index.html']) {
        const response = await fetch(`${origin}${route}${suffix}?lang=zh-CN`, { redirect: 'manual' });
        assert.equal(response.status, 301);
        assert.equal(response.headers.get('location'), `${route}?lang=zh-CN`);
      }
    }
    for (const [from, to] of [['sb-002', 'sb-001'], ['tb-001', 'cp-001']]) {
      for (const suffix of ['', '/', '/index.html']) {
        const response = await fetch(`${origin}/products/${from}${suffix}?source=old`, { redirect: 'manual' });
        assert.equal(response.status, 301);
        assert.equal(response.headers.get('location'), `/products/${to}?source=old`);
        assert.equal((await fetch(new URL(response.headers.get('location'), origin))).status, 200);
      }
    }
    const home = await fetch(`${origin}/index.html`, { redirect: 'manual' });
    assert.equal(home.status, 301);
    assert.equal(home.headers.get('location'), '/');
    for (const route of ['/missing-seo-page', '/products/missing-product', '/blog/missing-article', '/assets/missing.js', '/404.html']) {
      const response = await fetch(`${origin}${route}`);
      assert.equal(response.status, 404, route);
      assert.match(await response.text(), /noindex, nofollow/);
      const head = await fetch(`${origin}${route}`, { method: 'HEAD' });
      assert.equal(head.status, 404, route);
      assert.equal(await head.text(), '');
    }
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
  }
});
