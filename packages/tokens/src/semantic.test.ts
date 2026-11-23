import { describe, expect, it } from 'vitest';
import { CONTRAST_MINIMUM, contrastRatio } from './color';
import {
  BRAND_LOGO_TOKENS,
  SEMANTIC_PAIRS,
  SEMANTIC_TOKENS,
  SKELETON_MINIMUM,
  brandLogo,
  semantic,
  skeleton,
  type ColorScheme,
} from './semantic';
import { STORE_THEME_PRESETS, buildStoreTheme } from './storeTheme';

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

  const SKELETON_CASES = (['light', 'dark'] as const).flatMap((scheme) =>
    (['background', 'card'] as const).map((surface) => ({ scheme, surface }))
  );

  it.each(SKELETON_CASES)(
    '$scheme · skeleton stands out from $surface by at least 1.3:1',
    ({ scheme, surface }) => {
      const background = semantic[scheme][surface];

      expect(contrastRatio(background.oklch, skeleton[scheme].oklch)).toBeGreaterThanOrEqual(
        SKELETON_MINIMUM
      );
      expect(contrastRatio(background.hex, skeleton[scheme].hex)).toBeGreaterThanOrEqual(
        SKELETON_MINIMUM
      );
    }
  );

  // The store theme keeps the Purpler skeleton, so it must stand out on every preset surface too.
  it.each(STORE_THEME_PRESETS.map(({ id, input }) => ({ id, theme: buildStoreTheme(input) })))(
    'store preset $id · skeleton stands out from background and card by at least 1.3:1',
    ({ theme }) => {
      for (const scheme of ['light', 'dark'] as const) {
        for (const surface of ['background', 'card'] as const) {
          expect(
            contrastRatio(theme[scheme][surface], skeleton[scheme].oklch)
          ).toBeGreaterThanOrEqual(SKELETON_MINIMUM);
        }
      }
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
