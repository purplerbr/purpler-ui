import { cva, type VariantProps } from 'class-variance-authority';

// Heights from the 4 px spacing token; the width follows the 133.08 × 26 view box.
export const logoVariants = cva('w-auto shrink-0', {
  variants: {
    size: { sm: 'h-6', md: 'h-8', lg: 'h-10' },
  },
  defaultVariants: { size: 'md' },
});

export type LogoVariants = VariantProps<typeof logoVariants>;
