import { Label as LabelPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { labelVariants } from './Label.variants';

export type LabelProps = ComponentProps<typeof LabelPrimitive.Root>;

/** Visible name of a form control, tied to it by `htmlFor`. */
export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root data-slot="label" className={cn(labelVariants(), className)} {...props} />
  );
}
