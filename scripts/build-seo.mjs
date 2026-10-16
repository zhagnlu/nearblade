import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import helmet from 'react-helmet-async';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const bundle = path.join(root, 'scripts/.seo-routes.cjs');
const { HelmetProvider } = helmet;
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

try {
  await build({
    stdin: { contents: "export { routes } from './src/routes'; export { getAllProducts } from './src/data/products'; export { blogPosts } from './src/data/blog'; export { site } from './src/data/site'; export { seoPages } from './src/data/seo';", resolveDir: root, loader: 'ts' },
    bundle: true, platform: 'node', format: 'cjs', packages: 'external',
    alias: { '@': path.join(root, 'src') }, outfile: bundle,
  });
  const { routes, getAllProducts, blogPosts, site, seoPages } = createRequire(import.meta.url)(bundle);
  const origin = new URL(site.url);
  if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('site.config.json must contain an HTTPS site origin without a path, query or fragment.');
  const pages = ['/', '/products', '/about', '/equipment', '/contact', '/blog', ...getAllProducts().map(product => `/products/${product.id}`), ...blogPosts.map(post => `/blog/${post.slug}`)];
  if (JSON.stringify([...pages].sort()) !== JSON.stringify(Object.keys(seoPages).sort())) throw new Error('Every indexable page must have an entry in content/seo/pages.json.');
  for (const route of pages) {
    const plan = seoPages[route];
    if (![plan.title, plan.description, plan.primaryKeyword, plan.intent].every(value => typeof value === 'string' && value.trim()) || !Array.isArray(plan.secondaryKeywords)) throw new Error(`Incomplete SEO plan for ${route}.`);
  }
  const shell = readFileSync(path.join(dist, 'index.html'), 'utf8').replace(/<title>[^<]*<\/title>/, '');
  const originalError = console.error;
  // React Router uses useLayoutEffect on the client; only head metadata is rendered here.
  console.error = (...args) => {
    if (String(args[0]).includes('useLayoutEffect does nothing on the server')) return;
    originalError(...args);
  };
  try {
    for (const route of [...pages, '/404']) {
      const context = {};
      const router = createMemoryRouter(routes, { initialEntries: [route] });
      try {
        const markup = renderToString(React.createElement(HelmetProvider, { context }, React.createElement(RouterProvider, { router })));
        if (route !== '/404') {
          const heading = markup.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
          if (!heading || [...markup.matchAll(/<h1\b/g)].length !== 1) throw new Error(`Expected one visible H1 on ${route}.`);
          // Product and home procurement topics must also exist in visible headings.
          if (route === '/' || route.startsWith('/products/')) {
            const text = heading.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
            if (!text.includes(seoPages[route].primaryKeyword.toLowerCase())) throw new Error(`Primary topic missing from H1: ${route}.`);
          }
        }
        const head = context.helmet;
        const image = head.meta.toComponent().find(tag => tag.props.property === 'og:image')?.props.content;
        if (!image || !existsSync(path.join(dist, new URL(image).pathname))) throw new Error(`Missing share image for ${route}: ${image}`);
        const metadata = [head.title, head.meta, head.link, head.script].map(value => value.toString()).join('\n');
        const target = route === '/404' ? path.join(dist, '404.html') : path.join(dist, route.slice(1), 'index.html');
        mkdirSync(path.dirname(target), { recursive: true });
        writeFileSync(target, shell.replace('</head>', `${metadata}\n</head>`));
      } finally {
        router.dispose();
      }
    }
  } finally {
    console.error = originalError;
  }
  const urls = pages.map(route => `  <url><loc>${escapeXml(new URL(route, site.url).href)}</loc></url>`).join('\n');
  writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
  console.log(`Generated static metadata for ${pages.length} pages, 404.html, sitemap.xml and robots.txt (${site.url}).`);
} finally {
  rmSync(bundle, { force: true });
}
