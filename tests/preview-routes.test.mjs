import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { preview } from 'vite';

test('preview serves the route HTML before hydration, including query strings and trailing slashes', async () => {
  const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
  try {
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    for (const route of ['/products/sb-001', '/products/pb-radius-tooling', '/blog/custom-blade-inquiry-guide']) {
      const expected = readFileSync(new URL(`../dist${route}/index.html`, import.meta.url), 'utf8');
      for (const suffix of ['', '?lang=zh-CN', '/']) {
        const response = await fetch(`${origin}${route}${suffix}`);
        assert.equal(response.status, 200);
        assert.equal(await response.text(), expected, `${route}${suffix}`);
      }
    }
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
  }
});
