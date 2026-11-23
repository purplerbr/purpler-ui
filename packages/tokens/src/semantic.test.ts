import { describe, expect, it } from 'vitest';
import { CONTRAST_MINIMUM, contrastRatio } from './color';
import { SEMANTIC_PAIRS, SEMANTIC_TOKENS, semantic, type ColorScheme } from './semantic';

const CASES = (['light', 'dark'] as const).flatMap((scheme: ColorScheme) =>
  SEMANTIC_PAIRS.map((pair) => ({ scheme, ...pair }))
);

describe('semantic contrast (WCAG 2.2 AA)', () => {
  it.each(CASES)(
    '$scheme · $background × $foreground reaches the $level minimum',
    ({ scheme, background, foreground, level }) => {
      const tokens = semantic[scheme];
      const minimum = CONTRAST_MINIMUM[level];

      expect(
        contrastRatio(tokens[background].oklch, tokens[foreground].oklch)
      ).toBeGreaterThanOrEqual(minimum);
      expect(contrastRatio(tokens[background].hex, tokens[foreground].hex)).toBeGreaterThanOrEqual(
        minimum
      );
    }
  );

  it('checks every foreground token at least once', () => {
    const checked = new Set(
      SEMANTIC_PAIRS.flatMap(({ background, foreground }) => [background, foreground])
    );
    const decorative = ['border', 'sidebar-border'];

    expect(SEMANTIC_TOKENS.filter((token) => !checked.has(token))).toEqual(decorative);
  });
});
