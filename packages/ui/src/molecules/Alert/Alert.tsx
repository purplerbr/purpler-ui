import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { alertVariants, type AlertVariants } from './Alert.variants';

export type AlertProps = ComponentProps<'div'> & AlertVariants;

const ICONS = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  destructive: CircleAlert,
} as const;

export function Alert({ className, variant, children, ...props }: AlertProps) {
  const Icon = ICONS[variant ?? 'info'];

  return (
    <div
      data-slot="alert"
      // Only errors interrupt the screen reader; the other variants are announced politely.
      role={variant === 'destructive' ? 'alert' : 'status'}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon aria-hidden="true" />
      {children}
    </div>
  );
}

export function AlertTitle({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p data-slot="alert-title" className={cn('col-start-2 font-semibold', className)} {...props} />
  );
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="alert-description" className={cn('col-start-2', className)} {...props} />;
}
