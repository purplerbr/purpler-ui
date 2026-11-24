import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { PricingCard } from './PricingCard';

const PLAN = {
  name: 'Profissional',
  price: 'R$ 79,99',
  period: '/mês',
  description: 'Para quem vende produtos digitais.',
  features: ['Até 100 produtos', 'Produtos físicos e digitais'],
  cta: { href: '/construindo?plano=professional', label: 'Assinar' },
};

describe('PricingCard', () => {
  it('shows the plan name as a heading, the price exactly as given and the features', () => {
    render(<PricingCard {...PLAN} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Profissional' })).toBeVisible();
    expect(screen.getByText('R$ 79,99')).toBeVisible();
    expect(screen.getByText('/mês')).toBeVisible();
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(PLAN.features);
  });

  it('links the CTA to the given href and describes it with the plan name', () => {
    render(<PricingCard {...PLAN} />);

    const cta = screen.getByRole('link', { name: 'Assinar' });
    expect(cta).toHaveAttribute('href', PLAN.cta.href);
    expect(cta).toHaveAccessibleDescription('Profissional');
  });

  it('shows the highlight badge only when asked', () => {
    const { rerender } = render(<PricingCard {...PLAN} />);
    expect(screen.queryByText('Mais popular')).not.toBeInTheDocument();

    rerender(<PricingCard {...PLAN} highlight="Mais popular" />);
    expect(screen.getByText('Mais popular')).toBeVisible();
  });

  it('takes the heading level and leaves out the optional parts', () => {
    render(
      <PricingCard
        name="Básico"
        price="Grátis"
        features={['Até 30 produtos']}
        cta={{ href: '/construindo?plano=basic', label: 'Começar grátis' }}
        headingLevel={2}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Básico' })).toBeVisible();
    expect(screen.queryByText('/mês')).not.toBeInTheDocument();
  });

  it('has no accessibility violations, highlighted or not', async () => {
    const { container } = render(
      <main>
        <h2>Planos</h2>
        <PricingCard {...PLAN} />
        <PricingCard {...PLAN} name="Enterprise" highlight="Mais popular" />
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
