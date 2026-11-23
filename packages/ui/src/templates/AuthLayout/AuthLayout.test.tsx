import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { AuthLayout } from './AuthLayout';

function SignInPage({ withFooter = true }: { withFooter?: boolean }) {
  return (
    <AuthLayout
      footer={
        withFooter ? (
          <p>
            Ao continuar, você aceita os <a href="/termos">Termos de uso</a> e a{' '}
            <a href="/privacidade">Política de privacidade</a>.
          </p>
        ) : undefined
      }
    >
      <h1>Entrar na Purpler</h1>
      <button type="button">Continuar com Google</button>
    </AuthLayout>
  );
}

describe('AuthLayout', () => {
  it('shows the Purpler logo inside the banner', () => {
    render(<SignInPage />);

    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('img', { name: 'Purpler' })).toBeInTheDocument();
  });

  it('puts the content inside the main landmark', () => {
    render(<SignInPage />);

    const main = screen.getByRole('main');
    expect(
      within(main).getByRole('heading', { level: 1, name: 'Entrar na Purpler' })
    ).toBeVisible();
    expect(within(main).getByRole('button', { name: 'Continuar com Google' })).toBeVisible();
  });

  it('renders the footer links in a contentinfo landmark', () => {
    render(<SignInPage />);

    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('link', { name: 'Termos de uso' })).toHaveAttribute(
      'href',
      '/termos'
    );
    expect(within(footer).getByRole('link', { name: 'Política de privacidade' })).toBeVisible();
  });

  it('leaves the footer out when there is none', () => {
    render(<SignInPage withFooter={false} />);

    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('tabs from the content to the footer links in reading order', async () => {
    const user = userEvent.setup();
    render(<SignInPage />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Continuar com Google' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Termos de uso' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Política de privacidade' })).toHaveFocus();
  });

  it('forwards the ref and native attributes to the root', () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <AuthLayout ref={ref} id="auth">
        <h1>Entrar</h1>
      </AuthLayout>
    );

    expect(ref.current).toBe(container.firstElementChild);
    expect(ref.current).toHaveAttribute('id', 'auth');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SignInPage />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
