import { cva } from 'class-variance-authority';

export const formFieldVariants = cva('flex w-full flex-col gap-1.5');

export const formFieldDescriptionVariants = cva('text-small text-muted-foreground');

// background × destructive is a semantic pair that the tokens prove AA as text.
export const formFieldErrorVariants = cva('text-small font-semibold text-destructive');
