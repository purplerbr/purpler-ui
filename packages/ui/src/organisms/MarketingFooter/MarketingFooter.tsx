import type { ComponentProps } from 'react';
import { Logo } from '../../atoms/Logo/Logo';
import { cn } from '../../utils/cn';
import type { MarketingLink } from '../MarketingHeader/MarketingHeader';
import { marketingFooterLinkVariants, marketingFooterVariants } from './MarketingFooter.variants';

export type MarketingFooterProps = ComponentProps<'footer'> & {
  homeHref: string;
  /** Legal and secondary links, such as the terms and the privacy policy. */
  links: readonly MarketingLink[];
  /** Short line under the logo. */
  tagline?: string;
  /** Contact e-mail, shown as a `mailto:` link after its label. */
  contact?: { label: string; email: string };
  /** Last line, such as the copyright. */
  note?: string;
  homeLabel?: string;
  /** Accessible name of the nav landmark. */
  navLabel?: string;
};

/** Footer of the Purpler site: logo, legal links and contact, all from props. */
export function MarketingFooter({
  className,
  homeHref,
  links,
  tagline,
  contact,
  note,
  homeLabel = 'Purpler, página inicial',
  navLabel = 'Rodapé',
  ...props
}: MarketingFooterProps) {
  return (
    <footer
      data-slot="marketing-footer"
      className={cn(marketingFooterVariants(), className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:justify-between md:px-6">
        <div className="grid max-w-sm content-start gap-2">
          <a
            href={homeHref}
            className="inline-flex min-h-11 w-fit items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Logo size="sm" aria-label={homeLabel} />
          </a>
          {tagline ? <p>{tagline}</p> : null}
        </div>
        <div className="grid content-start gap-4">
          <nav aria-label={navLabel}>
            <ul className="flex flex-wrap gap-x-6">
              {links.map(({ href, label, current }) => (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={current ? 'page' : undefined}
                    className={marketingFooterLinkVariants()}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {contact ? (
            <p>
              {contact.label}{' '}
              <a href={`mailto:${contact.email}`} className={marketingFooterLinkVariants()}>
                {contact.email}
              </a>
            </p>
          ) : null}
          {note ? <p>{note}</p> : null}
        </div>
      </div>
    </footer>
  );
}
