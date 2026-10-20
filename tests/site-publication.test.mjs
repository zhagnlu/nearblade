import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const config = JSON.parse(readFileSync(path.join(root, 'site.config.json'), 'utf8'));
const keywordPlan = JSON.parse(readFileSync(path.join(root, 'content/seo/pages.json'), 'utf8'));
const sitemap = readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const htmlFor = url => readFileSync(path.join(dist, new URL(url).pathname.slice(1), 'index.html'), 'utf8');
const meta = (html, property) => html.match(new RegExp(`<meta[^>]*(?:name|property)="${property}"[^>]*content="([^"]*)"`))?.[1];
const graphFor = html => JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1] || 'null');
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

test('all canonical pages publish the keyword plan with unique titles, descriptions and primary topics', () => {
  assert.deepEqual(Object.keys(keywordPlan).sort(), urls.map(url => new URL(url).pathname).sort());
  const titles = new Set();
  const descriptions = new Set();
  const topics = new Set();
  for (const url of urls) {
    const route = new URL(url).pathname;
    const plan = keywordPlan[route];
    const html = htmlFor(url);
    assert.equal(decode(html.match(/<title[^>]*>([^<]+)<\/title>/)[1]), plan.title, route);
    assert.equal(decode(meta(html, 'description')), plan.description, route);
    assert.deepEqual(decode(meta(html, 'keywords')).split(', '), [plan.primaryKeyword, ...plan.secondaryKeywords], route);
    const page = graphFor(html)['@graph'].find(item => ['WebPage', 'AboutPage', 'ContactPage'].includes(item['@type']));
    assert.deepEqual(page.keywords, [plan.primaryKeyword, ...plan.secondaryKeywords]);
    assert.ok(plan.intent && plan.secondaryKeywords.length >= 2);
    titles.add(plan.title);
    descriptions.add(plan.description);
    topics.add(plan.primaryKeyword);
  }
  assert.equal(titles.size, urls.length);
  assert.equal(descriptions.size, urls.length);
  assert.equal(topics.size, urls.length);
});

test('sitemap covers all public pages with unique HTTPS URLs and a matching robots directive', () => {
  assert.equal(urls.length, 39);
  assert.equal(new Set(urls).size, urls.length);
  for (const url of urls) {
    assert.equal(new URL(url).origin, config.url);
    assert.equal(new URL(url).search, '');
    assert.ok(existsSync(path.join(dist, new URL(url).pathname.slice(1), 'index.html')));
  }
  assert.match(readFileSync(path.join(dist, 'robots.txt'), 'utf8'), new RegExp(`Sitemap: ${config.url}/sitemap.xml`));
});

test('every route exposes its own canonical, sharing tags and valid JSON-LD without executing JavaScript', () => {
  const titles = new Set();
  for (const url of urls) {
    const html = htmlFor(url);
    assert.equal([...html.matchAll(/<title\b/g)].length, 1);
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1];
    assert.ok(title);
    titles.add(title);
    assert.equal(html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1], url);
    assert.equal(meta(html, 'og:url'), url);
    assert.equal(meta(html, 'robots'), 'index, follow');
    assert.equal(meta(html, 'twitter:card'), 'summary_large_image');
    const image = new URL(meta(html, 'og:image'));
    assert.equal(image.protocol, 'https:');
    assert.ok(existsSync(path.join(dist, image.pathname)));
    assert.equal(meta(html, 'twitter:image'), image.href);
    const graph = graphFor(html);
    assert.equal(graph['@context'], 'https://schema.org');
    assert.ok(graph['@graph'].some(item => item['@type'] === 'Organization'));
    assert.equal(new Set(graph['@graph'].filter(item => item['@id']).map(item => item['@id'])).size, graph['@graph'].filter(item => item['@id']).length);
    if (new URL(url).pathname !== '/') assert.ok(graph['@graph'].some(item => item['@type'] === 'BreadcrumbList'));
  }
  assert.equal(titles.size, urls.length);
});

test('product and article schema match each individual route without invented commercial data', () => {
  const products = urls.filter(url => new URL(url).pathname.startsWith('/products/'));
  const articles = urls.filter(url => new URL(url).pathname.startsWith('/blog/'));
  assert.equal(products.length, 30);
  assert.equal(articles.length, 3);
  for (const url of products) {
    const product = graphFor(htmlFor(url))['@graph'].find(item => item['@type'] === 'Product');
    assert.equal(product.sku, new URL(url).pathname.split('/').at(-1));
    assert.ok(product.image.every(image => new URL(image).origin === config.url));
    assert.equal(product.offers, undefined);
    assert.equal(product.aggregateRating, undefined);
  }
  for (const url of articles) {
    const html = htmlFor(url);
    assert.equal(meta(html, 'og:type'), 'article');
    assert.ok(graphFor(html)['@graph'].some(item => item['@type'] === 'Article' && item.headline));
  }
});

test('404 page is excluded from indexing and from the sitemap', () => {
  const html = readFileSync(path.join(dist, '404.html'), 'utf8');
  assert.equal(meta(html, 'robots'), 'noindex, nofollow');
  assert.doesNotMatch(html, /rel="canonical"/);
  assert.ok(!urls.some(url => new URL(url).pathname.includes('404')));
});

test('optimized product and logo assets remain small while retaining source originals', () => {
  for (const name of ['doctor', 'guillotine', 'press-brake', 'rolling-shear', 'slitting', 'swing-beam', 'toothed']) {
    const base = path.join(dist, 'images/products', name);
    assert.ok(statSync(`${base}.webp`).size < statSync(`${base}.png`).size * 0.2);
  }
  assert.ok(statSync(path.join(dist, 'images/brand/nearblade-logo.webp')).size < 50 * 1024);
});
