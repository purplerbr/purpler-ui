import { cva } from 'class-variance-authority';

export const labelVariants = cva([
  'flex items-center gap-2 font-sans text-small font-semibold text-foreground select-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
]);
