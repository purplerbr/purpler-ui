import { cva } from 'class-variance-authority';

export const marketingFooterVariants = cva(
  'border-t border-border bg-background font-sans text-small text-muted-foreground'
);

export const marketingFooterLinkVariants = cva([
  'inline-flex min-h-11 items-center rounded-sm font-semibold text-foreground underline-offset-4 hover:underline',
  'aria-[current=page]:underline',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
]);
