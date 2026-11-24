import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import {
  inputAddonVariants,
  inputGroupControlVariants,
  inputGroupVariants,
  inputVariants,
} from './Input.variants';

export type InputProps = Omit<ComponentProps<'input'>, 'prefix'> & {
  /** Fixed text before the value, such as `R$`; never part of the value. */
  prefix?: ReactNode;
  /** Fixed text after the value, such as `.purpler.com.br`; never part of the value. */
  suffix?: ReactNode;
};

export function Input({
  className,
  prefix,
  suffix,
  'aria-describedby': describedBy,
  ...props
}: InputProps) {
  const addonId = useId();

  if (prefix === undefined && suffix === undefined)
    return (
      <input
        data-slot="input"
        aria-describedby={describedBy}
        className={cn(inputVariants(), className)}
        {...props}
      />
    );

  const prefixId = prefix === undefined ? undefined : `${addonId}-prefix`;
  const suffixId = suffix === undefined ? undefined : `${addonId}-suffix`;
  // The addons are read as part of the description, so the value stays only what was typed.
  const ids = [prefixId, suffixId, describedBy].filter(Boolean).join(' ');

  return (
    <div data-slot="input-group" className={cn(inputGroupVariants(), className)}>
      {prefix !== undefined && (
        <span
          id={prefixId}
          data-slot="input-prefix"
          className={inputAddonVariants({ side: 'prefix' })}
        >
          {prefix}
        </span>
      )}
      <input
        data-slot="input"
        aria-describedby={ids}
        className={cn(
          inputGroupControlVariants(),
          prefix !== undefined && 'ps-2',
          suffix !== undefined && 'pe-1'
        )}
        {...props}
      />
      {suffix !== undefined && (
        <span
          id={suffixId}
          data-slot="input-suffix"
          className={inputAddonVariants({ side: 'suffix' })}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}
