import { cva } from 'class-variance-authority';

export const emptyStateVariants = cva(
  'mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-12 text-center font-sans text-foreground md:py-16'
);

export const emptyStateIconVariants = cva(
  'flex size-14 items-center justify-center rounded-xl bg-muted text-foreground [&_svg]:size-7'
);
