import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { renderStoreThemeCss } from './css';
import { fontStack } from './fonts';
import { SEMANTIC_TOKENS } from './semantic';
import { STORE_FONTS, STORE_RADIUS, buildStoreTheme, type StoreTheme } from './storeTheme';

// Stored themes come back through JSON, which cannot carry getters or prototypes.
const fromJson = (value: unknown): StoreTheme => JSON.parse(JSON.stringify(value)) as StoreTheme;

const BASE = buildStoreTheme({
  primary: '#0b6aa2',
  accent: '#f2a541',
  radius: 'md',
  font: 'inter',
});
const DECLARATIONS = SEMANTIC_TOKENS.length * 2 + 4;
const DANGEROUS = ['<', '>', '/', '*', '\\', '"', "'", ';', '{', '}', '@', '(', ')', ':', '!', ','];
const WHITESPACE = [' ', '\n', '\r', '\t', '\v', '\f', '\u00a0', '\ufeff', '\u2028', '\u2029'];

const noise = fc
  .array(fc.oneof(fc.constantFrom(...DANGEROUS, ...WHITESPACE), fc.string({ maxLength: 3 })), {
    maxLength: 6,
  })
  .map((parts) => parts.join(''));
const nearValidColor = fc
  .tuple(noise, fc.constantFrom(BASE.light.primary, BASE.dark.background, 'oklch(1 0 0)'), noise)
  .map(([before, color, after]) => `${before}${color}${after}`);
const forgedValue = fc.oneof(nearValidColor, fc.string({ maxLength: 40 }), noise);

/** Throws if the CSS has more structure than the two blocks the renderer writes. */
function expectNoBreakout(css: string): void {
  expect(css.match(/[{]/g)).toHaveLength(2);
  expect(css.match(/[}]/g)).toHaveLength(2);
  expect(css.match(/;/g)).toHaveLength(DECLARATIONS);
  expect(css).not.toMatch(/[<>@"\\]|\/|url\(|!important|expression/i);
}

describe('renderStoreThemeCss against forged stored themes (security)', () => {
  it('never lets a forged color add markup, rules, comments or declarations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light' as const, 'dark' as const),
        fc.constantFrom(...SEMANTIC_TOKENS),
        forgedValue,
        (scheme, token, value) => {
          const forged = fromJson({ ...BASE, [scheme]: { ...BASE[scheme], [token]: value } });
          let css: string;
          try {
            css = renderStoreThemeCss(forged);
          } catch (error) {
            expect(error).toBeInstanceOf(TypeError);
            return;
          }
          expectNoBreakout(css);
        }
      ),
      { numRuns: 2000, seed: 20261123 }
    );
  });

  it('accepts only the exact radius and font values of the curated lists', () => {
    const radii = Object.values(STORE_RADIUS).flatMap((r) => [r.base, r.button]);

    fc.assert(
      fc.property(
        fc.constantFrom('radius' as const, 'buttonRadius' as const, 'fontBody' as const),
        fc.oneof(
          forgedValue,
          fc.constantFrom(...radii).chain((r) => noise.map((n) => `${r}${n}`))
        ),
        (field, value) => {
          const forged = fromJson({ ...BASE, [field]: value });
          const allowed = field === 'fontBody' ? STORE_FONTS.map(fontStack) : radii;
          if (allowed.includes(value)) {
            expectNoBreakout(renderStoreThemeCss(forged));
            return;
          }
          expect(() => renderStoreThemeCss(forged)).toThrow(TypeError);
        }
      ),
      { numRuns: 1000, seed: 20261123 }
    );
  });

  it('keeps every font stack the builder can produce free of markup and comments', () => {
    for (const font of STORE_FONTS) {
      expectNoBreakout(renderStoreThemeCss(buildStoreTheme({ primary: '#2e6b3e', font })));
    }
  });
});
