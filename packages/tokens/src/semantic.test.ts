import { describe, expect, it } from 'vitest';
import { CONTRAST_MINIMUM, contrastRatio } from './color';
import {
  BRAND_LOGO_TOKENS,
  SEMANTIC_PAIRS,
  SEMANTIC_TOKENS,
  brandLogo,
  semantic,
  type ColorScheme,
} from './semantic';

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

  const LOGO_CASES = (['light', 'dark'] as const).flatMap((scheme) =>
    (['background', 'card'] as const).flatMap((background) =>
      BRAND_LOGO_TOKENS.map((logo) => ({ scheme, background, logo }))
    )
  );

  it.each(LOGO_CASES)(
    '$scheme · $background × $logo reaches the UI graphics minimum',
    ({ scheme, background, logo }) => {
      const surface = semantic[scheme][background];
      const color = brandLogo[scheme][logo];

      expect(contrastRatio(surface.oklch, color.oklch)).toBeGreaterThanOrEqual(CONTRAST_MINIMUM.ui);
      expect(contrastRatio(surface.hex, color.hex)).toBeGreaterThanOrEqual(CONTRAST_MINIMUM.ui);
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
