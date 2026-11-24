import { cva } from 'class-variance-authority';

export const accordionVariants = cva('w-full font-sans text-foreground');

export const accordionItemVariants = cva('group border-b border-border last:border-b-0');

// The summary keeps its native button role; the marker is hidden in Chromium/Firefox and WebKit.
export const accordionTriggerVariants = cva([
  'flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 rounded-sm py-4',
  'text-left text-body font-semibold hover:underline underline-offset-4',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  '[&::-webkit-details-marker]:hidden',
]);

export const accordionContentVariants = cva('pb-4 text-body text-muted-foreground');
