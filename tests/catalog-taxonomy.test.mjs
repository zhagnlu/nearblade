import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const catalog = JSON.parse(readFileSync(new URL('../content/catalog/products.json', import.meta.url)));
const products = catalog.flatMap(category => category.products);
const byId = Object.fromEntries(products.map(product => [product.id, product]));

test('catalog follows all ten manual sections, in order, with no duplicate shear product', () => {
  assert.deepEqual(catalog.map(category => category.id), ['shear-blades', 'press-brake-tooling', 'rolling-shear-blades', 'slitting-knives', 'steel-rolling-blades', 'corrugated-paper-cutters', 'toothed-blades', 'doctor-blades', 'chipper-blades', 'crusher-blades']);
  assert.equal(catalog[0].products.length, 1);
  assert.deepEqual(byId['sb-001'].machineModels, ['Q11', 'QC12Y']);
  assert.equal(byId['sb-002'], undefined);
});

test('functional groups retain manual scope without treating angles, materials or accessories as parallel products', () => {
  const group = (id, title) => byId[id].variantGroups.find(item => item.title === title)?.items;
  assert.deepEqual(group('pb-001', 'Upper punches'), ['Straight Punches', 'Acute-angle Punches', 'Gooseneck Punches']);
  assert.ok(group('pb-001', 'Lower dies').length);
  assert.deepEqual(group('pb-001', 'Tool angles'), ['90°', '60°', '45°', '30°']);
  assert.deepEqual(group('pb-001', 'Working profiles'), ['R-profile Tooling', 'Cylindrical Tooling', 'U-profile Tooling', 'Custom Profile Forming Tooling']);
  assert.deepEqual(group('pb-001', 'Applications'), ['Container Dies', 'Light Pole Dies']);
  assert.deepEqual(group('pb-001', 'Clamping accessories'), ['Upper-tool Quick Clamps']);
  assert.deepEqual(group('cp-001', 'Slitting and trimming'), ['Trimming and Slitting Knives', 'Thin Corrugated-line Blades']);
  assert.deepEqual(group('cp-001', 'Machine configurations'), ['Three-gang configuration', 'Four-gang configuration']);
  assert.deepEqual(group('db-001', 'Blade formats'), ['Standard Doctor Blades', 'Combination Doctor Blades']);
  assert.deepEqual(group('db-001', 'Blade construction'), ['Ceramic Doctor Blades']);
  assert.deepEqual(group('db-001', 'Base materials'), ['Carbon steel', 'Blue steel', 'Stainless steel']);
  assert.deepEqual(group('db-001', 'Clamping accessories'), ['Combination Blade Holders']);
  assert.deepEqual(group('cr-001', 'Knife positions'), ['Rotor Knives', 'Stationary Knives']);
  assert.equal(byId['cb-001'].machineModels.length, 13);
});

test('catalog terminology and prerendered metadata distinguish cutting processes without adding unconfirmed stock', () => {
  const expected = { 'rs-001': 'Metal Rotary Slitter Knives', 'sr-001': 'Steel Mill Shear Blades', 'cr-001': 'Granulator Knives' };
  for (const [id, name] of Object.entries(expected)) {
    assert.equal(byId[id].name, name);
    const html = readFileSync(new URL(`../dist/products/${id}/index.html`, import.meta.url), 'utf8');
    assert.ok(html.includes(`<title data-rh="true">${name} | Nearblade</title>`));
    assert.ok(html.includes(byId[id].description));
  }
  assert.match(byId['sk-001'].description, /tube-line.*cutting station/);
  assert.match(byId['cb-001'].description, /veneer peeling and slicing require different tooling/);
  assert.ok(!byId['cr-001'].feedstocks.includes('PT'));
  assert.ok(!byId['db-001'].materials.includes('Ceramic'));
  assert.deepEqual(byId['pb-001'].materials, []);
  assert.deepEqual(byId['rs-001'].materials, []);
  assert.equal(products.length, 34);
  for (const id of ['pb-001', 'cp-001', 'db-001']) {
    const html = readFileSync(new URL(`../dist/products/${id}/index.html`, import.meta.url), 'utf8');
    assert.ok(html.includes('product-type-groups'));
    for (const group of byId[id].variantGroups) assert.ok(html.includes(`>${group.title}</h3>`));
  }
});

