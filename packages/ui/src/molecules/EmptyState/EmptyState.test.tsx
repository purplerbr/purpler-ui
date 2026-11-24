import { render, screen } from '@testing-library/react';
import { MapPinOff } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title as a level 2 heading by default, with the description and action', () => {
    render(
      <EmptyState
        title="Sua vitrine ainda está vazia"
        description="Cadastre o primeiro produto."
        action={<button type="button">Cadastrar produto</button>}
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Sua vitrine ainda está vazia' })
    ).toBeVisible();
    expect(screen.getByText('Cadastre o primeiro produto.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Cadastrar produto' })).toBeVisible();
  });

  it('becomes the page h1 when titleLevel is 1, as in a 404', () => {
    render(<EmptyState titleLevel={1} title="Não achamos esta página" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Não achamos esta página' })
    ).toBeVisible();
  });

  it('hides the icon from assistive technology', () => {
    const { container } = render(<EmptyState icon={<MapPinOff />} title="Não achamos" />);

    expect(container.querySelector('[data-slot="empty-state-icon"]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('leaves out the optional parts and forwards native attributes', () => {
    const { container } = render(<EmptyState id="vazio" title="Nada aqui" />);

    expect(container.firstElementChild).toHaveAttribute('id', 'vazio');
    expect(container.querySelector('[data-slot="empty-state-icon"]')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <EmptyState
          titleLevel={1}
          icon={<MapPinOff />}
          title="Não achamos esta página"
          description="O endereço pode ter mudado."
          action={<a href="/">Voltar para o início</a>}
        />
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
