import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { badgeVariants, type BadgeVariants } from './Badge.variants';

export type BadgeProps = ComponentProps<'span'> & BadgeVariants;

/** A short static label, such as “Mais popular”; the text carries the meaning, never the color alone. */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
