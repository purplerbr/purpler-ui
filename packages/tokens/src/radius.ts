/** Base radius (`--radius`) and button radius (`--button-radius`): Balcão buttons are pills. */
export const radius = {
  base: '0.875rem',
  // Half the lg height: one line stays a pill (CSS clamps it), a wrapped label is no ellipse.
  button: '1.5rem',
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
