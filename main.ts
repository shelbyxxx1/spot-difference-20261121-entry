import { readdir, mkdir, rm, cp, writeFile } from 'node:fs/promises';
import { dirname, resolve, join, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const source = dirname(fileURLToPath(import.meta.url));
const output = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
const sourceFromOutput = relative(output, source);
function contains(relativePath: string) { return relativePath === '' || (relativePath !== '..' && !relativePath.startsWith('../') && !isAbsolute(relativePath)); }
const protectedDirectories = ['game', 'screenshots', 'vendor', '.git', '.makefun'];
if (contains(sourceFromOutput) || protectedDirectories.some(entry => contains(relative(join(source, entry), output)))) {
  throw new Error('Output must not overwrite the source repository, its parents, or game assets.');
}
await mkdir(output, { recursive: true });
for (const entry of await readdir(output)) await rm(join(output, entry), { recursive: true, force: true });
for (const entry of ['game', 'screenshots']) await cp(join(source, entry), join(output, entry), { recursive: true });
await writeFile(join(output, 'dossier.json'), buildDossier(output, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000
}));
console.log(`Senja Split packaged in ${output}`);
