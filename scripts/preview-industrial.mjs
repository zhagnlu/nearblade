import fs from 'node:fs';
import path from 'node:path';

const source = 'previews/light-theme';
const output = 'previews/industrial-theme';
const css = fs.readFileSync(path.join(output, 'theme.css'), 'utf8');
let count = 0;
for (const file of fs.readdirSync(source).filter(file => file.endsWith('.html'))) {
  let html = fs.readFileSync(path.join(source, file), 'utf8');
  html = html.replace('</style>', '</style><style>' + css + '</style>');
  html = html.replace('<title>Blue-gray theme preview</title>', '<title>Industrial charcoal and warm accent preview</title>');
  html = html.replace(/<section\b([^>]*)>([\s\S]*?)<\/section>/g, (match, attrs, content) => {
    if (!content.includes('About Rucheng Technology')) return match;
    return '<section' + attrs.replace(/class="([^"]*)"/, 'class="$1 home-about-preview"') + '>' + content + '</section>';
  });
  html = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/g, (match, attrs, content) => {
    const label = content.replace(/<[^>]*>/g, '').trim();
    if (!['Request Quote', 'Get Quote', 'Get in Touch'].includes(label)) return match;
    return '<a' + attrs.replace(/class="([^"]*)"/, 'class="$1 quote-accent"') + '>' + content + '</a>';
  });
  html = html.replace(/<button\b([^>]*type="submit"[^>]*)>/g, (match, attrs) =>
    '<button' + attrs.replace(/class="([^"]*)"/, 'class="$1 quote-accent"') + '>');
  fs.writeFileSync(path.join(output, file), html);
  count++;
}
console.log(`Generated ${count} industrial-theme visual previews`);
