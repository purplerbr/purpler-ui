import { cva, type VariantProps } from 'class-variance-authority';

// The highlight is also said by the Badge text, so the border color is never the only cue.
export const pricingCardVariants = cva('h-full', {
  variants: {
    highlighted: { true: 'border-2 border-primary shadow-md', false: '' },
  },
  defaultVariants: { highlighted: false },
});

export type PricingCardVariants = VariantProps<typeof pricingCardVariants>;
