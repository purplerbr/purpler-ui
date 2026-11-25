import {
  BLACK,
  CONTRAST_MINIMUM,
  WHITE,
  clampToSrgb,
  contrastRatio,
  formatOklch,
  isInSrgbGamut,
  parseOklch,
  pickForeground,
  toOklch,
  type Oklch,
} from './color';
import { fontStack, type FontFamilyId } from './fonts';
import { palette, type ScaleStep } from './palette';
import { semantic, type SemanticToken } from './semantic';

export const STORE_RADIUS = {
  none: { base: '0', button: '0' },
  sm: { base: '0.375rem', button: '0.375rem' },
  md: { base: '0.625rem', button: '0.625rem' },
  lg: { base: '0.875rem', button: '0.875rem' },
  full: { base: '1rem', button: '1.5rem' },
} as const;
export type StoreRadius = keyof typeof STORE_RADIUS;

/** Curated list of the families a merchant can choose (all self-hosted in `fonts.css`). */
export const STORE_FONTS = [
  'figtree',
  'inter',
  'montserrat',
  'nunito',
  'lora',
  'space-grotesk',
] as const satisfies readonly FontFamilyId[];
export type StoreFont = (typeof STORE_FONTS)[number];

export interface StoreThemeInput {
  primary: string;
  accent?: string | undefined;
  radius?: StoreRadius | undefined;
  font?: StoreFont | undefined;
}

export type StoreColors = Readonly<Record<SemanticToken, string>>;

export interface StoreTheme {
  light: StoreColors;
  dark: StoreColors;
  radius: string;
  buttonRadius: string;
  fontBody: string;
  fontHeading: string;
}

type Direction = -1 | 1;
const DARKER: Direction = -1;
const LIGHTER: Direction = 1;
const TEXT = CONTRAST_MINIMUM.text;
const UI = CONTRAST_MINIMUM.ui;
const STEP = 0.005;

const tone = (h: number, l: number, c: number): Oklch => ({ l, c, h });
function render(color: Oklch): string {
  const mapped = clampToSrgb(color);
  // Rounding to 3 decimals can push a color on the gamut edge just outside sRGB.
  for (let c = Math.floor(mapped.c * 1000) / 1000; c > 0; c -= 0.001) {
    const value = formatOklch({ ...mapped, c });
    const parsed = parseOklch(value);
    if (parsed !== null && isInSrgbGamut(parsed)) return value;
  }
  return formatOklch({ ...mapped, c: 0 });
}

/** Moves lightness in one direction until the color reaches `minimum` against every background. */
function fit(color: Oklch, backgrounds: readonly string[], minimum: number, direction: Direction) {
  for (let l = Math.min(1, Math.max(0, color.l)); l >= 0 && l <= 1; l += direction * STEP) {
    const candidate = render({ ...color, l });
    if (backgrounds.every((background) => contrastRatio(background, candidate) >= minimum)) {
      return candidate;
    }
  }
  return direction === DARKER ? BLACK : WHITE;
}

function neutralScale(hue: number, chroma: number): (step: ScaleStep) => Oklch {
  const neutralChroma = Math.min(chroma * 0.06, 0.01);
  return (step) => tone(hue, toOklch(palette.neutral[step].oklch).l, neutralChroma);
}

function statusTokens(scheme: 'light' | 'dark') {
  const tokens = semantic[scheme];
  return {
    destructive: tokens.destructive.oklch,
    'destructive-foreground': tokens['destructive-foreground'].oklch,
    success: tokens.success.oklch,
    'success-foreground': tokens['success-foreground'].oklch,
    warning: tokens.warning.oklch,
    'warning-foreground': tokens['warning-foreground'].oklch,
    info: tokens.info.oklch,
    'info-foreground': tokens['info-foreground'].oklch,
  };
}

