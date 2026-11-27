import { cva } from 'class-variance-authority';

// Same box as Input, so a Select and an Input side by side line up.
export const selectTriggerVariants = cva([
  'flex h-10 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-input',
  'bg-background px-3 text-start font-sans text-body text-foreground transition-colors',
  'data-[placeholder]:text-muted-foreground [&>span]:truncate',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive',
]);

// No zoom animation, as in Sheet: the tokens have no keyframes, and an instant list honors reduced motion.
export const selectContentVariants = cva([
  'relative z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width)',
  'overflow-x-hidden overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md',
]);

export const selectItemVariants = cva([
  'relative flex min-h-10 w-full cursor-pointer items-center rounded-sm py-2 ps-3 pe-9',
  'text-body outline-none select-none',
  'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
]);
