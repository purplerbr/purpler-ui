import { cva, type VariantProps } from 'class-variance-authority';

// No slide animation: the tokens have no keyframes, and an instant panel already honors reduced motion.
export const sheetOverlayVariants = cva('fixed inset-0 z-50 bg-background/80');

export const sheetContentVariants = cva(
  'fixed z-50 flex flex-col gap-4 overflow-y-auto border-border bg-background text-foreground shadow-lg outline-none',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 max-h-dvh border-b',
        right: 'inset-y-0 right-0 h-dvh w-3/4 max-w-sm border-l',
        bottom: 'inset-x-0 bottom-0 max-h-dvh border-t',
        left: 'inset-y-0 left-0 h-dvh w-3/4 max-w-sm border-r',
      },
    },
    defaultVariants: { side: 'right' },
  }
);

export const sheetCloseVariants = cva([
  'absolute top-3 right-3 inline-flex size-11 cursor-pointer items-center justify-center rounded-button',
  'text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
]);

export type SheetContentVariants = VariantProps<typeof sheetContentVariants>;
