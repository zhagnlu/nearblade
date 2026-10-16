import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import helmet from 'react-helmet-async';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const languageCodes = ['en', 'zh-CN', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'ja'];
const decode = text => text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (match, code) => {
  if (code[0] === '#') return String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10));
  return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[code.toLowerCase()] ?? match;
});

export async function collectMessages() {
  const bundle = path.join(root, 'scripts/.i18n-routes.cjs');
  const messages = new Set(['Language', 'Loading language…', 'Language could not be loaded. Please try again.', 'Close', 'Catalog reference · Product-family examples', 'Your email draft is ready. Send it from your email app. Your details remain here for editing.', 'If your email app did not open,', 'open the draft again', ', or email', 'with your requirements.', 'Go to image 1', 'Go to image 2']);
  const originalError = console.error;
  try {
    await build({ stdin: { contents: "export { routes } from './src/routes'; export { getAllProducts } from './src/data/products'; export { blogPosts } from './src/data/blog';", resolveDir: root, loader: 'ts' }, bundle: true, platform: 'node', format: 'cjs', packages: 'external', alias: { '@': path.join(root, 'src') }, outfile: bundle });
    const { routes, getAllProducts, blogPosts } = createRequire(import.meta.url)(bundle);
    const pages = ['/', '/products', '/about', '/equipment', '/contact', '/blog', '/404', ...getAllProducts().map(product => `/products/${product.id}`), ...blogPosts.map(post => `/blog/${post.slug}`)];
    const add = value => { const text = decode(value).trim(); if (/[A-Za-z]/.test(text)) messages.add(text); };
    console.error = (...args) => { if (!String(args[0]).includes('useLayoutEffect does nothing on the server')) originalError(...args); };
    for (const route of pages) {
      const router = createMemoryRouter(routes, { initialEntries: [route] });
      try {
        const html = renderToString(React.createElement(helmet.HelmetProvider, null, React.createElement(RouterProvider, { router }))).replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/(<textarea\b[^>]*>)[\s\S]*?<\/textarea>/gi, '$1</textarea>');
        for (const text of html.split(/<[^>]*>/g)) add(text);
        for (const [, value] of html.matchAll(/(?:placeholder|alt|aria-label|title)="([^"]*)"/g)) add(value);
      } finally { router.dispose(); }
    }
    for (const product of getAllProducts()) {
      for (const value of [`${product.name} catalog reference`, `${product.name} enlarged image`, `${product.name} - View 1`, `${product.name} - View 2`]) add(value);
    }
    return [...messages].sort();
  } finally {
    console.error = originalError;
    rmSync(bundle, { force: true });
  }
}

export const isInvariant = key => ['Nearblade', 'WhatsApp', 'WhatsApp:', 'English', 'Español', 'Français', 'Deutsch', 'Português', 'John Smith', 'mm'].includes(key) || /^[A-Za-z]$/.test(key) || /^[A-Z\d][A-Z\d ./%±×°+()[\]–-]*$/.test(key) || /^(?:42CrMo|5CrW2Si|6CrW2Si|9CrSi|Cr12MoV|CrWMn|W18Cr4V|W6Mo5Cr4V2|5000m²|±[\d.]+mm|8:30 - 17:30 \(GMT\+8\))$/.test(key) || /^(?:https?:\/\/|[^\s]+@)/.test(key);

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const keys = await collectMessages();
  mkdirSync(path.join(root, 'content/locales'), { recursive: true });
  writeFileSync(path.join(root, 'content/locales/en.json'), JSON.stringify(Object.fromEntries(keys.map(key => [key, key])), null, 2) + '\n');
  writeFileSync(path.join(root, 'content/locales/invariants.json'), JSON.stringify(keys.filter(isInvariant), null, 2) + '\n');
  console.log(`Extracted ${keys.length} source strings (${keys.filter(isInvariant).length} invariant identifiers).`);
}
