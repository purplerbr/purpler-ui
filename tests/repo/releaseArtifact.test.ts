import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { isRecord, read, readJson } from './helpers';

// yarn npm publish runs pack lifecycle scripts; any of them could rebuild dist/ in the publish job.
const LIFECYCLE = ['prepack', 'postpack', 'prepublish', 'prepublishOnly', 'prepare', 'publish'];

function stepsOf(job: string): Record<string, unknown>[] {
  const release: unknown = parse(read('.github/workflows/release.yml'));
  const jobs = isRecord(release) ? release.jobs : undefined;
  const definition = isRecord(jobs) ? jobs[job] : undefined;
  if (!isRecord(definition) || !Array.isArray(definition.steps)) return [];
  return definition.steps.filter(isRecord);
}

const actionOf = (step: Record<string, unknown>): string =>
  typeof step.uses === 'string' ? (step.uses.split('@')[0] ?? '') : '';

const withOf = (steps: Record<string, unknown>[], action: string): unknown =>
  steps.find((step) => actionOf(step) === action)?.with;

describe('release artifact', () => {
  it.each(['packages/tokens', 'packages/ui', 'packages/analytics'])(
    '%s has no lifecycle script that could rebuild it while publishing',
    (dir) => {
      const manifest = readJson(`${dir}/package.json`);
      const scripts = isRecord(manifest) && isRecord(manifest.scripts) ? manifest.scripts : {};

      expect(LIFECYCLE.filter((name) => name in scripts)).toEqual([]);
    }
  );

  it('uploads exactly the dist/ folders checked in the package job', () => {
    expect(withOf(stepsOf('package'), 'actions/upload-artifact')).toEqual({
      name: 'packages-dist',
      path: 'packages/tokens/dist\npackages/ui/dist\npackages/analytics/dist\n',
      'if-no-files-found': 'error',
      'retention-days': 1,
    });
  });

  it('publishes that artifact as downloaded, with no build, cache save or upload', () => {
    const steps = stepsOf('publish');

    expect(withOf(steps, 'actions/download-artifact')).toEqual({
      name: 'packages-dist',
      path: 'packages',
    });
    expect(steps.map(actionOf).filter(Boolean)).toEqual([
      'actions/checkout',
      'actions/setup-node',
      'actions/cache/restore',
      'actions/download-artifact',
    ]);
    expect(steps.flatMap((step) => (typeof step.run === 'string' ? [step.run] : []))).toEqual([
      'yarn release',
    ]);
  });
});
