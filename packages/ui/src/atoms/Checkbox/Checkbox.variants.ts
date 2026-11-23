import { cva } from 'class-variance-authority';

export const checkboxVariants = cva([
  'group peer relative grid size-5 shrink-0 cursor-pointer place-content-center',
  'rounded-xs border border-input bg-background text-primary-foreground transition-colors',
  // Invisible 40px hit area around the 20px box; WCAG 2.5.8 asks for at least 24px.
  'before:absolute before:-inset-2.5',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
  'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
  'aria-invalid:border-destructive',
]);

export const checkboxFieldVariants = cva('flex items-center gap-2 text-small text-foreground');
