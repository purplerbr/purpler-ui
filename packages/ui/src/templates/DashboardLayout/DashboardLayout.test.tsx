import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { House, Package, Settings } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  DashboardLayout,
  type DashboardLayoutProps,
  type DashboardLinkProps,
  type DashboardNavGroup,
} from './DashboardLayout';

const NAV: readonly DashboardNavGroup[] = [
  { items: [{ href: '/loja/doceria/inicio', label: 'Início', icon: House, current: true }] },
  {
    label: 'Catálogo',
    items: [{ href: '/loja/doceria/produtos', label: 'Produtos', icon: Package }],
  },
  {
    label: 'Loja',
    items: [{ href: '/loja/doceria/configuracoes', label: 'Configurações', icon: Settings }],
  },
];

function Shell(props: Partial<DashboardLayoutProps>) {
  return (
    <DashboardLayout
      homeHref="/loja/doceria/inicio"
      nav={NAV}
      store={
        <>
          <p>Doceria da Ana</p>
          <a href="/lojas">Trocar de loja</a>
        </>
      }
      account={<button type="button">Sair</button>}
      {...props}
    >
      <h1>Produtos</h1>
    </DashboardLayout>
  );
}

const openMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
  return screen.getByRole('dialog', { name: 'Menu' });
};

describe('DashboardLayout', () => {
  it('renders the logo, the store slot, the grouped nav and the account inside the banner', () => {
    render(<Shell />);
    const banner = screen.getByRole('banner');

    expect(within(banner).getByRole('link', { name: 'Purpler, início' })).toHaveAttribute(
      'href',
      '/loja/doceria/inicio'
    );
    expect(within(banner).getByText('Doceria da Ana')).toBeInTheDocument();
    expect(within(banner).getByRole('link', { name: 'Trocar de loja' })).toHaveAttribute(
      'href',
      '/lojas'
    );
    const nav = within(banner).getByRole('navigation', { name: 'Principal' });
    const catalog = within(nav).getByRole('group', { name: 'Catálogo' });
    expect(within(catalog).getByRole('link', { name: 'Produtos' })).toHaveAttribute(
      'href',
      '/loja/doceria/produtos'
    );
    expect(within(banner).getByRole('button', { name: 'Sair' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { level: 1 }));
  });

  it('marks only the current item with aria-current', () => {
    render(<Shell />);

    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Produtos' })).not.toHaveAttribute('aria-current');
  });

  it('puts the skip link first in the tab order and points it at the main content', async () => {
    const user = userEvent.setup();
    render(<Shell />);

    await user.tab();
    const skip = screen.getByRole('link', { name: 'Pular para o conteúdo' });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('href', '#conteudo');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'conteudo');
  });

  it('renders every link through renderLink, so the app can pass its router link', () => {
    const renderLink = vi.fn(({ href, children, ...props }: DashboardLinkProps) => (
      <a data-router-link="" href={`/app${href}`} {...props}>
        {children}
      </a>
    ));
    render(<Shell renderLink={renderLink} />);

    expect(screen.getByRole('link', { name: 'Produtos' })).toHaveAttribute(
      'href',
      '/app/loja/doceria/produtos'
    );
    expect(screen.getByRole('link', { name: 'Purpler, início' })).toHaveAttribute(
      'data-router-link'
    );
    expect(renderLink.mock.calls.map(([link]) => [link.href, link['aria-current']])).toEqual([
      ['/loja/doceria/inicio', undefined],
      ['/loja/doceria/inicio', 'page'],
      ['/loja/doceria/produtos', undefined],
      ['/loja/doceria/configuracoes', undefined],
    ]);
  });

  it('shows a skeleton with a status message while the store loads', () => {
    render(<Shell storeLoading />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando a loja');
    expect(screen.queryByText('Doceria da Ana')).not.toBeInTheDocument();
  });

  it('leaves the store and account areas out when the app passes nothing', () => {
    render(<Shell store={undefined} account={undefined} />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sair' })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument();
  });

  it('opens the menu with the store, the nav and the account, marking the current item', async () => {
    const user = userEvent.setup();
    render(<Shell />);

    const menu = await openMenu(user);
    expect(within(menu).getByText('Doceria da Ana')).toBeInTheDocument();
    const nav = within(menu).getByRole('navigation', { name: 'Principal' });
    expect(within(nav).getByRole('link', { name: 'Início' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(within(menu).getByRole('button', { name: 'Sair' })).toBeInTheDocument();
  });

  it('closes the menu on Esc and returns the focus to the menu button', async () => {
    const user = userEvent.setup();
    render(<Shell />);

    await openMenu(user);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveFocus();
  });

  it('closes the menu when a link is followed and leaves the focus to the new page', async () => {
    const user = userEvent.setup();
    // Stands in for a router link, which prevents the full page load.
    const renderLink = ({ href, children, ...props }: DashboardLinkProps) => (
      <a
        href={href}
        {...props}
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        {children}
      </a>
    );
    render(<Shell renderLink={renderLink} />);

    const menu = await openMenu(user);
    await user.click(within(menu).getByRole('link', { name: 'Produtos' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menu' })).not.toHaveFocus();
  });

  it('keeps the menu open when something other than a link is clicked', async () => {
    const user = userEvent.setup();
    render(<Shell />);

    const menu = await openMenu(user);
    await user.click(within(menu).getByText('Doceria da Ana'));

    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
  });

  it('takes every label and the content id from props', async () => {
    const user = userEvent.setup();
    render(
      <Shell
        homeLabel="Painel"
        navLabel="Painel da loja"
        openMenuLabel="Mostrar navegação"
        menuTitle="Navegação"
        closeMenuLabel="Esconder navegação"
        skipLinkLabel="Ir ao conteúdo"
        contentId="principal"
      />
    );

    expect(screen.getByRole('link', { name: 'Ir ao conteúdo' })).toHaveAttribute(
      'href',
      '#principal'
    );
    expect(screen.getByRole('link', { name: 'Painel' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Mostrar navegação' }));
    const menu = screen.getByRole('dialog', { name: 'Navegação' });
    expect(within(menu).getByRole('navigation', { name: 'Painel da loja' })).toBeInTheDocument();
    await user.click(within(menu).getByRole('button', { name: 'Esconder navegação' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no accessibility violations, closed, loading or with the menu open', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(<Shell />);

    expect(await axe(container)).toHaveNoViolations();
    rerender(<Shell storeLoading />);
    expect(await axe(container)).toHaveNoViolations();
    await openMenu(user);
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
