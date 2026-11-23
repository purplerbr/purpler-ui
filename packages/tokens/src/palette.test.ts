import { describe, expect, it } from 'vitest';
import paleta from '../test/fixtures/paleta.json' with { type: 'json' };
import { isInSrgbGamut, parseOklch, toHex } from './color';
import { SCALE_STEPS, palette } from './palette';
import { SEMANTIC_TOKENS, brandLogo, semantic, type ColorScheme } from './semantic';
import { typography } from './typography';
import { radius } from './radius';

const SCHEMES: readonly ColorScheme[] = ['light', 'dark'];

describe('palette', () => {
  it('matches every scale of the approved paleta.json', () => {
    expect(palette).toEqual(paleta.escalas);
  });

  const scales = Object.entries(palette).map(([name, scale]) => ({ name, scale }));

  it.each(scales)('keeps the $name scale complete, in sRGB and equal to its hex', ({ scale }) => {
    expect(Object.keys(scale).map(Number)).toEqual([...SCALE_STEPS]);
    for (const step of SCALE_STEPS) {
      const color = scale[step];
      const oklch = parseOklch(color.oklch);
      expect(oklch).not.toBeNull();
      expect(oklch && isInSrgbGamut(oklch)).toBe(true);
      expect(distance(toHex(color.oklch), color.hex)).toBeLessThanOrEqual(1);
    }
  });
});

describe('semantic', () => {
  it.each(SCHEMES)('matches the %s tokens of paleta.json (ref, OKLCH and hex)', (scheme) => {
    expect(semantic[scheme]).toEqual(paleta.semantico[scheme]);
  });

  it('declares the tokens in the same order as paleta.json', () => {
    expect(SEMANTIC_TOKENS).toEqual(Object.keys(paleta.semantico.light));
    expect(SEMANTIC_TOKENS).toEqual(Object.keys(paleta.semantico.dark));
  });

  it.each(SCHEMES)('takes the %s logo colors from the logo of paleta.json', (scheme) => {
    expect(brandLogo[scheme]['brand-mark'].ref).toBe(paleta.logo[scheme].simbolo);
    expect(brandLogo[scheme]['brand-wordmark'].ref).toBe(paleta.logo[scheme].wordmark);
  });

  it('keeps the base radius and the type families of the brand', () => {
    expect(radius.base).toBe(paleta.raio);
    expect(typography.family.heading).toContain(paleta.tipografia.display.familia);
    expect(typography.family.body).toContain(paleta.tipografia.texto.familia);
  });
});

function distance(hexA: string, hexB: string): number {
  const channels = (hex: string): number[] =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [a, b] = [channels(hexA), channels(hexB)];
  return Math.max(...a.map((value, i) => Math.abs(value - (b[i] ?? 0))));
}
