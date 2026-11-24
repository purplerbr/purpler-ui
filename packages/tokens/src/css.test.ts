import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { renderFontsCss, renderStoreThemeCss, renderThemeCss, renderTokensCss } from './css';
import { FONT_FAMILIES, listFontFaces } from './fonts';
import { BRAND_LOGO_TOKENS, SEMANTIC_TOKENS, brandLogo, semantic, skeleton } from './semantic';
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

  it.each(BRAND_LOGO_TOKENS)('declares the logo color --%s in light and dark', (token) => {
    expect(light).toContain(`  --${token}: ${brandLogo.light[token].oklch};`);
    expect(dark).toContain(`  --${token}: ${brandLogo.dark[token].oklch};`);
  });

  it('declares the skeleton color in light and dark', () => {
    expect(light).toContain(`  --skeleton: ${skeleton.light.oklch};`);
    expect(dark).toContain(`  --skeleton: ${skeleton.dark.oklch};`);
  });

  it('declares radius, fonts, elevation and motion once, in :root', () => {
    expect(light).toContain('  --radius: 0.875rem;');
    expect(light).toContain('  --button-radius: 1.5rem;');
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

  it.each([...SEMANTIC_TOKENS, ...BRAND_LOGO_TOKENS, 'skeleton'])(
    'maps --color-%s to its variable',
    (token) => {
      expect(css).toContain(`  --color-${token}: var(--${token});`);
    }
  );

  it.each([
    'color',
    'font',
    'font-weight',
    'text',
    'radius',
    'shadow',
    'inset-shadow',
    'drop-shadow',
    'text-shadow',
    'ease',
  ])('drops the literal Tailwind --%s-* scale', (namespace) => {
    expect(css).toContain(`  --${namespace}-*: initial;`);
  });

  it('maps the brand font weights to the Tailwind names', () => {
    expect(css).toContain('  --font-weight-normal: 400;');
    expect(css).toContain('  --font-weight-semibold: 600;');
    expect(css).toContain('  --font-weight-extrabold: 800;');
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

  it('never derives or writes the Purpler logo or skeleton colors', () => {
    const smuggled = {
      ...theme,
      light: { ...theme.light, 'brand-mark': theme.light.primary, skeleton: '#ff0000' },
      dark: { ...theme.dark, 'brand-wordmark': theme.dark.primary, skeleton: '#ff0000' },
    };
    const css = renderStoreThemeCss(smuggled);

    expect(Object.keys(theme.light)).not.toContain('brand-mark');
    expect(Object.keys(theme.light)).not.toContain('skeleton');
    expect(css).not.toMatch(/--brand-(mark|wordmark)/);
    expect(css).not.toContain('skeleton');
  });

  it('writes the canonical color, not the padded value it validated', () => {
    const padded = { ...theme, light: { ...theme.light, primary: ` ${theme.light.primary} ` } };

    expect(blockOf(renderStoreThemeCss(padded), ':root')).toContain(
      `\n  --primary: ${theme.light.primary};`
    );
  });

  it('reads each field once, so a getter that changes value cannot reach the CSS', () => {
    let colorReads = 0;
    let radiusReads = 0;
    const light = { ...theme.light };
    Object.defineProperty(light, 'primary', {
      enumerable: true,
      get: () => {
        colorReads += 1;
        return colorReads === 1 ? theme.light.primary : '</style><script>alert(1)</script>';
      },
    });
    const forged = { ...theme, light };
    Object.defineProperty(forged, 'radius', {
      enumerable: true,
      get: () => {
        radiusReads += 1;
        return radiusReads === 1 ? theme.radius : '1px;}*{color:red';
      },
    });

    const css = renderStoreThemeCss(forged);

    expect(css).not.toMatch(/[<>]|color:red/);
    expect(blockOf(css, ':root')).toContain(`\n  --primary: ${theme.light.primary};`);
    expect([colorReads, radiusReads]).toEqual([1, 1]);
  });

  it('rejects a well-formed theme whose pairs fall below WCAG AA', () => {
    const forged = { ...theme, light: { ...theme.light, primary: theme.light.background } };

    expect(() => renderStoreThemeCss(forged)).toThrow(
      'Store theme fails WCAG AA: light background × primary, light card × primary'
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
