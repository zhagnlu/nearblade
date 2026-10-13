import fs from 'node:fs';
import path from 'node:path';

const source = 'previews/industrial-theme';
const output = 'previews/sky-theme';
const css = fs.readFileSync(path.join(output, 'theme.css'), 'utf8');
let count = 0;
for (const file of fs.readdirSync(source).filter(file => file.endsWith('.html'))) {
  let html = fs.readFileSync(path.join(source, file), 'utf8');
  html = html.replace('<body>', '<style>' + css + '</style><body>');
  html = html.replace('<title>Industrial charcoal and warm accent preview</title>', '<title>Sky blue industrial theme preview</title>');
  fs.writeFileSync(path.join(output, file), html);
  count++;
}
console.log(`Generated ${count} sky-blue visual previews`);
