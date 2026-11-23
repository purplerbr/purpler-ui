import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import { ROOT, isRecord } from './helpers';

const require = createRequire(import.meta.url);
const TABINDEX = 'jsx-a11y/no-noninteractive-tabindex';
const LEVELS: Readonly<Record<string, number>> = { off: 0, warn: 1, error: 2 };

function severityOf(entry: unknown): number {
  const level: unknown = Array.isArray(entry) ? entry[0] : entry;
  if (typeof level === 'number') return level;
  return LEVELS[String(level)] ?? 0;
}

function strictRules(): Record<string, unknown> {
  const plugin: unknown = require('eslint-plugin-jsx-a11y');
  const configs = isRecord(plugin) ? plugin.flatConfigs : undefined;
  const strict = isRecord(configs) ? configs.strict : undefined;
  if (!isRecord(strict) || !isRecord(strict.rules)) throw new Error('jsx-a11y strict not found');
  return strict.rules;
}

const eslint = new ESLint({ cwd: fileURLToPath(ROOT) });

async function rulesFor(file: string): Promise<Record<string, unknown>> {
  const config: unknown = await eslint.calculateConfigForFile(file);
  if (!isRecord(config) || !isRecord(config.rules)) throw new Error(`no ESLint config for ${file}`);
  return config.rules;
}

describe('jsx-a11y in @purplerbr/ui', () => {
  it('allows tabIndex only on the literal roles region and tabpanel', async () => {
    const rules = await rulesFor('packages/ui/src/atoms/Button/Button.tsx');

    expect(rules[TABINDEX]).toEqual([2, { tags: [], roles: ['tabpanel', 'region'] }]);
  });

  it('keeps every other strict rule at least as severe as jsx-a11y strict', async () => {
    const rules = await rulesFor('packages/ui/src/foundations/FoundationPage.tsx');
    const loosened = Object.entries(strictRules())
      .filter(([name, entry]) => name !== TABINDEX && severityOf(rules[name]) < severityOf(entry))
      .map(([name]) => name);

    expect(loosened).toEqual([]);
  });
});
