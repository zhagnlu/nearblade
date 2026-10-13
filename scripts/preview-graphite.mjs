import fs from 'node:fs';
import path from 'node:path';

// A separate visual variant: the application theme remains unchanged.
const source = 'previews/light-theme';
const output = 'previews/graphite-theme';
const css = fs.readFileSync(path.join(output, 'theme.css'), 'utf8');
let count = 0;
for (const file of fs.readdirSync(source).filter(file => file.endsWith('.html'))) {
  let html = fs.readFileSync(path.join(source, file), 'utf8');
  html = html.replace('</style>', '</style><style>' + css + '</style>');
  html = html.replace('<title>Blue-gray theme preview</title>', '<title>Graphite and titanium theme preview</title>');
  fs.writeFileSync(path.join(output, file), html);
  count++;
}
console.log(`Generated ${count} graphite-theme visual previews`);
