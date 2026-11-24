import { X } from 'lucide-react';
import { Dialog as SheetPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import {
  sheetCloseVariants,
  sheetContentVariants,
  sheetOverlayVariants,
  type SheetContentVariants,
} from './Sheet.variants';

export type SheetProps = ComponentProps<typeof SheetPrimitive.Root>;
export type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> &
  SheetContentVariants & {
    /** Accessible name of the close button. */
    closeLabel?: string;
  };

/** Side panel on Radix Dialog: it traps the focus, closes on Esc and returns the focus to the trigger. */
export function Sheet(props: SheetProps) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

export function SheetTrigger(props: ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

export function SheetClose(props: ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

export function SheetContent({
  className,
  children,
  side,
  closeLabel = 'Fechar',
  ...props
}: SheetContentProps) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay data-slot="sheet-overlay" className={sheetOverlayVariants()} />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(sheetContentVariants({ side }), className)}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className={sheetCloseVariants()} aria-label={closeLabel}>
          <X aria-hidden="true" className="size-5" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="sheet-header" className={cn('grid gap-1.5 p-4 pr-16', className)} {...props} />
  );
}

export function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('font-display text-title-3', className)}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-small text-muted-foreground', className)}
      {...props}
    />
  );
}
