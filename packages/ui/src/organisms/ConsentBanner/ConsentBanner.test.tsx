import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ConsentBanner } from './ConsentBanner';

const DESCRIPTION = 'Usamos cookies do Google e da Meta, nos EUA, para medir visitas.';

function setup(focusOnMount?: boolean) {
  const onAccept = vi.fn();
  const onReject = vi.fn();
  render(
    <>
      <button type="button">Antes</button>
      <ConsentBanner
        description={DESCRIPTION}
        privacyHref="/privacidade"
        onAccept={onAccept}
        onReject={onReject}
        {...(focusOnMount === undefined ? {} : { focusOnMount })}
      />
    </>
  );
  return { onAccept, onReject };
}

describe('ConsentBanner', () => {
  it('is a region named by its title, with the description and the privacy link', () => {
    setup();
    const region = screen.getByRole('region', { name: 'Cookies e privacidade' });

    expect(region).toHaveTextContent(DESCRIPTION);
    expect(screen.getByRole('link', { name: 'Política de privacidade' })).toHaveAttribute(
      'href',
      '/privacidade'
    );
  });

  it('calls only the handler of the button that was pressed, by click or keyboard', async () => {
    const user = userEvent.setup();
    const { onAccept, onReject } = setup();

    await user.click(screen.getByRole('button', { name: 'Recusar' }));
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(onAccept).not.toHaveBeenCalled();

    screen.getByRole('button', { name: 'Aceitar' }).focus();
    await user.keyboard('{Enter}');
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it('gives accept and reject the same weight', () => {
    setup();

    expect(screen.getByRole('button', { name: 'Aceitar' }).className).toBe(
      screen.getByRole('button', { name: 'Recusar' }).className
    );
  });

  it('keeps the focus where it was unless asked to take it', () => {
    setup();

    expect(document.body).toHaveFocus();
  });

  it('moves the focus to the title when reopened', () => {
    setup(true);

    expect(screen.getByRole('heading', { level: 2, name: 'Cookies e privacidade' })).toHaveFocus();
  });

  it('takes every label from props', () => {
    render(
      <ConsentBanner
        description="Texto."
        privacyHref="/p"
        onAccept={vi.fn()}
        onReject={vi.fn()}
        title="Privacidade"
        privacyLabel="Saiba mais"
        acceptLabel="Permitir"
        rejectLabel="Não permitir"
      />
    );

    expect(screen.getByRole('region', { name: 'Privacidade' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Saiba mais' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Permitir' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Não permitir' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <ConsentBanner
          description={DESCRIPTION}
          privacyHref="/privacidade"
          onAccept={vi.fn()}
          onReject={vi.fn()}
        />
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
