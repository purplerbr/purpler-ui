import { cva } from 'class-variance-authority';

// Same box, focus, invalid and disabled states as `inputVariants`.
export const textareaVariants = cva([
  'block w-full min-w-0 rounded-md border border-input bg-background px-3 py-2',
  'font-sans text-body text-foreground transition-colors placeholder:text-muted-foreground',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive',
  // Grows with the text from `rows` lines up to max-h-96, then scrolls; without
  // field-sizing support, `rows` sets the height and the user can drag it taller.
  'field-sizing-content resize-y overflow-y-auto max-h-96',
  'min-h-[calc(var(--textarea-rows)*1lh+--spacing(4)+2px)]',
]);
