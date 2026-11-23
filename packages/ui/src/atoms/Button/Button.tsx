import { LoaderCircle } from 'lucide-react';
import { Slot } from 'radix-ui';
import type { ComponentProps, MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { buttonVariants, type ButtonVariants } from './Button.variants';

export type ButtonProps = ComponentProps<'button'> &
  ButtonVariants & {
    /** Renders the only child (e.g. a link) with the button styles, via Radix `Slot`. */
    asChild?: boolean;
    /** Blocks activation but keeps the focus, so screen readers do not lose their place. */
    loading?: boolean;
  };

const preventActivation = (event: MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault();
};

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  type = 'button',
  children,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return (
      <Slot.Root data-slot="button" className={classes} onClick={onClick} {...props}>
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      data-slot="button"
      type={type}
      className={classes}
      {...props}
      {...(loading && { 'aria-busy': true, 'aria-disabled': true })}
      onClick={loading ? preventActivation : onClick}
    >
      {loading && (
        <LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
      )}
      {children}
    </button>
  );
}
