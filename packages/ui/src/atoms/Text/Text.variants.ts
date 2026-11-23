import { cva, type VariantProps } from 'class-variance-authority';

// Tones are the text colors the token tests prove AA on the page background.
export const textVariants = cva('font-sans text-pretty', {
  variants: {
    size: {
      'body-lg': 'text-body-lg',
      body: 'text-body',
      small: 'text-small',
      caption: 'text-caption uppercase',
    },
    tone: {
      inherit: '',
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: { size: 'body', tone: 'inherit' },
});

export type TextVariants = VariantProps<typeof textVariants>;
