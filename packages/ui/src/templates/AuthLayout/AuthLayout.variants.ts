import { cva } from 'class-variance-authority';

export const authLayoutVariants = cva(
  'flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-4 py-10 text-foreground md:py-16'
);
