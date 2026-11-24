import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Badge } from '../Badge/Badge';
import { Label } from '../Label/Label';
import {
  radioGroupDescriptionVariants,
  radioGroupFieldVariants,
  radioGroupItemVariants,
  radioGroupLabelVariants,
  radioGroupTextVariants,
  radioGroupVariants,
  type RadioGroupVariants,
} from './RadioGroup.variants';

type Variant = NonNullable<RadioGroupVariants['variant']>;
const VariantContext = createContext<Variant>('default');

export type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root> & RadioGroupVariants;

/** One choice among a few; name it with `aria-label`, `aria-labelledby` or a `FormField`. */
export function RadioGroup({ className, variant, ...props }: RadioGroupProps) {
  return (
    <VariantContext value={variant ?? 'default'}>
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        className={cn(radioGroupVariants({ variant }), className)}
        {...props}
      />
    </VariantContext>
  );
}

export type RadioGroupItemProps = Omit<
  ComponentProps<typeof RadioGroupPrimitive.Item>,
  'children'
> & {
  label: ReactNode;
  description?: ReactNode;
  /** Short tag next to the label, such as “Em breve”; read as part of the description. */
  badge?: ReactNode;
};

export function RadioGroupItem({
  className,
  label,
  description,
  badge,
  id,
  ...props
}: RadioGroupItemProps) {
  const variant = useContext(VariantContext);
  const generatedId = useId();
  const itemId = id ?? generatedId;
  const badgeId = badge === undefined ? undefined : `${itemId}-badge`;
  const descriptionId = description === undefined ? undefined : `${itemId}-description`;
  const describedBy = [badgeId, descriptionId].filter(Boolean).join(' ') || undefined;

  return (
    <div
      data-slot="radio-group-field"
      className={cn(radioGroupFieldVariants({ variant }), className)}
    >
      <RadioGroupPrimitive.Item
        data-slot="radio-group-item"
        id={itemId}
        aria-describedby={describedBy}
        className={radioGroupItemVariants({ variant })}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-primary" />
      </RadioGroupPrimitive.Item>
      <div className={radioGroupTextVariants()}>
        <Label htmlFor={itemId} className={radioGroupLabelVariants({ variant })}>
          {label}
        </Label>
        {description !== undefined && (
          <p id={descriptionId} className={radioGroupDescriptionVariants()}>
            {description}
          </p>
        )}
      </div>
      {badge !== undefined && (
        <Badge id={badgeId} variant="accent">
          {badge}
        </Badge>
      )}
    </div>
  );
}
