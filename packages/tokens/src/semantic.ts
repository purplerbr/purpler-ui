import { palette, white, type ColorValue, type ScaleName, type ScaleStep } from './palette';
import type { ContrastLevel } from './color';

export const SEMANTIC_TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
  'info',
  'info-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const;
export type SemanticToken = (typeof SEMANTIC_TOKENS)[number];
export type ColorScheme = 'light' | 'dark';
export type PaletteRef = `${ScaleName}.${ScaleStep}` | 'white';

export interface SemanticColor extends ColorValue {
  ref: PaletteRef;
}

export type SemanticTokens = Readonly<Record<SemanticToken, SemanticColor>>;

const ref = (scale: ScaleName, step: ScaleStep): SemanticColor => ({
  ref: `${scale}.${step}`,
  ...palette[scale][step],
});
const base: SemanticColor = { ref: 'white', ...white };

/** shadcn-style semantic tokens of the Purpler brand, light and dark. */
export const semantic: Readonly<Record<ColorScheme, SemanticTokens>> = {
  light: {
    background: ref('neutral', 50),
    foreground: ref('neutral', 950),
    card: base,
    'card-foreground': ref('neutral', 950),
    popover: base,
    'popover-foreground': ref('neutral', 950),
    primary: ref('brand', 600),
    'primary-foreground': base,
    secondary: ref('brand', 100),
    'secondary-foreground': ref('brand', 800),
    muted: ref('neutral', 100),
    'muted-foreground': ref('neutral', 600),
    accent: ref('accent', 100),
    'accent-foreground': ref('accent', 900),
    destructive: ref('danger', 600),
    'destructive-foreground': base,
    success: ref('success', 700),
    'success-foreground': base,
    warning: ref('warning', 400),
    'warning-foreground': ref('warning', 950),
    info: ref('info', 600),
    'info-foreground': base,
    border: ref('neutral', 200),
    input: ref('neutral', 500),
    ring: ref('brand', 500),
    'chart-1': ref('brand', 600),
    'chart-2': ref('accent', 600),
    'chart-3': ref('info', 500),
    'chart-4': ref('success', 600),
    'chart-5': ref('brand', 800),
    sidebar: ref('neutral', 100),
    'sidebar-foreground': ref('neutral', 900),
    'sidebar-primary': ref('brand', 600),
    'sidebar-primary-foreground': base,
    'sidebar-accent': ref('brand', 100),
    'sidebar-accent-foreground': ref('brand', 900),
    'sidebar-border': ref('neutral', 200),
    'sidebar-ring': ref('brand', 500),
  },
  dark: {
    background: ref('neutral', 950),
    foreground: ref('neutral', 50),
    card: ref('neutral', 900),
    'card-foreground': ref('neutral', 50),
    popover: ref('neutral', 900),
    'popover-foreground': ref('neutral', 50),
    primary: ref('brand', 400),
    'primary-foreground': ref('brand', 950),
    secondary: ref('brand', 900),
    'secondary-foreground': ref('brand', 100),
    muted: ref('neutral', 800),
    'muted-foreground': ref('neutral', 400),
    accent: ref('neutral', 800),
    'accent-foreground': ref('neutral', 50),
    destructive: ref('danger', 400),
    'destructive-foreground': ref('danger', 950),
    success: ref('success', 400),
    'success-foreground': ref('success', 950),
    warning: ref('warning', 400),
    'warning-foreground': ref('warning', 950),
    info: ref('info', 400),
    'info-foreground': ref('info', 950),
    border: ref('neutral', 800),
    input: ref('neutral', 500),
    ring: ref('brand', 400),
    'chart-1': ref('brand', 400),
    'chart-2': ref('accent', 400),
    'chart-3': ref('info', 400),
    'chart-4': ref('success', 400),
    'chart-5': ref('brand', 200),
    sidebar: ref('neutral', 900),
    'sidebar-foreground': ref('neutral', 100),
    'sidebar-primary': ref('brand', 400),
    'sidebar-primary-foreground': ref('brand', 950),
    'sidebar-accent': ref('neutral', 800),
    'sidebar-accent-foreground': ref('neutral', 50),
    'sidebar-border': ref('neutral', 800),
    'sidebar-ring': ref('brand', 400),
  },
};

export const BRAND_LOGO_TOKENS = ['brand-mark', 'brand-wordmark'] as const;
export type BrandLogoToken = (typeof BRAND_LOGO_TOKENS)[number];

/** Purpler logo colors (Etiqueta files). Kept out of SEMANTIC_TOKENS so a store theme never changes them. */
export const brandLogo: Readonly<
  Record<ColorScheme, Readonly<Record<BrandLogoToken, SemanticColor>>>
> = {
  light: { 'brand-mark': ref('brand', 600), 'brand-wordmark': ref('brand', 950) },
  dark: { 'brand-mark': ref('brand', 300), 'brand-wordmark': ref('neutral', 50) },
};

/** Minimum ratio of `skeleton` on `background` and `card`: decorative separation, not a WCAG target. */
export const SKELETON_MINIMUM = 1.3;

/** Loading placeholder color. Kept out of the store theme, like the logo; `muted` was too close to the page. */
export const skeleton: Readonly<Record<ColorScheme, SemanticColor>> = {
  light: ref('neutral', 300),
  dark: ref('neutral', 700),
};

export interface SemanticPair {
  level: ContrastLevel;
  background: SemanticToken;
  foreground: SemanticToken;
}

const text = (background: SemanticToken, foreground: SemanticToken): SemanticPair => ({
  level: 'text',
  background,
  foreground,
});
const ui = (background: SemanticToken, foreground: SemanticToken): SemanticPair => ({
  level: 'ui',
  background,
  foreground,
});

/** Every background × foreground pair the components use; each one must reach WCAG AA. */
export const SEMANTIC_PAIRS: readonly SemanticPair[] = [
  text('background', 'foreground'),
  text('background', 'muted-foreground'),
  text('background', 'primary'),
  text('background', 'destructive'),
  text('card', 'card-foreground'),
  text('card', 'muted-foreground'),
  text('card', 'primary'),
  text('popover', 'popover-foreground'),
  text('primary', 'primary-foreground'),
  text('secondary', 'secondary-foreground'),
  text('muted', 'muted-foreground'),
  text('accent', 'accent-foreground'),
  text('destructive', 'destructive-foreground'),
  text('success', 'success-foreground'),
  text('warning', 'warning-foreground'),
  text('info', 'info-foreground'),
  text('sidebar', 'sidebar-foreground'),
  text('sidebar', 'muted-foreground'),
  text('sidebar', 'primary'),
  text('sidebar-primary', 'sidebar-primary-foreground'),
  text('sidebar-accent', 'sidebar-accent-foreground'),
  ui('background', 'ring'),
  ui('card', 'ring'),
  ui('background', 'input'),
  ui('card', 'input'),
  ui('sidebar', 'sidebar-ring'),
  ui('sidebar', 'ring'),
  ui('sidebar-accent', 'sidebar-primary'),
  ui('card', 'chart-1'),
  ui('card', 'chart-2'),
  ui('card', 'chart-3'),
  ui('card', 'chart-4'),
  ui('card', 'chart-5'),
];
