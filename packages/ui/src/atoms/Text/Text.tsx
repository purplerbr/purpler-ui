import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { textVariants, type TextVariants } from './Text.variants';

export type TextElement = 'p' | 'span' | 'div';

export type TextProps = ComponentProps<'p'> &
  TextVariants & {
    /** Element to render; `p` for paragraphs, `span` inside a line, `div` around blocks. */
    as?: TextElement;
  };

export function Text({ as: Tag = 'p', className, size, tone, ...props }: TextProps) {
  return (
    <Tag data-slot="text" className={cn(textVariants({ size, tone }), className)} {...props} />
  );
}
