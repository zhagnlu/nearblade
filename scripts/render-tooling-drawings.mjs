import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const bundle = new URL('./.tooling-drawings.cjs', import.meta.url);
try {
  await build({ entryPoints: ['src/components/common/ToolingProfileDrawing.tsx'], outfile: bundle.pathname, bundle: true, platform: 'node', format: 'cjs', packages: 'external' });
  const { ToolingProfileDrawing } = createRequire(import.meta.url)(bundle.pathname);
  const details = JSON.parse(readFileSync(new URL('../content/catalog/tooling-details.json', import.meta.url)));
  const output = new URL('../public/images/products/tooling-v2/', import.meta.url);
  mkdirSync(output, { recursive: true });
  for (const item of Object.values(details)) {
    for (const dark of [false, true]) {
      const svg = renderToStaticMarkup(React.createElement(ToolingProfileDrawing, { profile: item.toolingProfile, dark }))
        .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1020" ')
        .replace('</defs>', `</defs><rect width="900" height="510" fill="${dark ? '#263b4f' : '#ffffff'}"/>`);
      writeFileSync(new URL(`${item.toolingProfile}-${dark ? 'navy' : 'section'}-v1.svg`, output), svg);
    }
  }
  console.log(`Rendered ${Object.keys(details).length} distinct tooling sections in two color schemes.`);
} finally { rmSync(bundle, { force: true }); }
