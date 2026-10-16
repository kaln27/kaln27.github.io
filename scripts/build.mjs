import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const entries = ['index.html', '404.html', 'about.html', '.nojekyll', 'assets', 'files', 'cv', 'introduction', 'publication', 'about', 'publications', 'resume'];

async function validate(filename) {
  const info = await stat(filename);
  if (info.isDirectory()) {
    for (const entry of await readdir(filename)) await validate(path.join(filename, entry));
    return;
  }
  if (!filename.endsWith('.html')) return;
  const html = await readFile(filename, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`Duplicate IDs in ${filename}`);
  for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/)/i.test(value)) continue;
    const url = new URL(value, `http://local/${path.relative(root, filename).split(path.sep).join('/')}`);
    let target = path.join(root, decodeURIComponent(url.pathname));
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    await stat(target);
    if (url.hash && target.endsWith('.html')) {
      const destination = target === filename ? html : await readFile(target, 'utf8');
      if (!destination.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) throw new Error(`Missing anchor: ${value} in ${filename}`);
    }
  }
}

// Validate only the public source, without traversing Git or generated output.
for (const entry of entries) await validate(path.join(root, entry));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of entries) await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
console.log('Built dist/ · Local page links and assets verified.');
