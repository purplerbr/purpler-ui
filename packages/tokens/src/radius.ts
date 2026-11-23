/** Base radius (`--radius`) and button radius (`--button-radius`): Balcão buttons are pills. */
export const radius = {
  base: '0.875rem',
  button: '9999px',
} as const;

/** Tailwind steps derived from `--radius`, in px offsets, so a store theme only changes the base. */
export const RADIUS_STEPS = {
  xs: -6,
  sm: -4,
  md: -2,
  lg: 0,
  xl: 4,
  '2xl': 8,
} as const;
