import type { ComponentProps, ReactNode } from 'react';
import { Heading, type HeadingLevel } from '../../atoms/Heading/Heading';
import { cn } from '../../utils/cn';
import { emptyStateIconVariants, emptyStateVariants } from './EmptyState.variants';

export type EmptyStateProps = Omit<ComponentProps<'div'>, 'title'> & {
  title: ReactNode;
  /** `1` when the empty state is the whole page, such as a 404. */
  titleLevel?: HeadingLevel;
  /** A lucide icon; it is decorative and hidden from screen readers. */
  icon?: ReactNode;
  description?: ReactNode;
  /** What to do next, usually a `Button`. */
  action?: ReactNode;
};

/** Nothing to show yet (or a page that does not exist): says why and what to do next. */
export function EmptyState({
  className,
  title,
  titleLevel = 2,
  icon,
  description,
  action,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div data-slot="empty-state" className={cn(emptyStateVariants(), className)} {...props}>
      {icon ? (
        <div data-slot="empty-state-icon" aria-hidden="true" className={emptyStateIconVariants()}>
          {icon}
        </div>
      ) : null}
      <Heading level={titleLevel} size="title-2">
        {title}
      </Heading>
      {description ? (
        <p className="text-body text-muted-foreground text-pretty">{description}</p>
      ) : null}
      {children}
      {action ? <div className="flex flex-wrap justify-center gap-3 pt-2">{action}</div> : null}
    </div>
  );
}
