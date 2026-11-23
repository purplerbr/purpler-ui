import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  [
    'grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 rounded-lg px-4 py-3 text-small',
    '[&>svg]:size-5 [&>svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        info: 'bg-info text-info-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: { variant: 'info' },
  }
);

export type AlertVariants = VariantProps<typeof alertVariants>;
