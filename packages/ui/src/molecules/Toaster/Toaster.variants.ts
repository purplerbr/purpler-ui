import { cva } from 'class-variance-authority';

// Same fills as Alert: every fill × text pair is a semantic pair the tokens prove AA.
// The type selectors outrank the default fill, so class order inside sonner does not matter.
export const toastVariants = cva([
  'flex w-full items-start gap-3 rounded-lg border px-4 py-3 font-sans text-small shadow-md',
  'border-border bg-popover text-popover-foreground',
  'data-[type=success]:border-success data-[type=success]:bg-success',
  'data-[type=success]:text-success-foreground',
  'data-[type=error]:border-destructive data-[type=error]:bg-destructive',
  'data-[type=error]:text-destructive-foreground',
  'data-[type=warning]:border-warning data-[type=warning]:bg-warning',
  'data-[type=warning]:text-warning-foreground',
  'data-[type=info]:border-info data-[type=info]:bg-info data-[type=info]:text-info-foreground',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  // Collapsed toasts behind the front one show only their edge, as in sonner's own styles.
  'data-[expanded=false]:data-[front=false]:*:opacity-0',
  '[&_[data-icon]]:mt-px [&_[data-icon]]:shrink-0 [&_[data-icon]>svg]:size-5',
]);

export const toastButtonVariants = cva(
  [
    'shrink-0 cursor-pointer rounded-button px-3 py-1 font-semibold',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  ],
  {
    variants: {
      kind: {
        action: 'bg-primary text-primary-foreground',
        cancel: 'bg-secondary text-secondary-foreground',
        close: 'order-last grid size-6 place-content-center rounded-full [&>svg]:size-4',
      },
    },
  }
);
