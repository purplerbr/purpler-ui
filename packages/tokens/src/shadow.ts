import type { ColorScheme } from './semantic';

export type ShadowStep = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Warm and short: tinted with ameixa (neutral-950) instead of pure black, with small blur.
const tint = (alpha: number): string => `oklch(0.16 0.011 335 / ${alpha})`;
const night = (alpha: number): string => `oklch(0 0 0 / ${alpha})`;

export const shadow: Readonly<Record<ColorScheme, Readonly<Record<ShadowStep, string>>>> = {
  light: {
    xs: `0 1px 2px 0 ${tint(0.06)}`,
    sm: `0 1px 3px 0 ${tint(0.08)}, 0 1px 2px -1px ${tint(0.06)}`,
    md: `0 4px 8px -2px ${tint(0.1)}, 0 2px 4px -2px ${tint(0.06)}`,
    lg: `0 12px 20px -6px ${tint(0.14)}, 0 4px 8px -4px ${tint(0.08)}`,
    xl: `0 20px 32px -10px ${tint(0.18)}, 0 8px 12px -6px ${tint(0.1)}`,
  },
  dark: {
    xs: `0 1px 2px 0 ${night(0.3)}`,
    sm: `0 1px 3px 0 ${night(0.4)}, 0 1px 2px -1px ${night(0.3)}`,
    md: `0 4px 8px -2px ${night(0.45)}, 0 2px 4px -2px ${night(0.3)}`,
    lg: `0 12px 20px -6px ${night(0.5)}, 0 4px 8px -4px ${night(0.35)}`,
    xl: `0 20px 32px -10px ${night(0.55)}, 0 8px 12px -6px ${night(0.4)}`,
  },
};
