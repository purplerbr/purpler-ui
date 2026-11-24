import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { marketingLayoutVariants } from './MarketingLayout.variants';

export type MarketingLayoutProps = ComponentProps<'div'> & {
  /** Usually a `MarketingHeader`, which owns the skip link. */
  header: ReactNode;
  /** Usually a `MarketingFooter`. */
  footer?: ReactNode;
  /** `id` of the `main`, the skip link target; same default as `MarketingHeader`. */
  contentId?: string;
};

/** Page shell of the Purpler site: header, the `main` landmark and the footer. */
export function MarketingLayout({
  className,
  header,
  footer,
  contentId = 'conteudo',
  children,
  ...props
}: MarketingLayoutProps) {
  return (
    <div
      data-slot="marketing-layout"
      className={cn(marketingLayoutVariants(), className)}
      {...props}
    >
      {header}
      {/* tabIndex -1 lets the skip link move the focus here in every browser, not only scroll. */}
      <main
        id={contentId}
        tabIndex={-1}
        data-slot="marketing-layout-main"
        className="flex-1 outline-none"
      >
        {children}
      </main>
      {footer}
    </div>
  );
}
