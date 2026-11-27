import { Check, ChevronDown } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import { useState, type ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import {
  selectContentVariants,
  selectItemVariants,
  selectTriggerVariants,
} from './Select.variants';

// Radix forbids an empty item value, so the “all” option uses this one inside and reports ''.
const ALL_VALUE = '__all__';

export type SelectOption = { value: string; label: string; disabled?: boolean | undefined };

export type SelectProps = Omit<
  ComponentProps<typeof SelectPrimitive.Trigger>,
  'children' | 'value' | 'defaultValue' | 'dir'
> & {
  options: readonly SelectOption[];
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  /** Shown while nothing is chosen. */
  placeholder?: string | undefined;
  /** First option meaning “no filter”, such as “Todas as categorias”; it reports the value ''. */
  allLabel?: string | undefined;
};

/** One choice in a list; name it with a `FormField` (label, help and error) or `aria-label`. */
export function Select({
  className,
  options,
  placeholder,
  allLabel,
  value,
  defaultValue,
  onValueChange,
  ...props
}: SelectProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '');
  const current = value ?? uncontrolled;

  function change(next: string) {
    const reported = next === ALL_VALUE ? '' : next;
    setUncontrolled(reported);
    onValueChange?.(reported);
  }

  return (
    <SelectPrimitive.Root
      value={allLabel !== undefined && current === '' ? ALL_VALUE : current}
      onValueChange={change}
    >
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        className={cn(selectTriggerVariants(), className)}
        {...props}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          data-slot="select-content"
          position="popper"
          sideOffset={4}
          className={selectContentVariants()}
        >
          <SelectPrimitive.Viewport className="p-1">
            {allLabel !== undefined && <SelectItem value={ALL_VALUE} label={allLabel} />}
            {options.map((option) => (
              <SelectItem key={option.value} {...option} />
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

function SelectItem({ value, label, disabled = false }: SelectOption) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      value={value}
      disabled={disabled}
      className={selectItemVariants()}
    >
      <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute end-3 inline-flex">
        <Check aria-hidden="true" className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
