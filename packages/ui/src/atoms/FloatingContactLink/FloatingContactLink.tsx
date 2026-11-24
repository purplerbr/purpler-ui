import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { floatingContactLinkVariants } from './FloatingContactLink.variants';

export type FloatingContactLinkProps = Omit<ComponentProps<'a'>, 'children' | 'target' | 'rel'> & {
  href: string;
  /** Decorative; the link is named by `label`. */
  icon: ReactNode;
  /** Shown next to the icon from the `md` breakpoint; on phones only screen readers get it. */
  label: string;
  /** Read after the label, because the link always opens a new tab. */
  newTabLabel?: string;
};

/** Contact link fixed to the bottom-right corner (a chat, a phone); it opens in a new tab. */
export function FloatingContactLink({
  className,
  icon,
  label,
  newTabLabel = '(abre em nova aba)',
  ...props
}: FloatingContactLinkProps) {
  return (
    <a
      data-slot="floating-contact-link"
      // Starts with the visible text, so voice control users can say what they see (WCAG 2.5.3).
      aria-label={`${label} ${newTabLabel}`}
      className={cn(floatingContactLinkVariants(), className)}
      {...props}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span aria-hidden="true" className="contents">
        {icon}
      </span>
      <span className="hidden md:inline">{label}</span>
    </a>
  );
}
