import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { ROOT, read, readJson } from './helpers';

describe('toolchain', () => {
  const manifest = readJson('package.json');

  it('pins Yarn 4.13 and Node 24', () => {
    expect(manifest).toHaveProperty('packageManager', 'yarn@4.13.0');
    expect(manifest).toHaveProperty(['engines', 'node'], '24.x');
    expect(read('.nvmrc').trim()).toBe('24');
  });

  it('uses node_modules with the committed Yarn release', () => {
    const yarnrc: unknown = parse(read('.yarnrc.yml'));

    expect(yarnrc).toHaveProperty('nodeLinker', 'node-modules');
    expect(yarnrc).toHaveProperty('yarnPath', '.yarn/releases/yarn-4.13.0.cjs');
    expect(existsSync(new URL('.yarn/releases/yarn-4.13.0.cjs', ROOT))).toBe(true);
  });

  it('keeps .yarnrc.yml exactly as reviewed: no audit exclusions, scope mapped to GitHub Packages', () => {
    // Any extra key (npmAuditIgnoreAdvisories, npmAuditExcludePackages, another registry) fails here.
    expect(parse(read('.yarnrc.yml'))).toEqual({
      enableTelemetry: false,
      nodeLinker: 'node-modules',
      npmScopes: {
        purplerbr: {
          npmAuthToken: '${GITHUB_PACKAGES_TOKEN:-}',
          npmPublishRegistry: 'https://npm.pkg.github.com',
          npmRegistryServer: 'https://npm.pkg.github.com',
        },
      },
      yarnPath: '.yarn/releases/yarn-4.13.0.cjs',
    });
  });

  it('declares the two public workspaces', () => {
    expect(manifest).toHaveProperty('private', true);
    expect(manifest).toHaveProperty('workspaces', ['packages/*']);
  });

  it('runs lint-staged and gitleaks before each commit and the checks before each push', () => {
    const hook = read('.husky/pre-commit');

    expect(hook).toContain('yarn lint-staged');
    expect(hook).toContain('gitleaks git --pre-commit --staged');
    expect(read('.husky/commit-msg')).toContain('commitlint --edit');
    expect(read('.husky/pre-push')).toContain('yarn typecheck && yarn test');
  });

  it('keeps test output and builds out of git', () => {
    const ignored = read('.gitignore');

    for (const entry of [
      'node_modules/',
      'dist/',
      'coverage/',
      'test-results/',
      'playwright-report/',
      'storybook-static/',
      '.env',
    ]) {
      expect(ignored).toContain(entry);
    }
  });
});
