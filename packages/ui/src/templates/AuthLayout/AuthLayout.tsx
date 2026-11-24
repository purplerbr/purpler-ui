import type { ComponentProps, ReactNode } from 'react';
import { Logo } from '../../atoms/Logo/Logo';
import { cn } from '../../utils/cn';
import { authLayoutVariants } from './AuthLayout.variants';

export type AuthLayoutProps = ComponentProps<'div'> & {
  /** Small print under the card, such as the terms and privacy links. */
  footer?: ReactNode;
};

export function AuthLayout({ className, children, footer, ...props }: AuthLayoutProps) {
  return (
    <div data-slot="auth-layout" className={cn(authLayoutVariants(), className)} {...props}>
      <header data-slot="auth-layout-header">
        <Logo />
      </header>
      <main data-slot="auth-layout-main" className="w-full max-w-md">
        {children}
      </main>
      {footer ? (
        <footer
          data-slot="auth-layout-footer"
          className="max-w-md text-center text-balance text-small text-muted-foreground [&_a]:rounded-xs [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:whitespace-nowrap [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-ring"
        >
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
