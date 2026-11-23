import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { skeletonVariants } from './Skeleton.variants';

export type SkeletonProps = ComponentProps<'div'>;

/** Placeholder block; the container that holds it announces the loading (`role="status"`). */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants(), className)}
      {...props}
      aria-hidden="true"
    />
  );
}
