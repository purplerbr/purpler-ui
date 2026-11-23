import { LoaderCircle } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { spinnerLabelVariants, spinnerVariants, type SpinnerVariants } from './Spinner.variants';

export type SpinnerProps = ComponentProps<'span'> &
  SpinnerVariants & {
    /** Text announced by screen readers; also shown when `showLabel` is on. */
    label?: string;
    /** Shows the label next to the ring; it always shows when the user asks for reduced motion. */
    showLabel?: boolean;
  };

/** For lazy route chunks (the `<Suspense>` fallback); data screens use `Skeleton` (§7.2). */
export function Spinner({
  className,
  size,
  label = 'Carregando…',
  showLabel = false,
  ...props
}: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      className={cn(spinnerLabelVariants({ size }), className)}
      {...props}
      // status takes no name from content, so the label is also its name; props cannot replace either.
      role="status"
      aria-label={label}
    >
      <LoaderCircle aria-hidden="true" className={spinnerVariants({ size })} />
      {/* A still ring alone does not read as loading, so reduced motion reveals the text. */}
      <span
        data-slot="spinner-label"
        className={showLabel ? undefined : 'sr-only motion-reduce:not-sr-only'}
      >
        {label}
      </span>
    </span>
  );
}
