import { cva, type VariantProps } from 'class-variance-authority';

// Every fill × text pair is a semantic pair that the tokens prove AA, store themes included.
export const badgeVariants = cva(
  [
    'inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap',
    'rounded-button border border-transparent px-2.5 py-0.5 font-sans text-caption font-semibold',
    '[&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        accent: 'bg-accent text-accent-foreground',
        outline: 'border-border bg-background text-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        info: 'bg-info text-info-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: { variant: 'primary' },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
