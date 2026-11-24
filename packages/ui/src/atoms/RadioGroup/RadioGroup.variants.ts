import { cva, type VariantProps } from 'class-variance-authority';

export const radioGroupVariants = cva('grid gap-3', {
  variants: { variant: { default: '', card: '' } },
  defaultVariants: { variant: 'default' },
});

export const radioGroupFieldVariants = cva(
  [
    'relative grid grid-cols-[auto_1fr_auto] items-start gap-x-3 text-small text-foreground',
    // The label stretches over the whole row, so clicking anywhere selects; not when disabled.
    // Disabled fades the circle and the label only, so the description and badge stay AA.
    '[&:has(:disabled)_label]:cursor-not-allowed [&:has(:disabled)_label]:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: '',
        card: [
          'rounded-lg border border-input bg-card p-4 text-card-foreground transition-colors',
          'in-aria-invalid:border-destructive',
          'has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-1',
          'has-[[data-state=checked]]:ring-primary',
          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2',
          'has-[:focus-visible]:outline-ring',
        ],
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export const radioGroupItemVariants = cva(
  [
    'peer relative mt-0.5 grid size-5 shrink-0 place-content-center rounded-full',
    'border border-input bg-background transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:border-primary in-aria-invalid:border-destructive',
  ],
  {
    variants: {
      variant: {
        // Invisible 40px hit area around the 20px circle; WCAG 2.5.8 asks for at least 24px.
        default: [
          'before:absolute before:-inset-2.5',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        // The card shows the focus outline around itself.
        card: 'outline-none',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export const radioGroupTextVariants = cva('grid gap-1');

export const radioGroupLabelVariants = cva('cursor-pointer after:absolute after:inset-0', {
  variants: {
    variant: { default: 'font-normal', card: 'text-body font-semibold' },
  },
  defaultVariants: { variant: 'default' },
});

export const radioGroupDescriptionVariants = cva('text-small text-muted-foreground');

export type RadioGroupVariants = VariantProps<typeof radioGroupVariants>;
