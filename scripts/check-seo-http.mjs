import { JSDOM } from 'jsdom';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Read raw HTTP HTML only: scripts and subresources are never executed.
export async function checkSeoHttp(origin) {
  const base = new URL(origin).origin;
  const failures = [];
  const request = async path => {
    const response = await fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(20000) });
    return { status: response.status, location: response.headers.get('location'), xRobotsTag: response.headers.get('x-robots-tag'), body: await response.text() };
  };
  const sitemap = await request('/sitemap.xml');
  if (sitemap.status !== 200) throw new Error(`sitemap.xml returned ${sitemap.status}`);
  const xml = new JSDOM(sitemap.body, { contentType: 'text/xml' });
  const urls = [...xml.window.document.querySelectorAll('url > loc')].map(node => node.textContent.trim());
  xml.window.close();
  if (!urls.length) throw new Error('Sitemap contains no page URLs');
  if (new Set(urls).size !== urls.length) failures.push({ path: '/sitemap.xml', issue: 'Duplicate URLs' });
  const canonicalOrigin = new URL(urls[0]).origin;
  const paths = new Set(urls.map(url => new URL(url).pathname));
  const robots = await request('/robots.txt');
  if (robots.status !== 200 || !robots.body.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) {
    failures.push({ path: '/robots.txt', issue: 'Missing or incorrect sitemap directive' });
  }
  const pages = [];
  const titles = new Set();
  const descriptions = new Set();
  for (const expected of urls) {
    const path = new URL(expected).pathname;
    const result = await request(path);
    const issues = [];
    if (new URL(expected).origin !== canonicalOrigin || !expected.startsWith('https:')) issues.push('Inconsistent sitemap origin');
    if (result.status !== 200) issues.push(`Canonical URL returned ${result.status}${result.location ? ` -> ${result.location}` : ''}`);
    const dom = new JSDOM(result.body);
    const document = dom.window.document;
    const title = document.querySelector('title')?.textContent.trim();
    const description = document.querySelector('meta[name="description"]')?.content;
    if (!title || titles.has(title)) issues.push('Missing or duplicate title');
    if (!description || descriptions.has(description)) issues.push('Missing or duplicate description');
    titles.add(title); descriptions.add(description);
    if (document.querySelectorAll('h1').length !== 1) issues.push('Expected one H1');
    if ((document.querySelector('main')?.textContent.trim().length || 0) < 100) issues.push('Missing initial HTML main content');
    if (document.querySelectorAll('link[rel="canonical"]').length !== 1 || document.querySelector('link[rel="canonical"]')?.getAttribute('href') !== expected) issues.push('Incorrect canonical');
    if (/noindex/i.test(document.querySelector('meta[name="robots"]')?.content || '')) issues.push('Page has noindex');
    if (/\b(noindex|none)\b/i.test(result.xRobotsTag || '')) issues.push('HTTP X-Robots-Tag prevents indexing');
    const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')];
    if (!schemas.length) issues.push('Missing JSON-LD');
    const prefix = path.split('/')[1];
    const language = prefix === 'zh-cn' ? 'zh-CN' : prefix;
    if (document.documentElement.lang !== language) issues.push('Incorrect HTML language');
    if (document.documentElement.dir !== (language === 'ar' ? 'rtl' : 'ltr')) issues.push('Incorrect text direction');
    const alternates = [...document.querySelectorAll('link[rel="alternate"][hreflang]')];
    if (alternates.length !== 10) issues.push('Expected nine language alternates plus x-default');
    for (const alternate of alternates) {
      const code = alternate.hreflang;
      const expectedPath = '/' + (code === 'x-default' ? 'en' : code.toLowerCase()) + path.slice(prefix.length + 1);
      if (alternate.href !== canonicalOrigin + expectedPath || !paths.has(expectedPath)) issues.push(`Incorrect alternate: ${code}`);
    }
    for (const link of document.querySelectorAll('main a[href^="/"], header a[href^="/"], footer a[href^="/"]')) {
      const target = new URL(link.getAttribute('href'), expected);
      if (target.origin === canonicalOrigin && paths.has(target.pathname) && !link.closest('.language-switcher') && target.pathname.split('/')[1] !== prefix) issues.push('Internal navigation changes language');
    }
    for (const script of schemas) {
      try { JSON.parse(script.textContent); } catch { issues.push('Invalid JSON-LD'); }
    }
    for (const link of document.querySelectorAll('a[href]')) {
      const target = new URL(link.getAttribute('href'), expected);
      if (target.origin === canonicalOrigin && !paths.has(target.pathname)) issues.push(`Unknown internal page link: ${target.pathname}`);
    }
    dom.window.close();
    pages.push({ path, status: result.status, issues: [...new Set(issues)] });
    for (const issue of new Set(issues)) failures.push({ path, issue });
  }
  // Exercise HTTP redirects and query retention, not meta refresh or browser JS.
  for (const path of paths) {
    const variants = path.endsWith('/') ? [path.slice(0, -1), `${path}index.html`] : [`${path}/`, `${path}/index.html`];
    for (const variant of variants) {
      const result = await request(`${variant}?seo_check=1`);
      const target = result.location && new URL(result.location, base);
      if (result.status !== 301 || !target || ![base, canonicalOrigin].includes(target.origin) || target.pathname !== path || target.search !== '?seo_check=1') failures.push({ path: variant, issue: 'Expected direct 301 to canonical with query preserved' });
    }
  }
  for (const prefix of ['', '/en', '/zh-cn', '/es', '/fr', '/de', '/pt', '/ru', '/ar', '/ja']) for (const [from, to] of [['sb-002', 'sb-001'], ['tb-001', 'cp-001']]) {
    for (const suffix of ['', '/', '/index.html']) {
      const path = `${prefix}/products/${from}${suffix}`;
      const result = await request(`${path}?seo_check=1`);
      const target = result.location && new URL(result.location, base);
      if (result.status !== 301 || !target || ![base, canonicalOrigin].includes(target.origin) || target.pathname !== `${prefix || "/en"}/products/${to}` || target.search !== '?seo_check=1') failures.push({ path, issue: 'Expected direct retired-product 301' });
    }
  }
  for (const path of ['/seo-audit-missing-page', '/products/seo-audit-missing-product', '/blog/seo-audit-missing-article', '/assets/seo-audit-missing.js']) {
    if ((await request(path)).status !== 404) failures.push({ path, issue: 'Missing URL did not return HTTP 404' });
  }
  return { checkedAt: new Date().toISOString(), origin: base, canonicalOrigin, pageCount: pages.length, passed: failures.length === 0, pages, failures };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [origin, output] = process.argv.slice(2);
  if (!origin) throw new Error('Usage: npm run check:seo -- https://www.nearblade.com [report.json]');
  const report = await checkSeoHttp(origin);
  if (output) writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
}
