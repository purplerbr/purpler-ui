import { Menu, type LucideIcon } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Button } from '../../atoms/Button/Button';
import { Logo } from '../../atoms/Logo/Logo';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../molecules/Sheet/Sheet';
import { skipLinkVariants } from '../../organisms/MarketingHeader/MarketingHeader.variants';
import { cn } from '../../utils/cn';
import {
  dashboardLayoutVariants,
  dashboardNavLinkVariants,
  dashboardSidebarVariants,
} from './DashboardLayout.variants';

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Marks the page being shown with `aria-current="page"`; a router `NavLink` can do it instead. */
  current?: boolean;
  /** Current only on this exact path (the `end` of a router NavLink); set it on the store home item. */
  end?: boolean;
}

export interface DashboardNavGroup {
  /** Name of the group, shown above its items. */
  label?: string;
  items: readonly DashboardNavItem[];
}

export interface DashboardLinkProps {
  /** `home` is the logo, which is never the current page; `nav` is a menu item. */
  kind: 'home' | 'nav';
  href: string;
  /** Pass it as the `end` of the router `NavLink`. */
  end: boolean;
  className: string;
  'aria-current'?: 'page' | undefined;
  children: ReactNode;
}

export type DashboardLayoutProps = ComponentProps<'div'> & {
  /** Where the logo leads, usually the start page of the current store. */
  homeHref: string;
  nav: readonly DashboardNavGroup[];
  /**
   * "Current store" area at the top of the sidebar: store name and a "Trocar de loja" link.
   * Below `lg` it mounts twice with the menu open: no fixed `id` and no effect that cannot run twice.
   */
  store?: ReactNode;
  /** Store name in the top bar below `lg`, one line cut with an ellipsis; the full text stays in the DOM. */
  storeLabel?: ReactNode;
  /** Shows a skeleton in place of `store` and `storeLabel`. */
  storeLoading?: boolean;
  /**
   * Sidebar footer, for the account and the sign out button.
   * Below `lg` it mounts twice with the menu open: no fixed `id` and no effect that cannot run twice.
   */
  account?: ReactNode;
  /** Renders every link, so the app can pass its router `Link`; defaults to a plain `<a>`. */
  renderLink?: (props: DashboardLinkProps) => ReactElement;
  homeLabel?: string;
  navLabel?: string;
  openMenuLabel?: string;
  menuTitle?: string;
  closeMenuLabel?: string;
  skipLinkLabel?: string;
  storeLoadingLabel?: string;
  /** `id` of the `main`, the skip link target. */
  contentId?: string;
};

const renderAnchor = ({ href, className, children, ...props }: DashboardLinkProps) => (
  <a href={href} className={className} aria-current={props['aria-current']}>
    {children}
  </a>
);

// The Tailwind `lg` breakpoint; past it the sidebar shows, so an open menu sheet must go.
const LG_QUERY = '(min-width: 64rem)';

