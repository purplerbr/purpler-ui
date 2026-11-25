import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { CONTRAST_MINIMUM, contrastRatio, isInSrgbGamut, parseOklch, toOklch } from './color';
import { fontStack } from './fonts';
import { SEMANTIC_PAIRS, SEMANTIC_TOKENS } from './semantic';
import {
  STORE_FONTS,
  STORE_RADIUS,
  STORE_THEME_PRESETS,
  buildStoreTheme,
  type StoreRadius,
  type StoreTheme,
  type StoreThemeInput,
} from './storeTheme';

// Simulates data from storage or the network, which the compiler cannot check.
const fromJson = (json: string): StoreThemeInput => JSON.parse(json) as StoreThemeInput;

const RADII = Object.keys(STORE_RADIUS).filter((key): key is StoreRadius =>
  Object.hasOwn(STORE_RADIUS, key)
);

function failingPairs(theme: StoreTheme): string[] {
  return (['light', 'dark'] as const).flatMap((scheme) =>
    SEMANTIC_PAIRS.filter(
      ({ background, foreground, level }) =>
        contrastRatio(theme[scheme][background], theme[scheme][foreground]) <
        CONTRAST_MINIMUM[level]
    ).map(({ background, foreground }) => `${scheme}: ${background} × ${foreground}`)
  );
}

function invalidColors(theme: StoreTheme): string[] {
  return (['light', 'dark'] as const).flatMap((scheme) =>
    SEMANTIC_TOKENS.filter((token) => {
      const color = parseOklch(theme[scheme][token]);
      return color === null || !isInSrgbGamut(color);
    }).map((token) => `${scheme}: ${token}`)
  );
}

const hexColor = fc
  .tuple(
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 })
  )
  .map((rgb) => `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`);

describe('STORE_THEME_PRESETS', () => {
  it('ships between 6 and 8 presets with unique ids', () => {
    expect(STORE_THEME_PRESETS.length).toBeGreaterThanOrEqual(6);
    expect(STORE_THEME_PRESETS.length).toBeLessThanOrEqual(8);
    expect(new Set(STORE_THEME_PRESETS.map(({ id }) => id)).size).toBe(STORE_THEME_PRESETS.length);
  });

  it.each(STORE_THEME_PRESETS)('$name meets WCAG AA on every pair, light and dark', ({ input }) => {
    const theme = buildStoreTheme(input);

    expect(failingPairs(theme)).toEqual([]);
    expect(invalidColors(theme)).toEqual([]);
  });

  it.each(STORE_THEME_PRESETS)(
    '$name keeps its brand color unchanged in the light theme',
    ({ input }) => {
      const theme = buildStoreTheme(input);

      expect(contrastRatio(theme.light.primary, input.primary)).toBeLessThan(1.02);
    }
  );
});

describe('buildStoreTheme', () => {
  it('always produces AA pairs for random colors, radii and fonts (property)', () => {
    fc.assert(
      fc.property(
        hexColor,
        fc.option(hexColor, { nil: undefined }),
        fc.constantFrom(...RADII),
        fc.constantFrom(...STORE_FONTS),
        (primary, accent, radius, font) => {
          const theme = buildStoreTheme({ primary, accent, radius, font });
          expect(failingPairs(theme)).toEqual([]);
          expect(invalidColors(theme)).toEqual([]);
        }
      ),
      { numRuns: 400, seed: 20261123 }
    );
  });

  it.each(['#ffffff', '#000000', '#808080', '#ffff00', '#00ffff', '#ff00ff', '#ffd400', '#7f7f00'])(
    'handles the extreme brand color %s',
    (primary) => {
      const theme = buildStoreTheme({ primary });
      expect(failingPairs(theme)).toEqual([]);
      expect(invalidColors(theme)).toEqual([]);
    }
  );

  it('darkens a light brand color for the light theme and lightens a dark one for the dark theme', () => {
    const yellow = buildStoreTheme({ primary: '#ffd400' });
    const navy = buildStoreTheme({ primary: '#0a1a4f' });

    expect(contrastRatio(yellow.light.background, yellow.light.primary)).toBeGreaterThanOrEqual(
      4.5
    );
    expect(contrastRatio(navy.dark.background, navy.dark.primary)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(navy.light.primary, '#0a1a4f')).toBeLessThan(1.02);
    expect(contrastRatio(yellow.light.primary, '#ffd400')).toBeGreaterThan(2);
  });

  it('moves a light primary only until it reaches AA on background, card and sidebar (property)', () => {
    fc.assert(
      fc.property(hexColor, (primary) => {
        const { light } = buildStoreTheme({ primary });
        if (contrastRatio(light.primary, primary) < 1.02) return;
        const surfaces = [light.background, light.card, light.sidebar];
        const worst = Math.min(...surfaces.map((surface) => contrastRatio(surface, light.primary)));
        const input = toOklch(primary);
        const output = toOklch(light.primary);

        expect(worst).toBeGreaterThanOrEqual(CONTRAST_MINIMUM.text);
        // Each lightness step moves the ratio by under 0.1, so a minimal fit stays below 4.7:1.
        expect(worst).toBeLessThan(4.7);
        expect(output.l).toBeLessThan(input.l);
        if (output.c > 0.02) expect(Math.abs(output.h - input.h)).toBeLessThanOrEqual(0.06);
      }),
      { numRuns: 400, seed: 20261124 }
    );
  });

  it('uses the defaults: lg radius, Figtree and the primary as accent', () => {
    const theme = buildStoreTheme({ primary: '#0b6aa2' });
    const withAccent = buildStoreTheme({ primary: '#0b6aa2', accent: '#0b6aa2' });

    expect(theme.radius).toBe(STORE_RADIUS.lg.base);
    expect(theme.buttonRadius).toBe(STORE_RADIUS.lg.button);
    expect(theme.fontBody).toBe(fontStack('figtree'));
    expect(theme.fontHeading).toBe(fontStack('figtree'));
    expect(theme).toEqual(withAccent);
  });

  it('maps the radius preset and the font', () => {
    const theme = buildStoreTheme({ primary: '#b83b6f', radius: 'full', font: 'lora' });

    expect(theme.radius).toBe('1rem');
    expect(theme.buttonRadius).toBe('1.5rem');
    expect(theme.fontBody).toBe("'Lora', ui-serif, Georgia, 'Times New Roman', serif");
  });

  it('rejects input outside the contract instead of emitting it', () => {
    expect(() => buildStoreTheme({ primary: 'red' })).toThrow(TypeError);
    expect(() => buildStoreTheme({ primary: '#0b6aa2', accent: 'url(x)' })).toThrow(TypeError);
    expect(() => buildStoreTheme(fromJson('{"primary":"#0b6aa2","radius":"huge"}'))).toThrow(
      'Unknown store radius: huge'
    );
    expect(() => buildStoreTheme(fromJson('{"primary":"#0b6aa2","font":"Comic Sans"}'))).toThrow(
      'Unknown store font: Comic Sans'
    );
  });
});
