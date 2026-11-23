import { globSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

type ExportTarget = string | { types: string; import: string };

export interface Output {
  write(file: string, content: string): void;
  error(message: string): void;
}

const PACKAGE_ROOT = fileURLToPath(new URL('..', import.meta.url));
const ENTRY_GLOB = 'src/{atoms,molecules,organisms,templates}/*/index.ts';

const NODE_OUTPUT: Output = {
  write: writeFileSync,
  error: process.stderr.write.bind(process.stderr),
};

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

/** Checks the exports of package.json or, with `--write`, rewrites them; returns the exit code. */
export function syncExports(
  args: readonly string[],
  root: string = PACKAGE_ROOT,
  output: Output = NODE_OUTPUT
): number {
  const file = `${root}/package.json`;
  const manifest = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>;
  const exportsMap = expectedExports(root);
  if (args.includes('--write')) {
    output.write(file, `${JSON.stringify({ ...manifest, exports: exportsMap }, null, 2)}\n`);
    return 0;
  }
  if (JSON.stringify(manifest.exports) === JSON.stringify(exportsMap)) return 0;
  output.error(
    'package.json exports are out of date: run yarn workspace @purplerbr/ui exports:sync\n'
  );
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = syncExports(process.argv.slice(2));
}
