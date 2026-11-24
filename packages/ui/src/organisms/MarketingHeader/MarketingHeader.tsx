import { Menu } from 'lucide-react';
import { useRef, type ComponentProps } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Logo } from '../../atoms/Logo/Logo';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../molecules/Sheet/Sheet';
import { cn } from '../../utils/cn';
import {
  marketingHeaderVariants,
  marketingNavLinkVariants,
  skipLinkVariants,
} from './MarketingHeader.variants';

export interface MarketingLink {
  href: string;
  label: string;
  /** The link of the page being shown; it gets `aria-current="page"`. */
  current?: boolean;
}

export type MarketingHeaderProps = ComponentProps<'header'> & {
  /** Where the logo leads, usually the home page. */
  homeHref: string;
  links: readonly MarketingLink[];
  cta: Omit<MarketingLink, 'current'>;
  /** Accessible name of the logo link. */
  homeLabel?: string;
  /** Accessible name of the nav landmark. */
  navLabel?: string;
  /** Accessible name of the button that opens the mobile menu. */
  openMenuLabel?: string;
  /** Title of the mobile menu panel. */
  menuTitle?: string;
  closeMenuLabel?: string;
  skipLinkLabel?: string;
  /** `id` of the main content; `MarketingLayout` uses the same default. */
  contentId?: string;
};

function NavLinks({
  links,
  layout,
  onNavigate,
}: {
  links: readonly MarketingLink[];
  layout: 'bar' | 'sheet';
  onNavigate?: () => void;
}) {
  return (
    <ul className={layout === 'bar' ? 'flex flex-wrap items-center gap-x-6' : 'grid gap-1 pb-4'}>
      {links.map(({ href, label, current }) => {
        const link = (
          <a
            href={href}
            aria-current={current ? 'page' : undefined}
            className={marketingNavLinkVariants({ layout })}
            onClick={onNavigate}
          >
            {label}
          </a>
        );
        return (
          <li key={href}>{layout === 'sheet' ? <SheetClose asChild>{link}</SheetClose> : link}</li>
        );
      })}
    </ul>
  );
}

/**
 * Header of the Purpler site. Without JS (`scripting: none`) the links show under the bar on small
 * screens and the menu button hides; with JS the button opens the same links in a `Sheet`.
 */
export function MarketingHeader({
  className,
  homeHref,
  links,
  cta,
  homeLabel = 'Purpler, página inicial',
  navLabel = 'Principal',
  openMenuLabel = 'Abrir menu',
  menuTitle = 'Menu',
  closeMenuLabel = 'Fechar menu',
  skipLinkLabel = 'Pular para o conteúdo',
  contentId = 'conteudo',
  ...props
}: MarketingHeaderProps) {
  const navigated = useRef(false);

  return (
    <header
      data-slot="marketing-header"
      className={cn(marketingHeaderVariants(), className)}
      {...props}
    >
      <a href={`#${contentId}`} className={skipLinkVariants()}>
        {skipLinkLabel}
      </a>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 px-4 py-2 md:gap-x-8 md:px-6">
        <a
          href={homeHref}
          className="inline-flex min-h-11 shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Logo size="sm" aria-label={homeLabel} />
        </a>
        <nav
          aria-label={navLabel}
          className="order-last hidden basis-full pb-2 noscript:block md:order-none md:block md:basis-auto md:pb-0"
        >
          <NavLinks links={links} layout="bar" />
        </nav>
        {/* Basis 0 keeps the CTA on the logo's line down to 320 px; it wraps its own text instead. */}
        <div className="flex grow basis-0 items-center justify-end gap-2">
          <Button asChild size="sm" className="shrink">
            <a href={cta.href}>{cta.label}</a>
          </Button>
          <Sheet
            onOpenChange={(open) => {
              if (open) navigated.current = false;
            }}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={openMenuLabel}
                className="size-11 noscript:hidden md:hidden"
              >
                <Menu aria-hidden="true" className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              aria-describedby={undefined}
              closeLabel={closeMenuLabel}
              // After a link, the browser moves to its target; sending focus back to the button would undo that.
              onCloseAutoFocus={(event) => {
                if (navigated.current) event.preventDefault();
              }}
            >
              <SheetHeader>
                <SheetTitle>{menuTitle}</SheetTitle>
              </SheetHeader>
              <nav aria-label={navLabel}>
                <NavLinks
                  links={links}
                  layout="sheet"
                  onNavigate={() => {
                    navigated.current = true;
                  }}
                />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