function buildLight(primary: Oklch, accent: Oklch): StoreColors {
  const n = neutralScale(primary.h, primary.c);
  const background = render(n(50));
  const card = WHITE;
  const sidebar = render(n(100));
  const surfaces = [background, card];
  const foreground = fit(n(950), surfaces, TEXT, DARKER);
  const brand = fit(primary, [...surfaces, sidebar], TEXT, DARKER);
  const brandForeground = pickForeground(brand, [WHITE, foreground]);
  const secondary = render(tone(primary.h, 0.94, Math.min(primary.c, 0.04)));
  const accentSurface = render(tone(accent.h, 0.96, Math.min(accent.c, 0.035)));
  const muted = render(n(100));
  const ring = fit(
    tone(primary.h, 0.61, Math.min(primary.c, 0.195)),
    [...surfaces, sidebar],
    UI,
    DARKER
  );

  return {
    background,
    foreground,
    card,
    'card-foreground': foreground,
    popover: card,
    'popover-foreground': foreground,
    primary: brand,
    'primary-foreground': brandForeground,
    secondary,
    'secondary-foreground': fit(
      tone(primary.h, 0.385, Math.min(primary.c, 0.15)),
      [secondary],
      TEXT,
      DARKER
    ),
    muted,
    'muted-foreground': fit(n(600), [...surfaces, muted], TEXT, DARKER),
    accent: accentSurface,
    'accent-foreground': fit(
      tone(accent.h, 0.39, Math.min(accent.c, 0.1)),
      [accentSurface],
      TEXT,
      DARKER
    ),
    ...statusTokens('light'),
    border: render(n(200)),
    input: fit(n(500), surfaces, UI, DARKER),
    ring,
    'chart-1': brand,
    'chart-2': fit(tone(accent.h, 0.665, Math.min(accent.c, 0.154)), [card], UI, DARKER),
    'chart-3': semantic.light['chart-3'].oklch,
    'chart-4': semantic.light['chart-4'].oklch,
    'chart-5': fit(tone(primary.h, 0.385, Math.min(primary.c, 0.15)), [card], UI, DARKER),
    sidebar,
    'sidebar-foreground': fit(n(900), [sidebar], TEXT, DARKER),
    'sidebar-primary': brand,
    'sidebar-primary-foreground': brandForeground,
    'sidebar-accent': secondary,
    'sidebar-accent-foreground': fit(
      tone(primary.h, 0.32, Math.min(primary.c, 0.12)),
      [secondary],
      TEXT,
      DARKER
    ),
    'sidebar-border': render(n(200)),
    'sidebar-ring': ring,
  };
}

function buildDark(primary: Oklch, accent: Oklch): StoreColors {
  const n = neutralScale(primary.h, primary.c);
  const background = render(n(950));
  const card = render(n(900));
  const surfaces = [background, card];
  const foreground = fit(n(50), surfaces, TEXT, LIGHTER);
  const brand = fit(primary, surfaces, TEXT, LIGHTER);
  // Black always passes here: the brand already reaches 4.5:1 against the dark card.
  const brandForeground = pickForeground(brand, [
    render(tone(primary.h, 0.255, Math.min(primary.c, 0.09))),
    BLACK,
  ]);
  const secondary = render(tone(primary.h, 0.32, Math.min(primary.c, 0.12)));
  const raised = render(n(800));

  return {
    background,
    foreground,
    card,
    'card-foreground': foreground,
    popover: card,
    'popover-foreground': foreground,
    primary: brand,
    'primary-foreground': brandForeground,
    secondary,
    'secondary-foreground': fit(
      tone(primary.h, 0.94, Math.min(primary.c, 0.04)),
      [secondary],
      TEXT,
      LIGHTER
    ),
    muted: raised,
    'muted-foreground': fit(n(400), [...surfaces, raised], TEXT, LIGHTER),
    accent: raised,
    'accent-foreground': fit(n(50), [raised], TEXT, LIGHTER),
    ...statusTokens('dark'),
    border: raised,
    input: fit(n(500), surfaces, UI, LIGHTER),
    ring: brand,
    'chart-1': brand,
    'chart-2': fit(tone(accent.h, 0.81, Math.min(accent.c, 0.146)), [card], UI, LIGHTER),
    'chart-3': semantic.dark['chart-3'].oklch,
    'chart-4': semantic.dark['chart-4'].oklch,
    'chart-5': fit(tone(primary.h, 0.88, Math.min(primary.c, 0.08)), [card], UI, LIGHTER),
    sidebar: card,
    'sidebar-foreground': fit(n(100), [card], TEXT, LIGHTER),
    'sidebar-primary': brand,
    'sidebar-primary-foreground': brandForeground,
    'sidebar-accent': raised,
    'sidebar-accent-foreground': fit(n(50), [raised], TEXT, LIGHTER),
    'sidebar-border': raised,
    'sidebar-ring': brand,
  };
}

