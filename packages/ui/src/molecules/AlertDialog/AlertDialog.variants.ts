import { cva } from 'class-variance-authority';

// No zoom animation, as in Sheet: the tokens have no keyframes, and an instant dialog honors reduced motion.
export const alertDialogOverlayVariants = cva('fixed inset-0 z-50 bg-background/80');

export const alertDialogContentVariants = cva([
  'fixed inset-x-4 top-1/2 z-50 mx-auto grid max-h-dvh max-w-lg -translate-y-1/2 gap-4 overflow-y-auto',
  'rounded-xl border border-border bg-background p-6 text-foreground shadow-lg outline-none',
]);
