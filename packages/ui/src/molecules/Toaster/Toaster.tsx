import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Toaster as Sonner } from 'sonner';
import { toastButtonVariants, toastVariants } from './Toaster.variants';

export type ToasterProps = ComponentProps<typeof Sonner>;

const ICONS = {
  success: <CircleCheck aria-hidden="true" />,
  error: <CircleAlert aria-hidden="true" />,
  warning: <TriangleAlert aria-hidden="true" />,
  info: <Info aria-hidden="true" />,
};

/** Mount once near the app root; show messages with `toast()` from the same subpath. */
export function Toaster({ toastOptions, ...props }: ToasterProps) {
  return (
    <Sonner
      customAriaLabel="Notificações (Alt+T)"
      icons={ICONS}
      toastOptions={{
        // Unstyled drops sonner's literal colors and sizes; the classes below use the tokens.
        unstyled: true,
        closeButtonAriaLabel: 'Fechar notificação',
        ...toastOptions,
        classNames: {
          toast: toastVariants(),
          content: 'grid flex-1 gap-0.5',
          title: 'font-semibold',
          actionButton: toastButtonVariants({ kind: 'action' }),
          cancelButton: toastButtonVariants({ kind: 'cancel' }),
          closeButton: toastButtonVariants({ kind: 'close' }),
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}
