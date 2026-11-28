import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { textareaVariants } from './Textarea.variants';

export type TextareaProps = ComponentProps<'textarea'>;

export function Textarea({ className, rows = 6, style, ...props }: TextareaProps) {
  // field-sizing ignores `rows`, so the min height reads it from this variable.
  const rowsVariable = { '--textarea-rows': rows };
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      style={{ ...rowsVariable, ...style }}
      className={cn(textareaVariants(), className)}
      {...props}
    />
  );
}
