import { globSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

type ExportTarget = string | { types: string; import: string };

const PACKAGE_ROOT = fileURLToPath(new URL('..', import.meta.url));
const ENTRY_GLOB = 'src/{atoms,molecules,organisms,templates}/*/index.ts';

export const kebabCase = (name: string): string =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/** The `exports` map that tsup's glob entries produce: one kebab-case subpath per component. */
export function expectedExports(root: string = PACKAGE_ROOT): Record<string, ExportTarget> {
  const components: [string, ExportTarget][] = globSync(ENTRY_GLOB, { cwd: root })
    .map((entry) => entry.replace(/^src\//, '').replace(/\/index\.ts$/, ''))
    .sort()
    .map((dir) => [
      `./${kebabCase(dir.split('/')[1] ?? dir)}`,
      { types: `./dist/${dir}/index.d.ts`, import: `./dist/${dir}/index.js` },
    ]);
  const subpaths = components.map(([subpath]) => subpath);
  const duplicated = subpaths.filter((subpath, index) => subpaths.indexOf(subpath) !== index);
  if (duplicated.length > 0)
    throw new Error(`Duplicated component subpaths: ${duplicated.join(', ')}`);
  return {
    '.': { types: './dist/index.d.ts', import: './dist/index.js' },
    './styles.css': './dist/styles.css',
    ...Object.fromEntries(components),
    './package.json': './package.json',
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = `${PACKAGE_ROOT}/package.json`;
  const manifest = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>;
  const exportsMap = expectedExports();
  if (process.argv.includes('--write')) {
    writeFileSync(file, `${JSON.stringify({ ...manifest, exports: exportsMap }, null, 2)}\n`);
  } else if (JSON.stringify(manifest.exports) !== JSON.stringify(exportsMap)) {
    process.stderr.write(
      'package.json exports are out of date: run yarn workspace @purplerbr/ui exports:sync\n'
    );
    process.exitCode = 1;
  }
}
