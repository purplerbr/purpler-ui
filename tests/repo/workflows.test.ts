import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { isRecord } from './helpers';

const WORKFLOWS_DIR = new URL('../../.github/workflows/', import.meta.url);
const WORKFLOW_FILES = readdirSync(WORKFLOWS_DIR).filter((file) => /\.ya?ml$/.test(file));
const PINNED_ACTION = /^[\w.-]+\/[\w./-]+@[0-9a-f]{40}$/;
const GATES = ['setup', 'lint', 'typecheck', 'test', 'build', 'security'];

function readWorkflow(file: string): string {
  return readFileSync(new URL(file, WORKFLOWS_DIR), 'utf8');
}

function jobsOf(workflow: unknown): [string, Record<string, unknown>][] {
  if (!isRecord(workflow) || !isRecord(workflow.jobs)) return [];
  return Object.entries(workflow.jobs).filter((entry): entry is [string, Record<string, unknown>] =>
    isRecord(entry[1])
  );
}

describe('GitHub workflows', () => {
  it('are the CI entry point, the reusable gates and the release', () => {
    expect([...WORKFLOW_FILES].sort()).toEqual([
      'build.yml',
      'ci.yml',
      'lint.yml',
      'release.yml',
      'security.yml',
      'setup.yml',
      'test.yml',
      'typecheck.yml',
    ]);
  });

  it.each(WORKFLOW_FILES)('%s pins every third-party action to a full commit SHA', (file) => {
    const refs = [...readWorkflow(file).matchAll(/^\s*(?:-\s+)?uses:\s*(\S+)/gm)].map(
      (match) => match[1] ?? ''
    );

    for (const ref of refs.filter((value) => !value.startsWith('./'))) {
      expect(ref).toMatch(PINNED_ACTION);
    }
  });

  it.each(WORKFLOW_FILES)('%s grants only read access to the contents by default', (file) => {
    expect(parse(readWorkflow(file))).toHaveProperty('permissions', { contents: 'read' });
  });

  it('grants packages: write to the publish job of the release only', () => {
    for (const file of WORKFLOW_FILES) {
      for (const [name, job] of jobsOf(parse(readWorkflow(file)))) {
        if (file === 'release.yml' && name === 'publish') {
          expect(job).toHaveProperty('permissions', { contents: 'read', packages: 'write' });
        } else {
          expect(job, `${file} › ${name}`).not.toHaveProperty('permissions');
        }
      }
    }
  });

  it.each(WORKFLOW_FILES)(
    '%s requests no OIDC token, reads no secret and deploys nothing',
    (file) => {
      const text = readWorkflow(file);

      expect(text).not.toMatch(/id-token/);
      expect(text).not.toMatch(/secrets\./);
      expect(text).not.toMatch(/pull_request_target|workflow_run/);
      expect(text).not.toMatch(/wrangler|cloudflare|CLOUDFLARE_|NPM_TOKEN|NODE_AUTH_TOKEN/i);
    }
  );

  it('uses the job token and publishes only in the release workflow', () => {
    for (const file of WORKFLOW_FILES.filter((name) => name !== 'release.yml')) {
      expect(readWorkflow(file)).not.toMatch(/github\.token|yarn release|npm publish/);
    }
  });

  it('publishes with changeset publish, after the build and the package contents check', () => {
    const manifest = JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8')
    ) as {
      scripts: Record<string, string>;
    };

    expect(manifest.scripts.release).toBe(
      'yarn build && yarn pack:check && changeset publish --no-git-tag'
    );
  });

  it('releases only on push to main, after every gate, when no changeset is pending', () => {
    const release: unknown = parse(readWorkflow('release.yml'));

    expect(release).toHaveProperty('on', { push: { branches: ['main'] } });
    expect(release).toHaveProperty(['jobs', 'publish', 'needs'], GATES);
    expect(readWorkflow('release.yml')).toContain("if: steps.changesets.outputs.pending == '0'");
  });

  it('runs every gate on pull requests', () => {
    const ci: unknown = parse(readWorkflow('ci.yml'));

    expect(ci).toHaveProperty('on', { pull_request: null });
    expect(
      jobsOf(ci)
        .map(([name]) => name)
        .sort()
    ).toEqual([...GATES].sort());
    expect(ci).toHaveProperty(['jobs', 'security', 'uses'], './.github/workflows/security.yml');
  });

  it('audits dependencies and checks the package contents as CLAUDE.md §8.8 and §11 ask', () => {
    expect(readWorkflow('security.yml')).toContain(
      'yarn npm audit --all --recursive --severity high'
    );
    expect(readWorkflow('build.yml')).toContain('yarn pack:check');
    expect(readWorkflow('build.yml')).toContain('yarn changeset status');
  });
});