/**
 * Derives every semantic token of a store from the merchant's choices; all pairs meet WCAG AA.
 * Colors are parsed into numbers and re-serialized, so raw input never reaches the CSS.
 */
export function buildStoreTheme({
  primary,
  accent,
  radius = 'lg',
  font = 'figtree',
}: StoreThemeInput): StoreTheme {
  // Input may come from stored JSON, so the unions are checked at runtime too.
  if (!Object.hasOwn(STORE_RADIUS, radius)) throw new TypeError(`Unknown store radius: ${radius}`);
  if (!STORE_FONTS.includes(font)) throw new TypeError(`Unknown store font: ${font}`);
  const brand = toOklch(primary);
  const highlight = accent === undefined ? brand : toOklch(accent);
  const shape = STORE_RADIUS[radius];
  const family = fontStack(font);
  return {
    light: buildLight(brand, highlight),
    dark: buildDark(brand, highlight),
    radius: shape.base,
    buttonRadius: shape.button,
    fontBody: family,
    fontHeading: family,
  };
}

export interface StoreThemePreset {
  id: string;
  name: string;
  description: string;
  input: StoreThemeInput;
}

export const STORE_THEME_PRESETS: readonly StoreThemePreset[] = [
  {
    id: 'oceano',
    name: 'Oceano',
    description: 'Serviços e tecnologia',
    input: { primary: '#0b6aa2', accent: '#f2a541', radius: 'md', font: 'inter' },
  },
  {
    id: 'floresta',
    name: 'Floresta',
    description: 'Natural e orgânico',
    input: { primary: '#2e6b3e', accent: '#d39b2a', radius: 'lg', font: 'nunito' },
  },
  {
    id: 'terracota',
    name: 'Terracota',
    description: 'Casa e artesanato',
    input: { primary: '#a94a32', accent: '#2f6b6b', radius: 'sm', font: 'lora' },
  },
  {
    id: 'rose',
    name: 'Rosê',
    description: 'Moda e beleza',
    input: { primary: '#b83b6f', accent: '#f0b27a', radius: 'full', font: 'montserrat' },
  },
  {
    id: 'grafite',
    name: 'Grafite',
    description: 'Minimalista',
    input: { primary: '#262626', accent: '#e4572e', radius: 'none', font: 'space-grotesk' },
  },
  {
    id: 'lavanda',
    name: 'Lavanda',
    description: 'Criativo e autoral',
    input: { primary: '#6a4bb5', accent: '#2fa192', radius: 'md', font: 'figtree' },
  },
  {
    id: 'cafe',
    name: 'Café',
    description: 'Cafeteria e gastronomia',
    input: { primary: '#6b4a33', accent: '#c08552', radius: 'lg', font: 'lora' },
  },
  {
    id: 'mostarda',
    name: 'Mostarda',
    description: 'Papelaria e infantil',
    input: { primary: '#8a5d00', accent: '#1f6f8b', radius: 'full', font: 'nunito' },
  },
];
