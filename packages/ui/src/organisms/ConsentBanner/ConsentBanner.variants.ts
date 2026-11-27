import { cva } from 'class-variance-authority';

// z-40 like FloatingContactLink: later in the DOM, it covers the link; an open Sheet (z-50) covers it.
export const consentBannerVariants = cva([
  'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background font-sans text-foreground shadow-lg',
  'px-4 pt-4 pb-[calc(--spacing(4)+env(safe-area-inset-bottom))] md:px-6',
]);

export const consentBannerLinkVariants = cva([
  'rounded-sm font-semibold text-primary underline underline-offset-4',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
]);
