import { Check, Minus } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { checkboxFieldVariants, checkboxVariants } from './Checkbox.variants';

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  /** Visible label, tied to the box by `id`; without it, name the box with `aria-label`. */
  label?: ReactNode;
};

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const box = (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      id={checkboxId}
      className={cn(checkboxVariants(), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center"
      >
        <Check aria-hidden="true" className="size-4 group-data-[state=indeterminate]:hidden" />
        <Minus
          aria-hidden="true"
          className="hidden size-4 group-data-[state=indeterminate]:block"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label === undefined) return box;

  return (
    <div data-slot="checkbox-field" className={checkboxFieldVariants()}>
      {box}
      <label
        htmlFor={checkboxId}
        className="cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      >
        {label}
      </label>
    </div>
  );
}
