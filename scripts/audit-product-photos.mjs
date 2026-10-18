// Local metadata audit. Visual sharpness and branding still require manual review.
// Usage: node scripts/audit-product-photos.mjs <image> [image ...]
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const files = process.argv.slice(2);
if (!files.length) throw new Error('Supply local product image paths.');
const results = files.map(file => {
  const data = readFileSync(file);
  const isAvif = data.subarray(4, 8).toString() === 'ftyp' && data.subarray(8, 32).includes(Buffer.from('avif'));
  let width, height;
  if (isAvif) {
    const offset = data.indexOf(Buffer.from('ispe'));
    if (offset < 0 || offset + 16 > data.length) throw new Error(`Missing AVIF dimensions: ${file}`);
    width = data.readUInt32BE(offset + 8);
    height = data.readUInt32BE(offset + 12);
  } else {
    const metadata = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
    width = Number(metadata.match(/pixelWidth:\s*(\d+)/)?.[1]);
    height = Number(metadata.match(/pixelHeight:\s*(\d+)/)?.[1]);
  }
  if (!width || !height) throw new Error(`Cannot read image dimensions: ${file}`);
  const edge = Math.max(width, height);
  return { file: path.relative(process.cwd(), file), width, height, format: isAvif ? 'avif' : 'system-detected', bytes: statSync(file).size,
    sha256: createHash('sha256').update(data).digest('hex'),
    resolution: edge >= 1200 ? 'preferred' : edge >= 960 ? 'conditional: inspect at 100%, content width up to 600 px' : 'below target',
    sharpness: 'manual review required', branding: 'manual review required', approved: false };
});
process.stdout.write(JSON.stringify(results, null, 2) + '\n');