test('series navigation covers every existing child once and separates clamping accessories', () => {
  for (const family of products.filter(product => !product.parentId)) {
    const children = products.filter(product => product.parentId === family.id);
    const groupedIds = (family.productGroups || []).flatMap(group => group.productIds);
    assert.deepEqual([...groupedIds].sort(), children.map(product => product.id).sort(), family.id);
    assert.equal(new Set(groupedIds).size, groupedIds.length, family.id);
    assert.equal(family.selectionFields.length, 3, family.id);
    if (!children.length) continue;
    const dom = new JSDOM(readFileSync(new URL(`../dist/products/${family.id}/index.html`, import.meta.url), 'utf8'));
    try {
      const section = dom.window.document.getElementById(`${family.id}-products`);
      assert.ok(section, family.id);
      assert.equal(section.querySelectorAll('a').length, children.length);
      for (const child of children) {
        const link = section.querySelector(`a[href="/products/${child.id}"]`);
        assert.ok(link, child.id);
        for (const field of child.selectionFields) assert.ok(link.textContent.includes(field), child.id);
      }
    } finally { dom.window.close(); }
  }
  for (const [family, child] of [['pb-001', 'pb-quick-clamps'], ['db-001', 'db-holders']]) {
    assert.deepEqual(byId[family].productGroups.find(group => group.title === 'Clamping accessories').productIds, [child]);
  }
});

test('product quote actions reach the on-page form with product context', () => {
  for (const product of products) {
    const dom = new JSDOM(readFileSync(new URL(`../dist/products/${product.id}/index.html`, import.meta.url), 'utf8'));
    try {
      const document = dom.window.document;
      assert.equal(document.querySelectorAll('a[href="#product-inquiry"]').length, 2, product.id);
      assert.equal(document.querySelector('#product-inquiry input[name="subject"]').value, `Quotation request: ${product.name}`);
    } finally { dom.window.close(); }
  }
});

test('steel rolling is distinct from rolling shear, and corrugated cutters from toothed knives', () => {
  assert.notEqual(byId['rs-001'].category, byId['sr-001'].category);
  assert.notEqual(byId['cp-001'].category, byId['tb-002'].category);
  assert.notEqual(byId['cp-001'].image, byId['tb-002'].image);
  assert.ok(byId['tb-002'].applications.includes('Food processing machinery'));
});

test('all catalog images exist and retired routes redirect without entering the sitemap', () => {
  for (const product of products) {
    for (const image of [product.image, product.heroImage, ...(product.images || [])].filter(Boolean)) {
      assert.ok(existsSync(new URL(`../public${image}`, import.meta.url)), image);
    }
  }
  const sitemap = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
  for (const [from, to] of [['sb-002', 'sb-001'], ['tb-001', 'cp-001']]) {
    assert.ok(!sitemap.includes(`/products/${from}`));
    const redirect = readFileSync(new URL(`../dist/products/${from}/index.html`, import.meta.url), 'utf8');
    assert.ok(redirect.includes(`0;url=/products/${to}`));
  }
});

test('product Heroes use product imagery while engineering guides remain in the page body', () => {
  for (const product of products) {
    assert.match(product.heroImage || '', /\.(webp|png|jpe?g)$/i, product.id);
    const html = readFileSync(new URL(`../dist/products/${product.id}/index.html`, import.meta.url), 'utf8');
    const hero = html.match(/<section\b[\s\S]*?<\/section>/)?.[0];
    assert.ok(hero?.includes(`src="${product.heroImage}"`), product.id);
    assert.doesNotMatch(hero, /blade-profile-drawing|tooling-profile-drawing/);
    assert.ok(html.includes('Dimensions &amp; Fit'), product.id);
  }
});

