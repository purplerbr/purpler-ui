import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { MarketingFooter } from './MarketingFooter';

const LINKS = [
  { href: '/termos', label: 'Termos de uso', current: true },
  { href: '/privacidade', label: 'Política de privacidade' },
];

function Footer() {
  return (
    <MarketingFooter
      homeHref="/"
      links={LINKS}
      tagline="Sua loja, sua marca."
      contact={{ label: 'Fale com a gente:', email: 'contato@purpler.com.br' }}
      note="© 2026 Purpler"
    />
  );
}

describe('MarketingFooter', () => {
  it('renders the legal links in a named nav inside the contentinfo landmark', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    const nav = within(footer).getByRole('navigation', { name: 'Rodapé' });

    expect(within(nav).getByRole('link', { name: 'Termos de uso' })).toHaveAttribute(
      'href',
      '/termos'
    );
    expect(within(nav).getByRole('link', { name: 'Termos de uso' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(within(nav).getByRole('link', { name: 'Política de privacidade' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('links the contact e-mail with mailto and shows the tagline and note', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: 'contato@purpler.com.br' })).toHaveAttribute(
      'href',
      'mailto:contato@purpler.com.br'
    );
    expect(screen.getByText('Sua loja, sua marca.')).toBeVisible();
    expect(screen.getByText('© 2026 Purpler')).toBeVisible();
  });

  it('leaves out the optional parts and takes the labels from props', () => {
    render(<MarketingFooter homeHref="/" links={LINKS} homeLabel="Início" navLabel="Legal" />);

    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('navigation', { name: 'Legal' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /@/ })).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Footer />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
