import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { root, languageCodes, collectMessages } from './extract-locales.mjs';

const keys = await collectMessages();
const english = JSON.parse(readFileSync(path.join(root, 'content/locales/en.json'), 'utf8'));
if (JSON.stringify(Object.keys(english).sort()) !== JSON.stringify(keys)) throw new Error('Page content changed. Run npm run i18n:extract and update all language dictionaries.');
const invariants = JSON.parse(readFileSync(path.join(root, 'content/locales/invariants.json'), 'utf8'));
mkdirSync(path.join(root, 'public/locales'), { recursive: true });
for (const code of languageCodes) {
  const dictionary = JSON.parse(readFileSync(path.join(root, 'content/locales', `${code}.json`), 'utf8'));
  if (JSON.stringify(Object.keys(dictionary).sort()) !== JSON.stringify(keys)) throw new Error(`Missing or extra keys in ${code}.`);
  for (const key of keys) {
    if (typeof dictionary[key] !== 'string' || !dictionary[key].trim()) throw new Error(`Empty translation: ${code}: ${key}`);
    if (invariants.includes(key) && dictionary[key] !== key) throw new Error(`Technical identifier changed: ${code}: ${key}`);
  }
  writeFileSync(path.join(root, 'public/locales', `${code}.json`), JSON.stringify(dictionary) + '\n');
}
console.log(`Validated and built ${languageCodes.length} local language packs (${keys.length} entries each).`);
