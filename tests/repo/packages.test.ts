import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { expectedExports, kebabCase, syncExports } from '../../packages/ui/scripts/exports';
import { ROOT, isRecord, read, readJson } from './helpers';

const PUBLIC_PACKAGES = [
  { dir: 'packages/tokens', name: '@purplerbr/tokens' },
  { dir: 'packages/ui', name: '@purplerbr/ui' },
] as const;

function manifestOf(dir: string): Record<string, unknown> {
  const manifest = readJson(`${dir}/package.json`);
  if (!isRecord(manifest)) throw new Error(`${dir}/package.json is not an object`);
  return manifest;
}

describe.each(PUBLIC_PACKAGES)('$name', ({ dir, name }) => {
  const manifest = manifestOf(dir);

  it('publishes only dist/ to GitHub Packages, under the MIT license', () => {
    expect(manifest).toMatchObject({
      name,
      license: 'MIT',
      type: 'module',
      files: ['dist'],
      sideEffects: ['**/*.css'],
      publishConfig: { registry: 'https://npm.pkg.github.com' },
      repository: {
        type: 'git',
        url: 'git+https://github.com/purplerbr/purpler-ui.git',
        directory: dir,
      },
    });
    expect(manifest).not.toHaveProperty('private');
  });

  it('ships a README and the license', () => {
    expect(existsSync(new URL(`${dir}/README.md`, ROOT))).toBe(true);
    expect(read(`${dir}/LICENSE`)).toBe(read('LICENSE'));
  });
});

describe('@purplerbr/tokens', () => {
  it('has zero runtime dependencies', () => {
    const manifest = manifestOf('packages/tokens');

    expect(manifest).not.toHaveProperty('dependencies');
    expect(manifest).not.toHaveProperty('peerDependencies');
  });
});

describe('@purplerbr/ui', () => {
  const manifest = manifestOf('packages/ui');

  it('takes React and lucide-react from the app, never as its own dependency', () => {
    expect(manifest.peerDependencies).toEqual({
      'lucide-react': '^1.0.0',
      react: '>=19.0.0',
      'react-dom': '>=19.0.0',
    });
    expect(manifest).not.toHaveProperty(['dependencies', 'react']);
    expect(manifest).not.toHaveProperty(['dependencies', 'react-dom']);
  });

  it('depends on the exact tokens version of this monorepo and uses its own cn, not the cn package', () => {
    expect(manifest).toHaveProperty(['dependencies', '@purplerbr/tokens'], 'workspace:*');
    expect(manifest).not.toHaveProperty(['dependencies', 'cn']);
  });

  it('exposes one kebab-case subpath per component folder (run exports:sync when it fails)', () => {
    expect(manifest.exports).toEqual(expectedExports());
  });

  it('syncExports passes on this package and reports or rewrites an outdated one', () => {
    const fixture = fileURLToPath(new URL('fixtures/outdated-exports/', import.meta.url));
    const calls: string[] = [];
    const output = {
      write: (file: string, content: string) => calls.push(`write ${file}\n${content}`),
      error: (message: string) => calls.push(`error ${message}`),
    };

    expect(syncExports([], undefined, output)).toBe(0);
    expect(syncExports([], fixture, output)).toBe(1);
    expect(syncExports(['--write'], fixture, output)).toBe(0);
    expect(calls[0]).toBe(
      'error package.json exports are out of date: run yarn workspace @purplerbr/ui exports:sync\n'
    );
    expect(calls[1]).toContain(`write ${fixture}/package.json`);
    expect(calls[1]).toContain('"./card": {\n      "types": "./dist/atoms/Card/index.d.ts"');
    expect(calls).toHaveLength(2);
  });

  it('names subpaths in kebab-case and refuses two components with the same name', () => {
    const fixture = fileURLToPath(new URL('fixtures/duplicated-components/', import.meta.url));

    expect(kebabCase('ProductCard')).toBe('product-card');
    expect(kebabCase('Button')).toBe('button');
    expect(() => expectedExports(fixture)).toThrow('Duplicated component subpaths: ./card');
  });
});

describe('yarn.lock', () => {
  it('never resolves @purplerbr packages from a registry (dependency confusion)', () => {
    const lock = read('yarn.lock');
    const resolutions = [...lock.matchAll(/resolution: "(@purplerbr\/[^"]+)"/g)].map(
      (match) => match[1]
    );

    expect(resolutions.sort()).toEqual([
      '@purplerbr/tokens@workspace:packages/tokens',
      '@purplerbr/ui@workspace:packages/ui',
    ]);
    expect(lock).not.toMatch(/@purplerbr\/[^\n]*@npm:/);
  });
});

describe('changesets', () => {
  it('versions against main and never commits by itself', () => {
    expect(readJson('.changeset/config.json')).toMatchObject({ baseBranch: 'main', commit: false });
  });
});
