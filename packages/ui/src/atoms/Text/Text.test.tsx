import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Text, type TextElement } from './Text';

const ELEMENTS: TextElement[] = ['p', 'span', 'div'];

describe('Text', () => {
  it('renders a paragraph by default', () => {
    render(<Text>Use sua conta Google para entrar.</Text>);

    expect(screen.getByText('Use sua conta Google para entrar.').tagName).toBe('P');
  });

  it.each(ELEMENTS)('renders a %s when asked', (element) => {
    render(<Text as={element}>Frete grátis</Text>);

    expect(screen.getByText('Frete grátis').tagName).toBe(element.toUpperCase());
  });

  it('adds no role or landmark of its own', () => {
    render(
      <Text as="div" size="caption" tone="muted">
        Novidade
      </Text>
    );

    expect(screen.getByText('Novidade')).not.toHaveAttribute('role');
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('forwards the ref and native attributes', () => {
    const ref = { current: null as HTMLParagraphElement | null };
    render(
      <Text ref={ref} id="login-hint" aria-live="polite">
        Abrindo o Google…
      </Text>
    );

    const text = screen.getByText('Abrindo o Google…');
    expect(ref.current).toBe(text);
    expect(text).toHaveAttribute('id', 'login-hint');
    expect(text).toHaveAttribute('aria-live', 'polite');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <h1>Entrar</h1>
        <Text size="body-lg">Venda com a sua marca.</Text>
        <Text tone="muted" size="small">
          Ao continuar, você aceita os <a href="/termos">termos de uso</a>.
        </Text>
        <Text as="span" tone="destructive">
          Não foi possível entrar.
        </Text>
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
