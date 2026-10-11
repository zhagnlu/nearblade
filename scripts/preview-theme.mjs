import { build } from 'esbuild';
import { createRequire } from 'node:module';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import helmet from 'react-helmet-async';
import fs from 'node:fs';
const { HelmetProvider } = helmet;
const bundle = path.resolve('scripts/.preview-routes.cjs');
await build({stdin:{contents:"export { routes } from './src/routes'; export { getAllProducts } from './src/data/products';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'cjs',packages:'external',alias:{'@':path.resolve('src')},outfile:bundle,plugins:[{name:'preview-counter-values',setup(builder){builder.onLoad({filter:/StatCounter\.tsx$/},args=>({contents:fs.readFileSync(args.path,'utf8').replace('useState(0)','useState(value)'),loader:'tsx'}));}}]});
try {
 const { routes, getAllProducts } = createRequire(import.meta.url)(bundle);
 const css = fs.readFileSync('dist/assets/' + fs.readdirSync('dist/assets').find(x=>x.endsWith('.css')), 'utf8');
 const pages = [['/', 'index.html'], ['/products','products.html'], ['/about','about.html'], ['/equipment','equipment.html'], ['/contact','contact.html']];
 pages.push(...getAllProducts().map(product => ['/products/'+product.id,'product-'+product.id+'.html']));
 fs.mkdirSync('previews/light-theme',{recursive:true});
 for (const [path,file] of pages) {
  const router = createMemoryRouter(routes,{initialEntries:[path]});
  const originalError = console.error;
  console.error = (...args) => {
   if (String(args[0]).includes('useLayoutEffect does nothing on the server')) return;
   originalError(...args);
  };
  let html;
  try { html = renderToString(React.createElement(HelmetProvider,null,React.createElement(RouterProvider,{router}))); } finally { console.error = originalError; }
  html=html.replaceAll('src="/images/','src="../../public/images/');
  for (const [route,target] of [...pages].sort((a,b)=>b[0].length-a[0].length)) html=html.replaceAll('href="'+route+'"','href="'+target+'"');
  html=html.replace(/href="\/products\?[^\"]*"/g,'href="products.html"').replace(/href="\/products\/[^\"]*"/g,'href="product-detail.html"');
  fs.writeFileSync('previews/light-theme/'+file,'<!doctype html><html lang="en"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Blue-gray theme preview</title><style>'+css+'</style><body>'+html+'</body></html>');
  router.dispose();
 }
 fs.copyFileSync('previews/light-theme/product-pb-001.html','previews/light-theme/product-detail.html');
 console.log('Generated static previews for all pages and all 7 product details');
} finally { fs.unlinkSync(bundle); }
