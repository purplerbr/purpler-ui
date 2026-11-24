import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageCircle } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { FloatingContactLink } from './FloatingContactLink';

const NAME = 'Conversar pelo WhatsApp (abre em nova aba)';

function renderLink(props: Partial<Parameters<typeof FloatingContactLink>[0]> = {}) {
  return render(
    <main>
      <h1>Contato</h1>
      <FloatingContactLink
        href="https://example.com/chat"
        icon={<MessageCircle data-testid="icon" />}
        label="Conversar pelo WhatsApp"
        {...props}
      />
    </main>
  );
}

describe('FloatingContactLink', () => {
  it('is a link that opens a new tab without the opener or the referrer', () => {
    renderLink();

    const link = screen.getByRole('link', { name: NAME });
    expect(link).toHaveAttribute('href', 'https://example.com/chat');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('keeps the icon out of the accessibility tree', () => {
    renderLink();

    expect(screen.getByTestId('icon').closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('reads a custom new-tab notice after the label', () => {
    renderLink({ newTabLabel: '(nova janela)' });

    expect(
      screen.getByRole('link', { name: 'Conversar pelo WhatsApp (nova janela)' })
    ).toBeInTheDocument();
  });

  it('is reached with Tab and forwards the ref and native attributes', async () => {
    const ref = { current: null as HTMLAnchorElement | null };
    renderLink({ ref, id: 'contato' });

    await userEvent.tab();

    const link = screen.getByRole('link', { name: NAME });
    expect(link).toHaveFocus();
    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute('id', 'contato');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderLink();

    expect(await axe(container)).toHaveNoViolations();
  });
});
