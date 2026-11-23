import { globSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import { renderThemeCss } from '../../tokens/src/css';

// shadcn output uses text-sm, ease-in-out, shadow-2xs...; with the reset theme they emit no CSS
// silently, so every themed utility written in a component must compile to a rule.
const require = createRequire(import.meta.url);
const SRC = join(import.meta.dirname, '../src');
const COMPONENT_FILES = globSync('{atoms,molecules,organisms,templates}/**/*.{ts,tsx}', {
  cwd: SRC,
})
  .filter((file) => !/\.(test|stories)\.tsx?$/.test(file))
  .sort();
const THEMED =
  /^-?(text|font|shadow|inset-shadow|drop-shadow|text-shadow|ease|rounded|bg|border|outline|ring|fill|stroke|decoration|accent|caret|divide|placeholder|animate)-/;
const STRING_LITERAL = /(['"`])((?:(?!\1)[^\\])*)\1/g;

/** The utility after the variants (`hover:`, `[&_svg]:`), without the `!` modifier. */
function utilityOf(candidate: string): string {
  let depth = 0;
  let start = 0;
  for (let index = 0; index < candidate.length; index += 1) {
    const char = candidate.charAt(index);
    if (char === '[' || char === '(') depth += 1;
    else if (char === ']' || char === ')') depth -= 1;
    else if (char === ':' && depth === 0) start = index + 1;
  }
  return candidate.slice(start).replace(/^!|!$/g, '');
}

function themedCandidates(): string[] {
  const words = COMPONENT_FILES.flatMap((file) =>
    [...readFileSync(join(SRC, file), 'utf8').matchAll(STRING_LITERAL)].flatMap((match) =>
      (match[2] ?? '').split(/\s+/)
    )
  );
  return [...new Set(words.filter((word) => THEMED.test(utilityOf(word))))].sort();
}

async function buildCss(candidates: readonly string[]): Promise<string> {
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

describe('component classes against the token theme', () => {
  const candidates = themedCandidates();

  it('finds the themed utilities of the components', () => {
    expect(COMPONENT_FILES).toContain('atoms/Button/Button.variants.ts');
    expect(candidates).toContain('rounded-button');
    expect(candidates).toContain('focus-visible:outline-ring');
  });

  it.each(candidates)('%s compiles to CSS', async (candidate) => {
    const [empty, css] = await Promise.all([buildCss([]), buildCss([candidate])]);

    expect(css.length).toBeGreaterThan(empty.length);
  });

  it.each(['text-sm', 'ease-in-out', 'shadow-2xs', 'font-light'])(
    'would flag the shadcn default %s, which the token theme no longer has',
    async (candidate) => {
      const [empty, css] = await Promise.all([buildCss([]), buildCss([candidate])]);

      expect(css).toBe(empty);
    }
  );
});
