import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { headingVariants, type HeadingVariants } from './Heading.variants';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = ComponentProps<'h2'> &
  HeadingVariants & {
    /** Document outline level (`h1`–`h6`); the look comes from `size`. */
    level?: HeadingLevel;
  };

// Bricolage only from 22 px up (title-3), so levels 4–6 share the smallest heading size.
const DEFAULT_SIZE = {
  1: 'title-1',
  2: 'title-2',
  3: 'title-3',
  4: 'title-3',
  5: 'title-3',
  6: 'title-3',
} as const;

export function Heading({ className, level = 2, size, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      data-slot="heading"
      className={cn(headingVariants({ size: size ?? DEFAULT_SIZE[level] }), className)}
      {...props}
    />
  );
}
