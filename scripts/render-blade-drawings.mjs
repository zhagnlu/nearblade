import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const bundle = new URL('./.blade-drawings.cjs', import.meta.url);
try {
  await build({ entryPoints: ['src/components/common/BladeProfileDrawing.tsx'], outfile: bundle.pathname, bundle: true, platform: 'node', format: 'cjs', packages: 'external' });
  const { BladeProfileDrawing } = createRequire(import.meta.url)(bundle.pathname);
  const details = JSON.parse(readFileSync(new URL('../content/catalog/blade-details.json', import.meta.url)));
  const profiles = [...new Set(Object.values(details).map(item => item.bladeProfile))];
  const output = new URL('../public/images/products/blades-v2/', import.meta.url);
  mkdirSync(output, { recursive: true });
  for (const profile of profiles) for (const dark of [false, true]) {
    const svg = renderToStaticMarkup(React.createElement(BladeProfileDrawing, { profile, dark }))
      .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1020" ')
      .replace('</defs>', `</defs><rect width="900" height="510" fill="${dark ? '#263b4f' : '#ffffff'}"/>`);
    writeFileSync(new URL(`${profile}-${dark ? 'navy' : 'section'}-v1.svg`, output), svg);
  }
  console.log(`Rendered ${profiles.length} blade profiles in two color schemes.`);
} finally { rmSync(bundle, { force: true }); }
