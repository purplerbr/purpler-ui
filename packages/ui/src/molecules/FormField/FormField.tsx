import { Slot } from 'radix-ui';
import { useId, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { Label } from '../../atoms/Label/Label';
import { cn } from '../../utils/cn';
import {
  formFieldDescriptionVariants,
  formFieldErrorVariants,
  formFieldVariants,
} from './FormField.variants';

export type FormFieldProps = Omit<ComponentProps<'div'>, 'id' | 'children'> & {
  label: ReactNode;
  /** Help text under the control, read after its name. */
  description?: ReactNode;
  /** Error message; when set the control gets `aria-invalid` and the message is announced. */
  error?: string | undefined;
  /** Id of the control; generated when missing. */
  id?: string | undefined;
  /** One control (`Input`, `RadioGroup`…); it receives the id and the ARIA links. */
  children: ReactElement;
};

export function FormField({
  className,
  label,
  description,
  error,
  id,
  children,
  ...props
}: FormFieldProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const labelId = `${controlId}-label`;
  const descriptionId = description === undefined ? undefined : `${controlId}-description`;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div
      data-slot="form-field"
      data-invalid={error ? true : undefined}
      className={cn(formFieldVariants(), className)}
      {...props}
    >
      <Label id={labelId} htmlFor={controlId}>
        {label}
      </Label>
      {/* aria-labelledby also names a RadioGroup, which a <label for> cannot. */}
      <Slot.Root
        id={controlId}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
      >
        {children}
      </Slot.Root>
      {description !== undefined && (
        <p
          id={descriptionId}
          data-slot="form-field-description"
          className={formFieldDescriptionVariants()}
        >
          {description}
        </p>
      )}
      {/* role="alert" announces the message once when it shows; the control's description rereads it on focus. */}
      {error && (
        <p
          id={errorId}
          role="alert"
          data-slot="form-field-error"
          className={formFieldErrorVariants()}
        >
          {error}
        </p>
      )}
    </div>
  );
}
