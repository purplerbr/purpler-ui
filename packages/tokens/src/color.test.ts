import { describe, expect, it } from 'vitest';
import {
  BLACK,
  WHITE,
  clampToSrgb,
  contrastRatio,
  formatOklch,
  isAccessiblePair,
  isInSrgbGamut,
  parseOklch,
  pickForeground,
  relativeLuminance,
  toHex,
  toOklch,
} from './color';

describe('contrastRatio', () => {
  it('returns 21 for black on white and 1 for a color on itself', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio(WHITE, BLACK)).toBeCloseTo(21, 5);
    expect(contrastRatio('#992faa', '#992faa')).toBe(1);
  });

  it('is symmetric and accepts #rgb, #rrggbb and OKLCH', () => {
    expect(contrastRatio('#fff', '#992faa')).toBeCloseTo(contrastRatio('#992faa', '#ffffff'), 10);
    expect(contrastRatio('oklch(0.515 0.2 321.6)', '#ffffff')).toBeCloseTo(
      contrastRatio('#992faa', '#ffffff'),
      1
    );
  });

  it('matches the WCAG reference value for #767676 on white (4.54:1)', () => {
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
  });

  it('rejects colors in other formats', () => {
    expect(() => contrastRatio('rgb(0, 0, 0)', '#ffffff')).toThrow(TypeError);
    expect(() => contrastRatio('#12345', '#ffffff')).toThrow('Unsupported color: #12345');
    expect(() => contrastRatio('oklch(1.2 0 0)', '#ffffff')).toThrow(TypeError);
  });
});

describe('isAccessiblePair', () => {
  it('uses 4.5:1 for text and 3:1 for large text and UI', () => {
    expect(isAccessiblePair('#ffffff', '#949494')).toBe(false);
    expect(isAccessiblePair('#ffffff', '#949494', 'large-text')).toBe(true);
    expect(isAccessiblePair('#ffffff', '#949494', 'ui')).toBe(true);
    expect(isAccessiblePair('#ffffff', '#767676')).toBe(true);
  });
});

describe('pickForeground', () => {
  it('returns the first candidate that reaches the minimum', () => {
    expect(pickForeground('#992faa')).toBe(WHITE);
    expect(pickForeground('#ffd400')).toBe(BLACK);
    expect(pickForeground('#ffffff', ['#100c0f', BLACK])).toBe('#100c0f');
  });

  it('falls back to the candidate with the highest ratio when none passes', () => {
    expect(pickForeground('#777777', ['#888888', '#ffffff', '#999999'])).toBe('#ffffff');
  });

  it('accepts a custom minimum', () => {
    expect(pickForeground('#949494', ['#ffffff', BLACK], 3)).toBe('#ffffff');
  });

  it('needs at least one candidate', () => {
    expect(() => pickForeground('#ffffff', [])).toThrow(RangeError);
  });
});

describe('conversions', () => {
  it('round-trips hex through OKLCH', () => {
    expect(toHex(formatOklch(toOklch('#992faa')))).toBe('#992faa');
    expect(toHex('#abc')).toBe('#aabbcc');
    expect(toOklch('oklch(0.5 0.1 200)')).toEqual({ l: 0.5, c: 0.1, h: 200 });
  });

  it('formats achromatic colors with hue 0', () => {
    expect(formatOklch(toOklch('#808080'))).toBe('oklch(0.6 0 0)');
    expect(formatOklch({ l: 0.5, c: 0, h: 123 })).toBe('oklch(0.5 0 0)');
  });

  it('parses only oklch(L C H) with L from 0 to 1', () => {
    expect(parseOklch('oklch(0.985 0.004 70)')).toEqual({ l: 0.985, c: 0.004, h: 70 });
    expect(parseOklch('oklch(98% 0.004 70)')).toBeNull();
    expect(parseOklch('#ffffff')).toBeNull();
  });

  it('reduces chroma until the color fits sRGB, keeping lightness and hue', () => {
    const vivid = { l: 0.7, c: 0.4, h: 150 };
    const clamped = clampToSrgb(vivid);

    expect(isInSrgbGamut(vivid)).toBe(false);
    expect(isInSrgbGamut(clamped)).toBe(true);
    expect(clamped.l).toBe(0.7);
    expect(clamped.h).toBe(150);
    expect(clamped.c).toBeLessThan(0.4);
    expect(clampToSrgb({ l: 0.5, c: 0.05, h: 10 })).toEqual({ l: 0.5, c: 0.05, h: 10 });
  });

  it('computes the relative luminance of the extremes', () => {
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 10);
    expect(relativeLuminance('#000000')).toBe(0);
  });
});
