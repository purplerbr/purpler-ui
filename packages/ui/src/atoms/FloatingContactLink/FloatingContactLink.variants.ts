import { cva } from 'class-variance-authority';

// z-40 keeps it under the Sheet overlay and the skip link (z-50): an open menu covers it.
// The safe-area insets keep it clear of the iPhone home bar and the notch in landscape.
export const floatingContactLinkVariants = cva([
  'fixed z-40 inline-flex min-h-12 min-w-12 items-center justify-center gap-2 md:px-5',
  'right-[calc(--spacing(4)+env(safe-area-inset-right))] bottom-[calc(--spacing(4)+env(safe-area-inset-bottom))]',
  'rounded-button bg-primary font-sans text-small font-semibold text-primary-foreground shadow-lg',
  'transition-colors hover:bg-primary/90',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  '[&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0',
]);
