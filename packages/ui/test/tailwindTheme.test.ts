import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import { renderThemeCss } from '../../tokens/src/css';

const require = createRequire(import.meta.url);

// Compiles the real theme.css over Tailwind's default theme, as an app does.
async function utilitiesFor(candidates: readonly string[]): Promise<string> {
  const entry = `@import 'tailwindcss/theme.css';\n${renderThemeCss()}\n@tailwind utilities;`;
  const compiler = await compile(entry, {
    base: import.meta.dirname,
    loadStylesheet: (id) => {
      const path = require.resolve(id);
      return Promise.resolve({ path, base: dirname(path), content: readFileSync(path, 'utf8') });
    },
  });
  return compiler.build([...candidates]);
}

const hasRule = (css: string, utility: string): boolean => css.includes(`.${utility} {`);

describe('Tailwind theme from @purplerbr/tokens', () => {
  it.each([
    'bg-primary',
    'text-primary-foreground',
    'border-input',
    'outline-ring',
    'rounded-lg',
    'rounded-button',
    'shadow-md',
    'font-sans',
    'font-display',
    'font-semibold',
    'text-small',
    'text-title-1',
    'ease-standard',
  ])('generates the token utility %s', async (utility) => {
    expect(hasRule(await utilitiesFor([utility]), utility)).toBe(true);
  });

  it.each([
    'bg-red-500',
    'text-white',
    'text-sm',
    'text-base',
    'text-2xl',
    'font-serif',
    'font-thin',
    'font-black',
    'rounded-3xl',
    'shadow-2xl',
    'inset-shadow-sm',
    'drop-shadow-md',
    'text-shadow-lg',
    'ease-in-out',
  ])('does not generate the literal Tailwind utility %s', async (utility) => {
    expect(hasRule(await utilitiesFor([utility]), utility)).toBe(false);
  });
});
