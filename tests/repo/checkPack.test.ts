import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  PUBLIC_WORKSPACES,
  checkPackages,
  findManifestProblems,
  findPackProblems,
  parsePackOutput,
  yarnPack,
  type Output,
  type PackResult,
} from '../../scripts/checkPack';

// Output of `yarn pack --json` for @purplerbr/ui (Yarn 4.13), fixed here.
const YARN_PACK_OUTPUT = [
  '{"base":"/repo/packages/ui"}',
  '{"location":"LICENSE"}',
  '{"location":"README.md"}',
  '{"location":"dist/index.js"}',
  '{"location":"dist/styles.css"}',
  '{"location":"package.json"}',
  '{"output":"/repo/node_modules/.cache/purpler-pack-check/packages-ui.tgz"}',
  '',
].join('\n');

function recorder(): { lines: string[]; output: Output } {
  const lines: string[] = [];
  return {
    lines,
    output: {
      log: (message) => lines.push(`log ${message}`),
      error: (message) => lines.push(`error ${message}`),
    },
  };
}

const packed = (
  name: string,
  files: readonly string[],
  manifest: Record<string, unknown> = {}
): PackResult => ({ name, version: '0.1.0', files: [...files], manifest });

describe('parsePackOutput', () => {
  it('keeps only the packed file locations', () => {
    expect(parsePackOutput(YARN_PACK_OUTPUT)).toEqual([
      'LICENSE',
      'README.md',
      'dist/index.js',
      'dist/styles.css',
      'package.json',
    ]);
  });
});

describe('findPackProblems', () => {
  it('accepts a package with the build, the manifest, the readme and the license', () => {
    expect(
      findPackProblems([
        'package.json',
        'README.md',
        'LICENSE',
        'dist/index.js',
        'dist/index.d.ts',
        'dist/fonts/a.woff2',
      ])
    ).toEqual([]);
  });

  it('rejects sources, tests, stories, maps and env files', () => {
    expect(
      findPackProblems([
        'dist/index.js',
        'src/index.ts',
        'dist/Button.test.js',
        'dist/Button.stories.js',
        'dist/index.js.map',
        '.env',
        'dist/.env.local',
      ])
    ).toEqual([
      'forbidden file: src/index.ts',
      'forbidden file: dist/Button.test.js',
      'forbidden file: dist/Button.stories.js',
      'forbidden file: dist/index.js.map',
      'forbidden file: .env',
      'forbidden file: dist/.env.local',
    ]);
  });

  it('rejects anything outside dist/ and asks for the build when dist/index.js is missing', () => {
    expect(findPackProblems(['package.json', 'tsup.config.ts'])).toEqual([
      'file outside dist/: tsup.config.ts',
      'missing dist/index.js (run yarn build first)',
    ]);
  });
});

describe('findManifestProblems', () => {
  it('accepts exact versions of @purplerbr packages and ranges of third-party ones', () => {
    expect(
      findManifestProblems({
        dependencies: { '@purplerbr/tokens': '0.1.0', clsx: '^2.1.1' },
        peerDependencies: { react: '>=19.0.0' },
      })
    ).toEqual([]);
  });

  it('rejects workspace ranges and @purplerbr ranges that are not exact', () => {
    expect(
      findManifestProblems({
        dependencies: { '@purplerbr/tokens': 'workspace:*', other: 'workspace:^' },
        peerDependencies: { '@purplerbr/ui': '^0.1.0' },
      })
    ).toEqual([
      'dependencies.@purplerbr/tokens keeps workspace:*',
      'dependencies.other keeps workspace:^',
      'peerDependencies.@purplerbr/ui is not an exact version: ^0.1.0',
    ]);
  });
});

describe('checkPackages', () => {
  it('returns 0 and lists each package when every package holds only the build', () => {
    const { lines, output } = recorder();
    const pack = (workspace: string): PackResult =>
      packed(`@purplerbr/${workspace.split('/')[1] ?? ''}`, ['package.json', 'dist/index.js']);

    expect(checkPackages(PUBLIC_WORKSPACES, pack, output)).toBe(0);
    expect(lines).toEqual([
      'log @purplerbr/tokens@0.1.0: 2 files\n',
      'log @purplerbr/ui@0.1.0: 2 files\n',
    ]);
  });

  it('returns 1 and reports a leaked source and a workspace range', () => {
    const { lines, output } = recorder();
    const pack = (): PackResult =>
      packed('@purplerbr/ui', ['dist/index.js', 'src/index.ts'], {
        dependencies: { '@purplerbr/tokens': 'workspace:*' },
      });

    expect(checkPackages(['packages/ui'], pack, output)).toBe(1);
    expect(lines).toEqual([
      'log @purplerbr/ui@0.1.0: 2 files\n',
      'error   forbidden file: src/index.ts\n',
      'error   dependencies.@purplerbr/tokens keeps workspace:*\n',
    ]);
  });
});

describe('yarnPack', () => {
  it('packs @purplerbr/ui with Yarn and pins the tokens to the exact workspace version', () => {
    const tokens = JSON.parse(
      readFileSync(new URL('../../packages/tokens/package.json', import.meta.url), 'utf8')
    ) as { version: string };
    const result = yarnPack('packages/ui');

    expect(result.name).toBe('@purplerbr/ui');
    expect(result.files).toContain('package.json');
    expect(result.manifest).toHaveProperty(['dependencies', '@purplerbr/tokens'], tokens.version);
    expect(findManifestProblems(result.manifest)).toEqual([]);
  }, 60_000);
});
