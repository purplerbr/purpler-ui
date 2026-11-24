import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { MarketingFooter } from '../../organisms/MarketingFooter/MarketingFooter';
import { MarketingHeader } from '../../organisms/MarketingHeader/MarketingHeader';
import { MarketingLayout } from './MarketingLayout';

function Page() {
  return (
    <MarketingLayout
      header={
        <MarketingHeader
          homeHref="/"
          links={[{ href: '/planos', label: 'Planos' }]}
          cta={{ href: '/construindo', label: 'Começar grátis' }}
        />
      }
      footer={
        <MarketingFooter homeHref="/" links={[{ href: '/termos', label: 'Termos de uso' }]} />
      }
    >
      <h1>Sua loja online com a sua marca</h1>
    </MarketingLayout>
  );
}

describe('MarketingLayout', () => {
  it('renders banner, main and contentinfo landmarks in reading order', () => {
    render(<Page />);

    const [banner, main, footer] = [
      screen.getByRole('banner'),
      screen.getByRole('main'),
      screen.getByRole('contentinfo'),
    ];
    expect(banner.compareDocumentPosition(main)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(main.compareDocumentPosition(footer)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(within(main).getByRole('heading', { level: 1 })).toBeVisible();
  });

  it('gives the main the skip link target id and lets it take focus', async () => {
    const user = userEvent.setup();
    render(<Page />);
    const main = screen.getByRole('main');

    await user.tab();
    const skip = screen.getByRole('link', { name: 'Pular para o conteúdo' });
    expect(skip).toHaveAttribute('href', `#${main.id}`);
    expect(main).toHaveAttribute('id', 'conteudo');
    main.focus();
    expect(main).toHaveFocus();
  });

  it('takes a custom content id and leaves the footer out when there is none', () => {
    render(
      <MarketingLayout header={<header>Purpler</header>} contentId="principal">
        <h1>Termos</h1>
      </MarketingLayout>
    );

    expect(screen.getByRole('main')).toHaveAttribute('id', 'principal');
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Page />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
