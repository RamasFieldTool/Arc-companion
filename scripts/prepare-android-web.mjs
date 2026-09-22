import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');

const excludedTopLevel = new Set([
  '.git',
  '.github',
  'android',
  'dist',
  'node_modules',
  'scripts'
]);

const excludedFiles = new Set([
  'package.json',
  'package-lock.json',
  'capacitor.config.json',
  '.gitignore',
  'README.md'
]);

const allowedExtensions = new Set([
  '.html', '.css', '.js', '.json',
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf',
  '.txt'
]);

async function copyEntry(source, destination, relativeParts = []) {
  const info = await stat(source);

  if (info.isSymbolicLink?.()) {
    throw new Error(`Refusing to package symbolic link: ${source}`);
  }

  if (info.isDirectory()) {
    const name = path.basename(source);
    if (relativeParts.length === 0 && excludedTopLevel.has(name)) return;

    await mkdir(destination, { recursive: true });
    for (const entry of await readdir(source)) {
      await copyEntry(
        path.join(source, entry),
        path.join(destination, entry),
        [...relativeParts, entry]
      );
    }
    return;
  }

  if (!info.isFile()) return;

  const basename = path.basename(source);
  if (relativeParts.length === 1 && excludedFiles.has(basename)) return;

  const ext = path.extname(source).toLowerCase();
  if (!allowedExtensions.has(ext)) return;

  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of await readdir(root)) {
  if (excludedTopLevel.has(entry) || excludedFiles.has(entry)) continue;
  await copyEntry(path.join(root, entry), path.join(out, entry), [entry]);
}

const indexPath = path.join(out, 'index.html');
try {
  const indexInfo = await stat(indexPath);
  if (!indexInfo.isFile()) throw new Error();
} catch {
  throw new Error('Android web bundle is invalid: dist/index.html is missing.');
}

console.log('Android web snapshot prepared in dist/.');
