import { typography } from '@purplerbr/tokens';
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Without this, tailwind-merge reads `text-display` as a color and drops it next to `text-primary`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: Object.keys(typography.scale),
      radius: ['button'],
      font: ['display'],
      ease: ['standard', 'enter', 'exit'],
    },
  },
});

/** Joins class names and resolves Tailwind conflicts; the last class wins. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
