import { describe, expect, it } from 'vitest';
import { PUBLIC_WORKSPACES, findPackProblems } from '../../scripts/checkPack';

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

  it('checks the two public workspaces', () => {
    expect(PUBLIC_WORKSPACES).toEqual(['packages/tokens', 'packages/ui']);
  });
});
