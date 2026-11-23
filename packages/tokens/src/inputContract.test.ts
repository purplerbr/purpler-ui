import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseOklch, toHex, toOklch } from './color';
import { renderStoreThemeCss } from './css';
import { SEMANTIC_TOKENS } from './semantic';
import {
  STORE_THEME_PRESETS,
  buildStoreTheme,
  type StoreColors,
  type StoreTheme,
  type StoreThemeInput,
} from './storeTheme';

// Simulates data from storage or the network, which the compiler cannot check.
const inputFromJson = (json: string): StoreThemeInput => JSON.parse(json) as StoreThemeInput;
const themeFromJson = (json: string): StoreTheme => JSON.parse(json) as StoreTheme;
const colorsFromJson = (json: string): StoreColors => JSON.parse(json) as StoreColors;

const MALFORMED_OKLCH = ['oklch(1.2.3 0.1 100)', 'oklch(. . .)', 'oklch(0.5 0.1 1.2.3)'];

const CSS_INJECTIONS = [
  'red;}body{display:none',
  'url(https://example.com/x.png)',
  'expression(alert(1))',
  '#0b6aa2;}*{color:red',
  'oklch(0.5 0.1 100);}body{display:none',
  'oklch(0.5 0.1 100)</style><script>alert(1)</script>',
  'oklch(0.5 0.1 100) !important',
  'var(--primary)',
];

const hexColor = fc
  .tuple(
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 })
  )
  .map((rgb) => `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`);

describe('color parsing contract', () => {
  it.each(MALFORMED_OKLCH)('parseOklch returns null for the malformed number in %s', (value) => {
    expect(parseOklch(value)).toBeNull();
  });

  it.each(MALFORMED_OKLCH)('toOklch and toHex throw TypeError for %s', (value) => {
    expect(() => toOklch(value)).toThrow(TypeError);
    expect(() => toHex(value)).toThrow(TypeError);
  });
});

describe('buildStoreTheme input contract', () => {
  it.each([...CSS_INJECTIONS, ...MALFORMED_OKLCH])('rejects the primary color %s', (primary) => {
    expect(() => buildStoreTheme({ primary })).toThrow(TypeError);
  });

  it.each([...CSS_INJECTIONS, ...MALFORMED_OKLCH])('rejects the accent color %s', (accent) => {
    expect(() => buildStoreTheme({ primary: '#0b6aa2', accent })).toThrow(TypeError);
  });

  it.each(['{"primary":null}', '{"primary":123}', '{"primary":{}}', '{}'])(
    'rejects a primary that is not a string: %s',
    (json) => {
      expect(() => buildStoreTheme(inputFromJson(json))).toThrow(TypeError);
    }
  );

  it('rejects a null accent instead of falling back to the primary', () => {
    expect(() => buildStoreTheme(inputFromJson('{"primary":"#0b6aa2","accent":null}'))).toThrow(
      TypeError
    );
  });

  it.each([
    ['{"primary":"#0b6aa2","radius":"__proto__"}', 'Unknown store radius: __proto__'],
    ['{"primary":"#0b6aa2","radius":"toString"}', 'Unknown store radius: toString'],
    ['{"primary":"#0b6aa2","radius":null}', 'Unknown store radius: null'],
    ['{"primary":"#0b6aa2","font":null}', 'Unknown store font: null'],
    ['{"primary":"#0b6aa2","font":"bricolage-grotesque"}', 'Unknown store font: bricolage'],
  ])('rejects %s with a TypeError', (json, message) => {
    const build = (): StoreTheme => buildStoreTheme(inputFromJson(json));

    expect(build).toThrow(TypeError);
    expect(build).toThrow(message);
  });

  it('is deterministic: the same input always builds the same theme', () => {
    for (const { input } of STORE_THEME_PRESETS) {
      expect(buildStoreTheme(input)).toEqual(buildStoreTheme({ ...input }));
    }
  });
});

describe('renderStoreThemeCss contract', () => {
  const theme = buildStoreTheme({ primary: '#a94a32', accent: '#2f6b6b', radius: 'sm' });
  const forgeColor = (value: string): StoreTheme => ({
    ...theme,
    light: { ...theme.light, primary: value },
  });

  it.each([...CSS_INJECTIONS, '#ffffff', ...MALFORMED_OKLCH])(
    'rejects the forged color %s',
    (value) => {
      expect(() => renderStoreThemeCss(forgeColor(value))).toThrow(TypeError);
    }
  );

  it.each(['url(x)', 'calc(1px + 1px)', '9999px;}*{', ''])(
    'rejects the forged radius %s',
    (value) => {
      expect(() => renderStoreThemeCss({ ...theme, radius: value })).toThrow(
        'Store theme radius is not one of STORE_RADIUS'
      );
    }
  );

  it('rejects the Purpler brand heading font, which is not a store font', () => {
    const forged = { ...theme, fontHeading: "'Bricolage Grotesque', sans-serif" };

    expect(() => renderStoreThemeCss(forged)).toThrow('Store theme font is not one of STORE_FONTS');
  });

  it('rejects a theme without color schemes instead of emitting an empty block', () => {
    expect(() => renderStoreThemeCss(themeFromJson('{"light":null}'))).toThrow(TypeError);
  });

  it('emits only the semantic tokens, never extra keys smuggled into the colors', () => {
    const smuggled: StoreColors = {
      ...theme.light,
      ...colorsFromJson('{"x;}body{display:none":"oklch(0.5 0.1 100)"}'),
    };
    const css = renderStoreThemeCss({ ...theme, light: smuggled });

    expect(css).not.toContain('display:none');
    expect(css.match(/^ {2}--[\w-]+: /gm)).toHaveLength(SEMANTIC_TOKENS.length * 2 + 4);
  });

  it('accepts every theme the builder produces and emits no markup (property)', () => {
    fc.assert(
      fc.property(hexColor, fc.option(hexColor, { nil: undefined }), (primary, accent) => {
        const css = renderStoreThemeCss(buildStoreTheme({ primary, accent }));
        expect(css).not.toMatch(/[<>"\\]|url\(|expression|!important|@import/i);
      }),
      { numRuns: 200, seed: 20261123 }
    );
  });
});
