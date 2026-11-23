import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { renderFontsCss, renderStoreThemeCss, renderThemeCss, renderTokensCss } from './css';
import { FONT_FAMILIES, listFontFaces } from './fonts';
import { SEMANTIC_TOKENS, semantic } from './semantic';
import { buildStoreTheme, type StoreColors, type StoreTheme } from './storeTheme';

// Simulates data from storage or the network, which the compiler cannot check.
const colorsFromJson = (json: string): StoreColors => JSON.parse(json) as StoreColors;

const FONTS_DIR = new URL('../fonts/', import.meta.url);

function blockOf(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`);
  expect(start).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('tokens.css', () => {
  const css = renderTokensCss();
  const light = blockOf(css, ':root');
  const dark = blockOf(css, ".dark,\n[data-theme='dark']");

  it.each(SEMANTIC_TOKENS)(
    'declares --%s in light and dark with the OKLCH of the token',
    (token) => {
      expect(light).toContain(`  --${token}: ${semantic.light[token].oklch};`);
      expect(dark).toContain(`  --${token}: ${semantic.dark[token].oklch};`);
    }
  );

  it('declares radius, fonts, elevation and motion once, in :root', () => {
    expect(light).toContain('  --radius: 0.875rem;');
    expect(light).toContain('  --button-radius: 9999px;');
    expect(light).toContain("  --font-body: 'Figtree', ");
    expect(light).toContain("  --font-heading: 'Bricolage Grotesque', ");
    expect(light).toContain('  --elevation-md: ');
    expect(light).toContain('  --duration-fast: 150ms;');
    expect(light).toContain('  --easing-standard: cubic-bezier(0.2, 0, 0, 1);');
    expect(dark).toContain('  color-scheme: dark;');
    expect(dark).not.toContain('--radius');
  });

  it('contains no hex color, only OKLCH', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });
});

describe('theme.css', () => {
  const css = renderThemeCss();

  it('adds the dark variant for .dark and [data-theme=dark]', () => {
    expect(css).toContain(
      "@custom-variant dark (&:where(.dark, .dark *, [data-theme='dark'], [data-theme='dark'] *));"
    );
  });

  it.each(SEMANTIC_TOKENS)('maps --color-%s to its variable', (token) => {
    expect(css).toContain(`  --color-${token}: var(--${token});`);
  });

  it('drops the literal Tailwind palette, radii and shadows', () => {
    expect(css).toContain('  --color-*: initial;');
    expect(css).toContain('  --radius-*: initial;');
    expect(css).toContain('  --shadow-*: initial;');
  });

  it('derives the radius steps from --radius and maps fonts, shadows and text styles', () => {
    expect(css).toContain('  --radius-sm: calc(var(--radius) - 4px);');
    expect(css).toContain('  --radius-lg: var(--radius);');
    expect(css).toContain('  --radius-xl: calc(var(--radius) + 4px);');
    expect(css).toContain('  --radius-button: var(--button-radius);');
    expect(css).toContain('  --font-display: var(--font-heading);');
    expect(css).toContain('  --shadow-lg: var(--elevation-lg);');
    expect(css).toContain('  --ease-standard: var(--easing-standard);');
    expect(css).toContain('  --default-transition-duration: var(--duration-fast);');
    expect(css).toContain('  --text-display: 3rem;');
    expect(css).toContain('  --text-display--font-weight: 800;');
    expect(css).toContain('  --text-caption--letter-spacing: 0.06em;');
  });
});

describe('fonts.css', () => {
  const css = renderFontsCss();
  const shipped = readdirSync(FONTS_DIR);

  it('references exactly the woff2 files shipped in fonts/', () => {
    const referenced = listFontFaces().map(({ file }) => file);

    expect([...referenced].sort()).toEqual(
      shipped.filter((file) => file.endsWith('.woff2')).sort()
    );
    for (const file of referenced) expect(css).toContain(`url('./fonts/${file}') format('woff2')`);
  });

  it('ships the OFL license of every family', () => {
    for (const id of Object.keys(FONT_FAMILIES)) expect(shipped).toContain(`OFL-${id}.txt`);
  });

  it('declares the brand weights: Bricolage 600–800 and Figtree 400–700 are inside the ranges', () => {
    expect(css).toMatch(
      /font-family: 'Bricolage Grotesque';\n {2}font-style: normal;\n {2}font-display: swap;\n {2}font-weight: 200 800;/
    );
    expect(css).toMatch(
      /font-family: 'Figtree';\n {2}font-style: normal;\n {2}font-display: swap;\n {2}font-weight: 300 900;/
    );
    expect(css).not.toContain('fonts.googleapis.com');
  });
});

describe('renderStoreThemeCss', () => {
  const theme = buildStoreTheme({ primary: '#2e6b3e', radius: 'sm', font: 'nunito' });

  it('overrides colors, radius and fonts in :root and the dark colors in .dark', () => {
    const css = renderStoreThemeCss(theme);

    expect(blockOf(css, ':root')).toContain(`  --primary: ${theme.light.primary};`);
    expect(blockOf(css, ':root')).toContain('  --radius: 0.375rem;');
    expect(blockOf(css, ':root')).toContain("  --font-body: 'Nunito', ");
    expect(blockOf(css, ".dark,\n[data-theme='dark']")).toContain(
      `  --primary: ${theme.dark.primary};`
    );
  });

  it.each<{ label: string; forged: StoreTheme }>([
    {
      label: 'a color',
      forged: { ...theme, light: { ...theme.light, primary: 'red;}body{display:none' } },
    },
    { label: 'a missing color', forged: { ...theme, dark: colorsFromJson('{}') } },
    { label: 'a radius', forged: { ...theme, radius: '1px;}*{color:red' } },
    { label: 'a font', forged: { ...theme, fontHeading: "x';}*{" } },
  ])('rejects $label that buildStoreTheme would never produce', ({ forged }) => {
    expect(() => renderStoreThemeCss(forged)).toThrow(TypeError);
  });
});
