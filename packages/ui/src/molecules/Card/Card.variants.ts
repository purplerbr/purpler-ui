import { cva } from 'class-variance-authority';

export const cardVariants = cva(
  'flex flex-col gap-6 rounded-xl border border-border bg-card py-6 text-card-foreground shadow-sm'
);
