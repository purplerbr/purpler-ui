export interface Oklch {
  l: number;
  c: number;
  h: number;
}

type Rgb = readonly [number, number, number];

export type ContrastLevel = 'text' | 'large-text' | 'ui';

/** WCAG 2.2 AA minimum ratios: 1.4.3 for text, 1.4.11 for UI components and focus indicators. */
export const CONTRAST_MINIMUM: Readonly<Record<ContrastLevel, number>> = {
  text: 4.5,
  'large-text': 3,
  ui: 3,
};

export const WHITE = 'oklch(1 0 0)';
export const BLACK = 'oklch(0 0 0)';

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
// One unsigned decimal per channel: `1.2.3` or a lone `.` never match.
const NUMBER = String.raw`(\d+(?:\.\d+)?|\.\d+)`;
const OKLCH_PATTERN = new RegExp(String.raw`^oklch\(\s*${NUMBER}\s+${NUMBER}\s+${NUMBER}\s*\)$`);
const GAMUT_EPSILON = 1e-4;

const toLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c: number): number =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
const clamp01 = (c: number): number => Math.min(1, Math.max(0, c));
const mapRgb = ([r, g, b]: Rgb, fn: (channel: number) => number): Rgb => [fn(r), fn(g), fn(b)];

// Values can come from storage or the network, so the type is checked at runtime too.
function requireString(value: unknown): string {
  if (typeof value !== 'string') throw new TypeError(`Unsupported color: ${String(value)}`);
  return value;
}

function parseHex(value: string): Rgb | null {
  const match = HEX_PATTERN.exec(value.trim());
  const digits = match?.[1];
  if (digits === undefined) return null;
  const full = digits.length === 3 ? digits.replace(/./g, '$&$&') : digits;
  const channel = (i: number): number => parseInt(full.slice(i, i + 2), 16) / 255;
  return [channel(0), channel(2), channel(4)];
}

/** Parses `oklch(L C H)` with L in 0–1; returns null for any other syntax or value. */
export function parseOklch(value: unknown): Oklch | null {
  if (typeof value !== 'string') return null;
  const match = OKLCH_PATTERN.exec(value.trim());
  if (!match) return null;
  const [l, c, h] = match.slice(1).map(Number);
  if (l === undefined || c === undefined || h === undefined) return null;
  if (![l, c, h].every(Number.isFinite) || l > 1) return null;
  return { l, c, h };
}

export function oklchToLinearRgb({ l, c, h }: Oklch): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const lms = [
    (l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    (l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    (l - 0.0894841775 * a - 1.291485548 * b) ** 3,
  ] as const;
  return [
    4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
    -1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
    -0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2],
  ];
}

function linearRgbToOklch([r, g, b]: Rgb): Oklch {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const chroma = Math.hypot(a, bAxis);
  const hue = chroma < GAMUT_EPSILON ? 0 : ((Math.atan2(bAxis, a) * 180) / Math.PI + 360) % 360;
  return { l: lightness, c: chroma, h: hue };
}

export function isInSrgbGamut(color: Oklch): boolean {
  return oklchToLinearRgb(color).every((c) => c >= -GAMUT_EPSILON && c <= 1 + GAMUT_EPSILON);
}

function toLinearRgb(input: unknown): Rgb {
  const value = requireString(input);
  const rgb = parseHex(value);
  if (rgb) return mapRgb(rgb, toLinear);
  const oklch = parseOklch(value);
  if (oklch) return mapRgb(oklchToLinearRgb(oklch), clamp01);
  throw new TypeError(`Unsupported color: ${value}`);
}

/** Converts `#rrggbb`, `#rgb` or `oklch(L C H)` to OKLCH; throws on any other input. */
export function toOklch(value: string): Oklch {
  return parseOklch(requireString(value)) ?? linearRgbToOklch(toLinearRgb(value));
}

export function toHex(value: string): string {
  const channels = mapRgb(toLinearRgb(value), (c) => Math.round(clamp01(toGamma(c)) * 255));
  return `#${channels.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export function formatOklch({ l, c, h }: Oklch): string {
  const round = (n: number, digits: number): number => Number(n.toFixed(digits));
  const chroma = round(c, 3);
  return `oklch(${round(l, 3)} ${chroma} ${chroma === 0 ? 0 : round(h, 1)})`;
}

/** Lowers chroma (keeping lightness and hue) until the color fits sRGB. */
export function clampToSrgb(color: Oklch): Oklch {
  if (isInSrgbGamut(color)) return color;
  let low = 0;
  let high = color.c;
  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    if (isInSrgbGamut({ ...color, c: mid })) low = mid;
    else high = mid;
  }
  return { ...color, c: low };
}

export function relativeLuminance(value: string): number {
  const [r, g, b] = toLinearRgb(value);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio (1–21) between two colors in hex or OKLCH. */
export function contrastRatio(colorA: string, colorB: string): number {
  const [high, low] = [relativeLuminance(colorA), relativeLuminance(colorB)].sort((x, y) => y - x);
  return ((high ?? 0) + 0.05) / ((low ?? 0) + 0.05);
}

export function isAccessiblePair(
  background: string,
  foreground: string,
  level: ContrastLevel = 'text'
): boolean {
  return contrastRatio(background, foreground) >= CONTRAST_MINIMUM[level];
}

/** First candidate that reaches the minimum ratio; if none does, the one with the highest ratio. */
export function pickForeground(
  background: string,
  candidates: readonly string[] = [WHITE, BLACK],
  minimum: number = CONTRAST_MINIMUM.text
): string {
  const ranked = candidates.map((color) => ({ color, ratio: contrastRatio(background, color) }));
  const passing = ranked.find(({ ratio }) => ratio >= minimum);
  if (passing) return passing.color;
  const best = ranked.reduce<{ color: string; ratio: number } | undefined>(
    (top, item) => (top === undefined || item.ratio > top.ratio ? item : top),
    undefined
  );
  if (best === undefined) throw new RangeError('pickForeground needs at least one candidate');
  return best.color;
}