function StoreArea({
  store,
  loading,
  loadingLabel,
}: {
  store: ReactNode;
  loading: boolean;
  loadingLabel: string;
}) {
  if (loading)
    return (
      <div data-slot="dashboard-layout-store" aria-busy="true" className="grid gap-2 px-6 py-2">
        <span role="status" className="sr-only">
          {loadingLabel}
        </span>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  if (!store) return null;
  return (
    <div data-slot="dashboard-layout-store" className="px-6 py-2">
      {store}
    </div>
  );
}

// Hidden from `lg`, where the sidebar shows `store`; so only one status is exposed at a time.
function TopBarStore({
  label,
  loading,
  loadingLabel,
}: {
  label: ReactNode;
  loading: boolean;
  loadingLabel: string;
}) {
  const className = 'min-w-0 flex-1 border-l border-sidebar-border pl-3 lg:hidden';
  if (loading)
    return (
      <div data-slot="dashboard-layout-store-label" aria-busy="true" className={className}>
        <span role="status" className="sr-only">
          {loadingLabel}
        </span>
        <Skeleton className="h-5 w-3/4" />
      </div>
    );
  if (!label) return null;
  return (
    <div
      data-slot="dashboard-layout-store-label"
      className={cn(className, 'truncate text-small font-semibold')}
    >
      {label}
    </div>
  );
}

function NavGroup({
  group,
  renderLink,
}: {
  group: DashboardNavGroup;
  renderLink: (props: DashboardLinkProps) => ReactElement;
}) {
  const labelId = useId();
  const list = (
    <ul className="grid gap-1">
      {group.items.map(({ href, label, icon: Icon, current, end = false }) => (
        <li key={href}>
          {renderLink({
            kind: 'nav',
            href,
            end,
            className: dashboardNavLinkVariants(),
            'aria-current': current ? 'page' : undefined,
            children: (
              <>
                <Icon aria-hidden="true" className="size-5 shrink-0" />
                {label}
              </>
            ),
          })}
        </li>
      ))}
    </ul>
  );
  if (!group.label) return list;
  return (
    <div role="group" aria-labelledby={labelId} className="grid gap-1">
      <span id={labelId} className="px-3 pt-2 text-small font-normal text-muted-foreground">
        {group.label}
      </span>
      {list}
    </div>
  );
}

function SidebarBody(props: {
  nav: readonly DashboardNavGroup[];
  navLabel: string;
  store: ReactNode;
  storeLoading: boolean;
  storeLoadingLabel: string;
  account: ReactNode;
  renderLink: (props: DashboardLinkProps) => ReactElement;
}) {
  return (
    <>
      <StoreArea
        store={props.store}
        loading={props.storeLoading}
        loadingLabel={props.storeLoadingLabel}
      />
      <nav aria-label={props.navLabel} className="grid gap-4 px-3 py-2">
        {props.nav.map((group) => (
          <NavGroup
            key={group.label ?? group.items.map((item) => item.href).join(' ')}
            group={group}
            renderLink={props.renderLink}
          />
        ))}
      </nav>
      {props.account ? (
        <div
          data-slot="dashboard-layout-account"
          className="mt-auto border-t border-sidebar-border px-6 py-2"
        >
          {props.account}
        </div>
      ) : null}
    </>
  );
}

/**
 * Shell of the merchant dashboard: fixed sidebar from `lg`, a top bar with a menu `Sheet` below it,
 * and the `main` landmark. It knows nothing about stores or routes: everything comes in by props.
 */
export function DashboardLayout({
  className,
  homeHref,
  nav,
  store,
  storeLabel,
  storeLoading = false,
  account,
  renderLink = renderAnchor,
  homeLabel = 'Purpler, início',
  navLabel = 'Principal',
  openMenuLabel = 'Abrir menu',
  menuTitle = 'Menu',
  closeMenuLabel = 'Fechar menu',
  skipLinkLabel = 'Pular para o conteúdo',
  storeLoadingLabel = 'Carregando a loja',
  contentId = 'conteudo',
  children,
  ...props
}: DashboardLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closedBy = useRef<'link' | 'resize' | null>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // jsdom and old browsers have no matchMedia; the menu then just stays open.
    if (typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia(LG_QUERY);
    const close = () => {
      if (!query.matches) return;
      closedBy.current = 'resize';
      setMenuOpen(false);
    };
    query.addEventListener('change', close);
    return () => {
      query.removeEventListener('change', close);
    };
  }, []);
  const body = { nav, navLabel, store, storeLoading, storeLoadingLabel, account, renderLink };

  return (
    <div
      data-slot="dashboard-layout"
      className={cn(dashboardLayoutVariants(), className)}
      {...props}
    >
      <a href={`#${contentId}`} className={skipLinkVariants()}>
        {skipLinkLabel}
      </a>
      <header data-slot="dashboard-layout-sidebar" className={dashboardSidebarVariants()}>
        <div ref={homeRef} className="flex items-center gap-2 px-2 py-2 lg:px-6 lg:pt-6 lg:pb-4">
          <Sheet
            open={menuOpen}
            onOpenChange={(open) => {
              if (open) closedBy.current = null;
              setMenuOpen(open);
            }}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={openMenuLabel}
                className="size-11 lg:hidden"
              >
                <Menu aria-hidden="true" className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              aria-describedby={undefined}
              closeLabel={closeMenuLabel}
              className="bg-sidebar text-sidebar-foreground"
              // A plain click on a link closes the menu; the app moves the focus to the new h1 (§7.2).
              onClick={(event) => {
                const newTab = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
                if (newTab || event.button !== 0) return;
                if (event.target instanceof Element && event.target.closest('a[href]')) {
                  closedBy.current = 'link';
                  setMenuOpen(false);
                }
              }}
              // From `lg` the menu button is hidden, so the focus goes to the logo next to it.
              onCloseAutoFocus={(event) => {
                if (!closedBy.current) return;
                event.preventDefault();
                if (closedBy.current === 'resize')
                  homeRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
              }}
            >
              <SheetHeader>
                <SheetTitle>{menuTitle}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-2">
                <SidebarBody {...body} />
              </div>
            </SheetContent>
          </Sheet>
          {renderLink({
            kind: 'home',
            href: homeHref,
            end: false,
            className:
              'inline-flex min-h-11 shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring',
            children: <Logo size="sm" aria-label={homeLabel} />,
          })}
          <TopBarStore label={storeLabel} loading={storeLoading} loadingLabel={storeLoadingLabel} />
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:gap-2">
          <SidebarBody {...body} />
        </div>
      </header>
      {/* tabIndex -1 lets the skip link move the focus here in every browser, not only scroll. */}
      <main
        id={contentId}
        tabIndex={-1}
        data-slot="dashboard-layout-main"
        className="min-w-0 flex-1 outline-none"
      >
        {children}
      </main>
    </div>
  );
}
