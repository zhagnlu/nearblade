import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { JSDOM, VirtualConsole } from 'jsdom';

const dist = new URL('../dist/', import.meta.url);
const read = file => readFileSync(new URL(file, dist), 'utf8');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(check) {
  for (let attempt = 0; attempt < 150; attempt++) {
    if (check()) return;
    await delay(10);
  }
  assert.ok(check(), 'Timed out waiting for the page update');
}

function page(route) {
  const html = read(route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
  const errors = [];
  const console = new VirtualConsole();
  console.on('error', (...args) => errors.push(args.map(String).join(' ')));
  console.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, {
    url: `https://www.nearblade.com${route}`, runScripts: 'outside-only',
    pretendToBeVisual: true, virtualConsole: console,
  });
  const { window } = dom;
  window.scrollTo = () => {};
  Object.assign(window, { Request, Response, Headers, AbortController, AbortSignal });
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.fetch = async path => ({ ok: true, json: async () => JSON.parse(read(path.slice(1))) });
  window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  window.HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
    this.dispatchEvent(new window.Event('close'));
  };
  return {
    dom, window, document: window.document, errors,
    start() {
      const script = html.match(/<script\b[^>]*src="([^"]+)"/)?.[1];
      assert.ok(script, 'Published browser bundle');
      window.eval(read(script.slice(1)));
    },
  };
}

test('published home and product pages hydrate their existing content and form IDs', async () => {
  for (const route of ['/', '/products/sb-001', '/products/pb-radius-tooling']) {
    const view = page(route);
    try {
      const root = view.document.getElementById('root');
      const content = root.firstElementChild;
      const heading = view.document.querySelector('h1');
      const input = view.document.querySelector('input[name="name"]');
      const inputId = input.id;
      input.value = 'Typed before JavaScript';
      assert.ok(view.document.querySelector('main').textContent.trim());
      view.start();
      await waitFor(() => view.window.localStorage.getItem('nearblade-language') === 'en');
      assert.equal(root.firstElementChild, content, route);
      assert.equal(view.document.querySelector('h1'), heading, route);
      assert.equal(view.document.querySelector('input[name="name"]'), input, route);
      assert.equal(input.id, inputId, route);
      assert.equal(input.value, 'Typed before JavaScript', route);
      assert.ok([...view.document.querySelectorAll('label')].some(label => label.htmlFor === inputId));
      assert.deepEqual(view.errors, [], route);
    } finally { view.dom.window.close(); }
  }
});

test('hydrated gallery, language switching and internal navigation retain interactions and typed form values', async () => {
  const view = page('/products/sb-001');
  const { document, window } = view;
  try {
    view.start();
    await waitFor(() => window.localStorage.getItem('nearblade-language') === 'en');
    const input = document.querySelector('input[name="name"]');
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, 'Preview visitor');
    input.dispatchEvent(new window.Event('input', { bubbles: true }));

    const thumbnail = document.querySelectorAll('button[aria-label="Show product overview"]')[1];
    assert.ok(thumbnail);
    thumbnail.click();
    await waitFor(() => thumbnail.getAttribute('aria-pressed') === 'true');
    document.querySelector('[role="button"][aria-label="Enlarge Sheet Metal Shear Blades image"]').click();
    await waitFor(() => document.querySelector('dialog[open]'));
    assert.equal(document.querySelector('dialog img').getAttribute('src'), thumbnail.querySelector('img').getAttribute('src'));
    document.querySelector('dialog button[aria-label="Close"]').click();
    await waitFor(() => !document.querySelector('dialog'));

    const selector = document.getElementById('site-language');
    selector.value = 'zh-CN';
    selector.dispatchEvent(new window.Event('change', { bubbles: true }));
    await waitFor(() => document.documentElement.lang === 'zh-CN');
    assert.equal(input.value, 'Preview visitor');
    assert.match(window.location.search, /lang=zh-CN/);
    assert.ok(document.querySelector('h1').textContent.includes('剪板'));

    const productLink = document.querySelector('a[href="/products"]');
    productLink.click();
    await waitFor(() => window.location.pathname === '/products');
    await waitFor(() => document.querySelector('h1').textContent.includes('工业'));
    assert.equal(document.documentElement.lang, 'zh-CN');
    assert.deepEqual(view.errors, []);
  } finally { view.dom.window.close(); }
});

test('category selection preserves the chosen language and grouped child navigation stays interactive', async () => {
  const view = page('/products');
  const { document, window } = view;
  try {
    view.start();
    await waitFor(() => window.localStorage.getItem('nearblade-language') === 'en');
    const language = document.getElementById('site-language');
    language.value = 'zh-CN';
    language.dispatchEvent(new window.Event('change', { bubbles: true }));
    await waitFor(() => window.location.search.includes('lang=zh-CN'));
    const buttons = [...document.querySelectorAll('.catalog-filter button')];
    buttons.find(button => button.textContent === '折弯机模具').click();
    await waitFor(() => document.querySelectorAll('.catalog-category').length === 1);
    assert.equal(new URLSearchParams(window.location.search).get('lang'), 'zh-CN');
    assert.equal(new URLSearchParams(window.location.search).get('category'), 'press-brake-tooling');
    assert.equal(document.querySelector('.catalog-filter button[aria-pressed="true"]').textContent, '折弯机模具');
    document.querySelector('#pb-001-products a[href="/products/pb-quick-clamps"]').click();
    await waitFor(() => window.location.pathname === '/products/pb-quick-clamps');
    assert.equal(document.documentElement.lang, 'zh-CN');
    assert.equal(document.querySelector('#product-inquiry input[name="subject"]').value, 'Quotation request: Upper-tool Quick Clamps');
    assert.deepEqual(view.errors, []);
  } finally { view.dom.window.close(); }
});
