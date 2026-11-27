import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { Button, type ButtonProps } from '../../atoms/Button/Button';
import { cn } from '../../utils/cn';
import { alertDialogContentVariants, alertDialogOverlayVariants } from './AlertDialog.variants';

export type AlertDialogProps = ComponentProps<typeof AlertDialogPrimitive.Root>;
export type AlertDialogActionProps = ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<ButtonProps, 'variant' | 'size'>;
export type AlertDialogCancelProps = ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<ButtonProps, 'variant' | 'size'>;

/** Confirmation on Radix AlertDialog: it traps the focus, closes on Esc and returns the focus to the trigger. */
export function AlertDialog(props: AlertDialogProps) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

export function AlertDialogTrigger(props: ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

export function AlertDialogContent({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className={alertDialogOverlayVariants()}
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(alertDialogContentVariants(), className)}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('grid gap-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('font-display text-title-3', className)}
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-small text-muted-foreground', className)}
      {...props}
    />
  );
}

/** Confirms and closes; use `variant="destructive"` when the action cannot be undone. */
export function AlertDialogAction({ className, variant, size, ...props }: AlertDialogActionProps) {
  return (
    <Button variant={variant} size={size} className={className} asChild>
      <AlertDialogPrimitive.Action data-slot="alert-dialog-action" {...props} />
    </Button>
  );
}

/** Closes without acting; Radix focuses it first, so Enter never confirms by accident. */
export function AlertDialogCancel({
  className,
  variant = 'outline',
  size,
  ...props
}: AlertDialogCancelProps) {
  return (
    <Button variant={variant} size={size} className={className} asChild>
      <AlertDialogPrimitive.Cancel data-slot="alert-dialog-cancel" {...props} />
    </Button>
  );
}
