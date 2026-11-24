import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { MarketingHeader, type MarketingLink } from './MarketingHeader';

const LINKS: readonly MarketingLink[] = [
  { href: '#recursos', label: 'Recursos' },
  { href: '/planos', label: 'Planos', current: true },
];
const CTA = { href: '/construindo?plano=basic', label: 'Começar grátis' };

function Page() {
  return (
    <>
      <MarketingHeader homeHref="/" links={LINKS} cta={CTA} />
      <main id="conteudo" tabIndex={-1}>
        <h1>Planos</h1>
      </main>
    </>
  );
}

const openMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
  return screen.getByRole('dialog', { name: 'Menu' });
};

describe('MarketingHeader', () => {
  it('renders the logo link, the nav and the CTA inside the banner', () => {
    render(<Page />);
    const banner = screen.getByRole('banner');

    expect(within(banner).getByRole('link', { name: 'Purpler, página inicial' })).toHaveAttribute(
      'href',
      '/'
    );
    const nav = within(banner).getByRole('navigation', { name: 'Principal' });
    expect(within(nav).getByRole('link', { name: 'Recursos' })).toHaveAttribute(
      'href',
      '#recursos'
    );
    expect(within(banner).getByRole('link', { name: 'Começar grátis' })).toHaveAttribute(
      'href',
      CTA.href
    );
  });

  it('marks only the current page link with aria-current', () => {
    render(<Page />);

    expect(screen.getByRole('link', { name: 'Planos' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Recursos' })).not.toHaveAttribute('aria-current');
  });

  it('puts the skip link first in the tab order, pointing at the main content', async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.tab();
    const skip = screen.getByRole('link', { name: 'Pular para o conteúdo' });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('href', '#conteudo');
    expect(document.getElementById('conteudo')).toBeInTheDocument();
  });

  it('server-renders the nav links and the CTA, so the page works without JS', () => {
    const html = renderToString(<Page />);

    expect(html).toContain('href="#recursos"');
    expect(html).toContain('href="/planos"');
    expect(html).toContain(CTA.label);
    expect(html).not.toContain('role="dialog"');
  });

  it('opens the menu with the same links, marking the current one', async () => {
    const user = userEvent.setup();
    render(<Page />);

    const menu = await openMenu(user);
    const nav = within(menu).getByRole('navigation', { name: 'Principal' });
    expect(within(nav).getByRole('link', { name: 'Recursos' })).toHaveAttribute(
      'href',
      '#recursos'
    );
    expect(within(nav).getByRole('link', { name: 'Planos' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('closes the menu on Esc and returns the focus to the menu button', async () => {
    const user = userEvent.setup();
    render(<Page />);

    await openMenu(user);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveFocus();
  });

  it('closes the menu when a link is followed and leaves the focus to the browser', async () => {
    const user = userEvent.setup();
    render(<Page />);

    const menu = await openMenu(user);
    await user.click(within(menu).getByRole('link', { name: 'Recursos' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menu' })).not.toHaveFocus();
  });

  it('takes every label and the content id from props', async () => {
    const user = userEvent.setup();
    render(
      <MarketingHeader
        homeHref="/"
        links={LINKS}
        cta={CTA}
        homeLabel="Início"
        navLabel="Site"
        openMenuLabel="Mostrar links"
        menuTitle="Navegação"
        closeMenuLabel="Esconder links"
        skipLinkLabel="Ir ao conteúdo"
        contentId="principal"
      />
    );

    expect(screen.getByRole('link', { name: 'Ir ao conteúdo' })).toHaveAttribute(
      'href',
      '#principal'
    );
    expect(screen.getByRole('link', { name: 'Início' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Mostrar links' }));
    const menu = screen.getByRole('dialog', { name: 'Navegação' });
    expect(within(menu).getByRole('navigation', { name: 'Site' })).toBeInTheDocument();
    await user.click(within(menu).getByRole('button', { name: 'Esconder links' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no accessibility violations, closed or with the menu open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Page />);

    expect(await axe(container)).toHaveNoViolations();
    await openMenu(user);
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