test('related product cards show product images even when the detail gallery uses specifications', () => {
  const html = readFileSync(new URL('../dist/products/pb-straight-punch/index.html', import.meta.url), 'utf8');
  for (const id of ['pb-acute-punch', 'pb-gooseneck-punch', 'pb-single-v-die']) {
    const card = [...html.matchAll(/<a\b[^>]*class="product-detail-related[^>]*>[\s\S]*?<\/a>/g)]
      .map(match => match[0]).find(card => card.includes(`href="/products/${id}"`));
    assert.ok(card, id);
    assert.ok(card.includes(`src="${byId[id].heroImage}"`), id);
    assert.doesNotMatch(card, /src="[^\"]+\.svg"/);
  }
});


test('expanded product routes have a valid family, unique intent and matching media', () => {
  assert.equal(new Set(products.map(product => product.id)).size, products.length);
  const children = products.filter(product => product.parentId);
  assert.equal(children.length, 24);
  assert.equal(new Set(children.map(product => product.description)).size, children.length);
  for (const product of children) {
    const parent = byId[product.parentId];
    assert.ok(parent && !parent.parentId, product.id);
    assert.equal(parent.category, product.category);
    assert.ok(product.selectionFields.length >= 3);
    if (product.mediaMode === 'specification') assert.deepEqual(product.images, []);
    const html = readFileSync(new URL(`../dist/products/${product.id}/index.html`, import.meta.url), 'utf8');
    assert.ok(html.includes(`/products/${product.id}`));
    assert.doesNotMatch(html, /alibaba\.com|Catalog reference|Product-family examples/);
  }
});

test('each brake-tool subtype has its own geometry, process and dimensional guide', () => {
  const details = JSON.parse(readFileSync(new URL('../content/catalog/tooling-details.json', import.meta.url)));
  const children = products.filter(product => product.parentId === 'pb-001');
  assert.equal(children.length, 12);
  assert.equal(new Set(children.map(product => product.toolingProfile)).size, 12);
  for (const product of children) {
    const guide = details[product.id];
    assert.equal(guide.toolingProfile, product.toolingProfile);
    assert.equal(guide.description, product.description);
    assert.equal(guide.drawing, 'tooling');
    assert.deepEqual(product.selectionFields, guide.dimensions.map(dimension => dimension.label));
    assert.ok(guide.process && guide.compatibility && guide.inspection.length >= 2);
    assert.ok(product.heroImage.includes('/tooling-v2/'));
    const html = readFileSync(new URL(`../dist/products/${product.id}/index.html`, import.meta.url), 'utf8');
    assert.ok(html.includes(product.description));
  }
  assert.match(details['pb-radius-tooling'].process, /part radius and tool radius are separate/);
  assert.match(details['pb-u-forming'].process, /matching lower cavity/);
  assert.match(details['pb-light-pole'].compatibility, /part removal/);
  assert.equal(details['pb-quick-clamps'].role, 'Clamping accessory');
  assert.doesNotMatch(JSON.stringify(details['pb-quick-clamps']), /V-opening|lower.die opening|punch angle/i);
  const silhouettes = children.map(product => readFileSync(new URL(`../public/images/products/tooling-v2/${product.toolingProfile}-section-${['straight-punch', 'gooseneck-punch', 'double-v-die', 'multi-v-die'].includes(product.toolingProfile) ? 'v2' : 'v1'}.svg`, import.meta.url), 'utf8'));
  assert.equal(new Set(silhouettes).size, 12);
});

test('new upper and lower tooling retains old URLs and distinguishes process and changeover', () => {
  const details = JSON.parse(readFileSync(new URL('../content/catalog/tooling-details.json', import.meta.url)));
  const groups = byId['pb-001'].productGroups;
  assert.deepEqual(groups.find(group => group.title === 'Lower dies').productIds, ['pb-single-v-die', 'pb-double-v-die', 'pb-multi-v-die']);
  assert.equal(details['pb-acute-punch'].role, 'Upper punch');
  assert.match(details['pb-acute-punch'].process, /not the finished part angle/);
  assert.match(details['pb-acute-punch'].process, /separate flattening operation/);
  assert.match(details['pb-single-v-die'].process, /surface marking remains possible/);
  assert.match(details['pb-double-v-die'].process, /same-face grooves require repositioning/);
  assert.match(details['pb-double-v-die'].inspection.join(' '), /each groove/);
  for (const id of ['pb-single-v-die', 'pb-double-v-die', 'pb-multi-v-die']) {
    assert.equal(details[id].role, 'Lower die');
    assert.notEqual(byId[id].mediaMode, 'specification');
    const html = readFileSync(new URL(`../dist/products/${id}/index.html`, import.meta.url), 'utf8');
    assert.ok(html.includes('tooling-profile-drawing'));
    assert.ok(!html.includes('Straight punch section'));
  }
  for (const id of ['pb-straight-punch', 'pb-gooseneck-punch', 'pb-radius-tooling', 'pb-u-forming', 'pb-embossing', 'pb-container', 'pb-light-pole', 'pb-quick-clamps']) {
    assert.equal(byId[id].parentId, 'pb-001');
  }
});

test('blade routes use explicit process guides and distinguish cutting systems', () => {
  const details = JSON.parse(readFileSync(new URL('../content/catalog/blade-details.json', import.meta.url)));
  const blades = products.filter(product => product.category !== 'press-brake-tooling');
  assert.equal(blades.length, 21);
  assert.deepEqual(Object.keys(details).sort(), blades.map(product => product.id).sort());
  for (const product of blades) {
    const guide = details[product.id];
    assert.equal(guide.bladeProfile, product.bladeProfile, product.id);
    assert.ok(guide.process && guide.dimensions.length === 3 && guide.compatibility && guide.inspection.length >= 2, product.id);
    if (product.parentId) assert.deepEqual(product.selectionFields, guide.dimensions.map(dimension => dimension.label));
    for (const asset of [product.image, product.heroImage, ...(product.images || [])].filter(Boolean)) {
      assert.doesNotMatch(asset, /images\/manual\/|manual-series\/|catalog-hero/, product.id);
    }
    assert.ok(existsSync(new URL(`../public/images/products/blades-v2/${guide.bladeProfile}-section-v1.svg`, import.meta.url)));
  }
  assert.notEqual(details['rs-001'].bladeProfile, details['sk-001'].bladeProfile);
  assert.notEqual(details['cp-thin-slitter'].bladeProfile, details['cp-slotting'].bladeProfile);
  assert.notEqual(details['cr-rotor'].bladeProfile, details['cr-stationary'].bladeProfile);
  assert.equal(details['db-holders'].bladeProfile, 'doctor-holder');
  assert.match(details['db-flexo'].process, /containment blades/);
  assert.match(details['sr-casting'].dimensions[0].detail, /process name alone does not define/);
  assert.equal(byId['rs-001'].tolerance, 'To approved drawing');
  assert.match(details['cp-thin-slitter'].process, /scoring tool forms a crease/);
});

// A title and a side-on photograph cannot establish a punch section.
test('unverified straight-punch photo stays withdrawn and multi-V has a separate fixed-groove guide', () => {
  const details = JSON.parse(readFileSync(new URL('../content/catalog/tooling-details.json', import.meta.url)));
  assert.notEqual(byId['pb-straight-punch'].mediaMode, 'specification');
  assert.match(byId['pb-straight-punch'].image, /straight-punch-installed-white-v2\.webp$/);
  for (const product of products) {
    const html = readFileSync(new URL(`../dist/products/${product.id}/index.html`, import.meta.url), 'utf8');
    assert.ok(!html.includes('straight-punch-white-v1.webp'), product.id);
  }
  assert.match(details['pb-multi-v-die'].process, /distinct from adjustable-V and rolling-contact/);
  assert.match(details['pb-multi-v-die'].process, /working height after rotation/);
  assert.match(details['pb-multi-v-die'].compatibility, /load of the active groove/);
  const svg = readFileSync(new URL('../public/images/products/tooling-v2/multi-v-die-section-v2.svg', import.meta.url), 'utf8');
  for (const label of ['V1', 'V2', 'V3']) assert.ok(svg.includes(`>${label}</text>`), label);
});

test('reviewed brake-tool introductions use photos before the lower dimensional guide, matching the gooseneck page', () => {
  for (const id of ['pb-straight-punch', 'pb-acute-punch', 'pb-gooseneck-punch', 'pb-single-v-die', 'pb-double-v-die', 'pb-multi-v-die']) {
    const product = byId[id];
    assert.notEqual(product.mediaMode, 'specification', id);
    assert.ok(product.images.length > 0, id);
    assert.ok(product.images.every(image => /\.webp$/.test(image)), id);
    const document = new JSDOM(readFileSync(new URL(`../dist/products/${id}/index.html`, import.meta.url), 'utf8')).window.document;
    const content = document.querySelector('#product-content');
    const overview = content.querySelector('.product-photo-stage');
    const dimensions = content.querySelector('section[aria-label="Product dimensions and fit"]');
    assert.equal(overview.querySelector('img').getAttribute('src'), product.image, id);
    assert.equal(overview.querySelector('svg.tooling-profile-drawing'), null, id);
    assert.ok(dimensions.querySelector('svg.tooling-profile-drawing'), id);
    assert.ok(overview.compareDocumentPosition(dimensions) & 4, id);
  }
});
