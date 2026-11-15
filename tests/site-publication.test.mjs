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
const englishUrls = urls.filter(url => new URL(url).pathname.startsWith('/en/'));
const basePath = url => new URL(url).pathname.replace(/^\/[^/]+/, '') || '/';
const htmlFor = url => readFileSync(path.join(dist, new URL(url).pathname.slice(1), 'index.html'), 'utf8');
const meta = (html, property) => html.match(new RegExp(`<meta[^>]*(?:name|property)="${property}"[^>]*content="([^"]*)"`))?.[1];
const graphFor = html => JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1] || 'null');
const decode = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

test('every public page contains readable content and product navigation before JavaScript runs', () => {
  const linkedProducts = new Set();
  for (const url of urls) {
    const html = htmlFor(url);
    const body = html.split('<body>')[1];
    assert.ok(body, url);
    assert.doesNotMatch(body, /<div id="root"><\/div>/, url);
    assert.equal([...body.matchAll(/<main\b/g)].length, 1, url);
    assert.equal([...body.matchAll(/<h1\b/g)].length, 1, url);
    for (const [, href] of body.matchAll(/href="(\/[^/]+\/products\/[^"?#]+)"/g)) {
      assert.ok(existsSync(path.join(dist, href, 'index.html')), `${url} links to ${href}`);
      linkedProducts.add(href);
    }
    if (new URL(url).pathname.startsWith('/en/products/')) {
      assert.match(body, /Technical Specifications/, url);
      assert.match(body, /Dimensions &amp; Fit/, url);
      assert.match(body, /href="\/en\/contact"/, url);
      const heading = decode(body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]*>/g, ' '));
      assert.ok(heading.toLowerCase().includes(keywordPlan[basePath(url)].primaryKeyword), url);
    }
  }
  for (const url of urls.filter(value => new URL(value).pathname.includes('/products/'))) {
    assert.ok(linkedProducts.has(new URL(url).pathname), `Orphan product: ${url}`);
  }
});

test('static home manufacturing figures show their actual values without JavaScript', () => {
  const html = htmlFor(`${config.url}/en/`);
  const figures = [...html.matchAll(/class="font-mono text-4xl[^>]*>([\s\S]*?)<\/div>/g)]
    .map(([, content]) => content.replace(/<[^>]*>/g, ''));
  assert.deepEqual(figures, ['10+', '±0.001mm', '8+', '15+']);
});

test('home and every footer link directly to all ten canonical family pages', () => {
  const catalog = JSON.parse(readFileSync(path.join(root, 'content/catalog/products.json'), 'utf8'));
  const familyPaths = catalog.map(category => {
    const families = category.products.filter(product => !product.parentId);
    assert.equal(families.length, 1, category.id);
    return `/en/products/${families[0].id}`;
  });
  assert.equal(familyPaths.length, 10);
  const home = htmlFor(`${config.url}/en/`);
  const showcase = home.split('id="home-content"')[1].split('</section>')[0];
  for (const route of familyPaths) assert.ok(showcase.includes(`href="${route}"`), route);
  for (const url of urls) {
    const footer = htmlFor(url).split('<footer')[1].split('</footer>')[0];
    for (const route of familyPaths) {
      const localized = route.replace('/en/', '/' + new URL(url).pathname.split('/')[1] + '/');
      assert.ok(footer.includes(`href="${localized}"`), `${url}: ${localized}`);
    }
    assert.doesNotMatch(footer, /href="\/products\?category=/);
  }
});

test('all canonical pages publish the keyword plan with unique titles, descriptions and primary topics', () => {
  assert.deepEqual(Object.keys(keywordPlan).sort(), englishUrls.map(basePath).sort());
  const titles = new Set();
  const descriptions = new Set();
  const topics = new Set();
  for (const url of englishUrls) {
    const route = basePath(url);
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
  assert.equal(titles.size, englishUrls.length);
  assert.equal(descriptions.size, englishUrls.length);
  assert.equal(topics.size, englishUrls.length);
});

test('sitemap covers all public pages with unique HTTPS URLs and a matching robots directive', () => {
  assert.equal(urls.length, 43 * 9);
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
    if (basePath(url) !== '/') assert.ok(graph['@graph'].some(item => item['@type'] === 'BreadcrumbList'));
  }
  assert.equal(titles.size, urls.length);
});

test('product and article schema match each individual route without invented commercial data', () => {
  const products = urls.filter(url => new URL(url).pathname.includes('/products/'));
  const articles = urls.filter(url => new URL(url).pathname.includes('/blog/'));
  assert.equal(products.length, 34 * 9);
  assert.equal(articles.length, 3 * 9);
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

test('every language has translated first-response content, self canonical and reciprocal corresponding-page alternates', () => {
  const codes = ['en', 'zh-CN', 'es', 'fr', 'de', 'pt', 'ru', 'ar', 'ja'];
  const catalog = JSON.parse(readFileSync(path.join(root, 'content/catalog/products.json'), 'utf8'));
  const products = catalog.flatMap(category => category.products);
  for (const code of codes) {
    const prefix = code.toLowerCase();
    const dictionary = JSON.parse(readFileSync(path.join(root, `content/locales/${code}.json`), 'utf8'));
    const localizedUrls = urls.filter(url => new URL(url).pathname.startsWith(`/${prefix}/`));
    assert.equal(localizedUrls.length, 43);
    for (const url of localizedUrls) {
      const html = htmlFor(url);
      const route = basePath(url);
      assert.match(html, new RegExp(`<html lang="${code}" dir="${code === 'ar' ? 'rtl' : 'ltr'}"`));
      const bootstrap = JSON.parse(html.match(/<script id="language-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
      assert.equal(bootstrap.language, code);
      assert.deepEqual(bootstrap.dictionary, code === 'en' ? {} : dictionary);
      for (const alternate of [...codes, 'x-default']) {
        const target = `${config.url}/${alternate === 'x-default' ? 'en' : alternate.toLowerCase()}${route === '/' ? '/' : route}`;
        assert.ok(html.includes(`hrefLang="${alternate}" href="${target}"`) || html.includes(`hreflang="${alternate}" href="${target}"`), `${url}: ${alternate}`);
      }
      const product = products.find(item => route === `/products/${item.id}`);
      if (product && code !== 'en') {
        const text = dictionary[product.searchName || product.name];
        assert.ok(text, `${code}: product heading translation`);
        const heading = decode(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]*>/g, ' '));
        assert.ok(heading.includes(text), `${url}: translated H1 before JS`);
        assert.ok(decode(meta(html, 'description')).includes(dictionary[product.description]), `${url}: translated description`);
        const schema = graphFor(html)['@graph'].find(item => item['@type'] === 'Product');
        assert.equal(schema.name, dictionary[product.name]);
      }
      const page = graphFor(html)['@graph'].find(item => ['WebPage', 'AboutPage', 'ContactPage'].includes(item['@type']));
      assert.equal(page.inLanguage, code);
      for (const item of graphFor(html)['@graph'].find(item => item['@type'] === 'BreadcrumbList')?.itemListElement || []) assert.ok(item.item.startsWith(`${config.url}/${prefix}/`));
    }
  }
});
