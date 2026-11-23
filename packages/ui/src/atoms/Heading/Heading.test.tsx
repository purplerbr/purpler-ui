import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Heading, type HeadingLevel } from './Heading';

const LEVELS: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

describe('Heading', () => {
  it('is a level 2 heading by default', () => {
    render(<Heading>Entrar na Purpler</Heading>);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Entrar na Purpler' })
    ).toBeInTheDocument();
  });

  it.each(LEVELS)('renders an h%i for level %i', (level) => {
    render(<Heading level={level}>Seus pedidos</Heading>);

    const heading = screen.getByRole('heading', { level, name: 'Seus pedidos' });
    expect(heading.tagName).toBe(`H${level}`);
  });

  it('keeps the outline level when the size changes', () => {
    render(
      <Heading level={1} size="title-3">
        Minha conta
      </Heading>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Minha conta' })).toBeInTheDocument();
  });

  it('forwards the ref and native attributes', () => {
    const ref = { current: null as HTMLHeadingElement | null };
    render(
      <Heading ref={ref} id="page-title" tabIndex={-1}>
        Produtos
      </Heading>
    );

    const heading = screen.getByRole('heading', { name: 'Produtos' });
    expect(ref.current).toBe(heading);
    expect(heading).toHaveAttribute('id', 'page-title');
  });

  it('has no accessibility violations in an ordered outline', async () => {
    const { container } = render(
      <main>
        {LEVELS.map((level) => (
          <Heading key={level} level={level}>
            {`Título nível ${String(level)}`}
          </Heading>
        ))}
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
