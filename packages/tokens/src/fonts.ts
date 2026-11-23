export type FontFamilyId =
  | 'bricolage-grotesque'
  | 'figtree'
  | 'inter'
  | 'montserrat'
  | 'nunito'
  | 'lora'
  | 'space-grotesk';

export type FontSubset = 'latin' | 'latin-ext';
export type FontStyle = 'normal' | 'italic';

interface FontFamilyDefinition {
  name: string;
  weight: string;
  axis: 'wght' | 'opsz';
  italic: boolean;
  generic: 'sans-serif' | 'serif';
}

export interface FontFace {
  family: string;
  file: string;
  style: FontStyle;
  weight: string;
  unicodeRange: string;
}

const SANS_FALLBACK = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const SERIF_FALLBACK = "ui-serif, Georgia, 'Times New Roman', serif";

/** Self-hosted variable fonts (Fontsource 5.3.0, SIL OFL 1.1); `weight` is the range of the file. */
export const FONT_FAMILIES: Readonly<Record<FontFamilyId, FontFamilyDefinition>> = {
  'bricolage-grotesque': {
    name: 'Bricolage Grotesque',
    weight: '200 800',
    axis: 'opsz',
    italic: false,
    generic: 'sans-serif',
  },
  figtree: {
    name: 'Figtree',
    weight: '300 900',
    axis: 'wght',
    italic: true,
    generic: 'sans-serif',
  },
  inter: { name: 'Inter', weight: '100 900', axis: 'wght', italic: true, generic: 'sans-serif' },
  montserrat: {
    name: 'Montserrat',
    weight: '100 900',
    axis: 'wght',
    italic: true,
    generic: 'sans-serif',
  },
  nunito: { name: 'Nunito', weight: '200 1000', axis: 'wght', italic: true, generic: 'sans-serif' },
  lora: { name: 'Lora', weight: '400 700', axis: 'wght', italic: true, generic: 'serif' },
  'space-grotesk': {
    name: 'Space Grotesk',
    weight: '300 700',
    axis: 'wght',
    italic: false,
    generic: 'sans-serif',
  },
};

// Google Fonts subsets; pt-BR only needs latin, latin-ext covers names and imported text.
export const UNICODE_RANGES: Readonly<Record<FontSubset, string>> = {
  latin:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  'latin-ext':
    'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
};

const SUBSETS: readonly FontSubset[] = ['latin', 'latin-ext'];

export function fontStack(id: FontFamilyId): string {
  const family = FONT_FAMILIES[id];
  return `'${family.name}', ${family.generic === 'serif' ? SERIF_FALLBACK : SANS_FALLBACK}`;
}

export function listFontFaces(): FontFace[] {
  return Object.entries(FONT_FAMILIES).flatMap(([id, family]) => {
    const styles: FontStyle[] = family.italic ? ['normal', 'italic'] : ['normal'];
    return SUBSETS.flatMap((subset) =>
      styles.map((style) => ({
        family: family.name,
        file: `${id}-${subset}-${family.axis}-${style}.woff2`,
        style,
        weight: family.weight,
        unicodeRange: UNICODE_RANGES[subset],
      }))
    );
  });
}
