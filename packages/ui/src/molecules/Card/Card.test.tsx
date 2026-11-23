import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

function LoginCard({ level = 3 }: { level?: 1 | 2 | 3 }) {
  return (
    <Card aria-labelledby="login-title">
      <CardHeader>
        <CardTitle id="login-title" level={level}>
          Entrar
        </CardTitle>
        <CardDescription>Use sua conta Google para acessar o painel.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Ao continuar, você aceita os termos de uso.</p>
      </CardContent>
      <CardFooter>
        <button type="button">Continuar com Google</button>
      </CardFooter>
    </Card>
  );
}

describe('Card', () => {
  it('renders the title as a level 3 heading by default', () => {
    render(<LoginCard />);

    expect(screen.getByRole('heading', { level: 3, name: 'Entrar' })).toBeInTheDocument();
  });

  it('lets the title take the level the page outline needs', () => {
    render(<LoginCard level={1} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Entrar' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('renders the description as a paragraph and adds no landmark', () => {
    render(<LoginCard />);

    expect(screen.getByText('Use sua conta Google para acessar o painel.').tagName).toBe('P');
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
  });

  it('keeps the content in reading order', () => {
    const { container } = render(<LoginCard />);

    expect(container).toHaveTextContent(
      'EntrarUse sua conta Google para acessar o painel.Ao continuar, você aceita os termos de uso.Continuar com Google'
    );
  });

  it('forwards the ref to the root element (React 19 ref prop)', () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<Card ref={ref}>Resumo</Card>);

    expect(ref.current).toBe(container.firstElementChild);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <h1>Painel</h1>
        <LoginCard level={2} />
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
