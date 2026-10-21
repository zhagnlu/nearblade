import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';

const catalog = JSON.parse(readFileSync(new URL('../content/catalog/products.json', import.meta.url)));
const products = catalog.flatMap(category => category.products);
const byId = Object.fromEntries(products.map(product => [product.id, product]));

test('catalog follows all ten manual sections, in order, with no duplicate shear product', () => {
  assert.deepEqual(catalog.map(category => category.id), ['shear-blades', 'press-brake-tooling', 'rolling-shear-blades', 'slitting-knives', 'steel-rolling-blades', 'corrugated-paper-cutters', 'toothed-blades', 'doctor-blades', 'chipper-blades', 'crusher-blades']);
  assert.equal(catalog[0].products.length, 1);
  assert.deepEqual(byId['sb-001'].machineModels, ['Q11', 'QC12Y']);
  assert.equal(byId['sb-002'], undefined);
});

test('tooling, corrugated and doctor families include every explicitly listed product type', () => {
  assert.deepEqual(byId['pb-001'].variants, ['Gooseneck Punches', 'Straight Punches', '90° Tooling', '60° Tooling', '45° Tooling', '30° Tooling', 'R-profile Tooling', 'Cylindrical Tooling', 'U-profile Tooling', 'Embossing Dies', 'Container Dies', 'Light Pole Dies', 'Upper-tool Quick Clamps']);
  assert.deepEqual(byId['cp-001'].variants, ['Trimming and Slitting Knives', 'Three-gang Slotting Knives', 'Four-gang Slotting Knives', 'Thin Corrugated-line Blades']);
  assert.deepEqual(byId['db-001'].variants, ['Standard Doctor Blades', 'Combination Doctor Blades', 'Blue-steel Doctor Blades', 'Stainless-steel Doctor Blades', 'Ceramic Doctor Blades', 'Combination Blade Holders']);
  assert.deepEqual(byId['cr-001'].variants, ['Stationary Knives', 'Rotor Knives']);
  assert.equal(byId['cb-001'].machineModels.length, 13);
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


test('expanded product routes have a valid family, unique intent and matching media', () => {
  assert.equal(new Set(products.map(product => product.id)).size, products.length);
  const children = products.filter(product => product.parentId);
  assert.equal(children.length, 20);
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
  assert.equal(children.length, 8);
  assert.equal(new Set(children.map(product => product.toolingProfile)).size, 8);
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
  const silhouettes = children.map(product => readFileSync(new URL(`../public/images/products/tooling-v2/${product.toolingProfile}-section-v1.svg`, import.meta.url), 'utf8'));
  assert.equal(new Set(silhouettes).size, 8);
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
