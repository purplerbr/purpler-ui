import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import logoMono from '../../assets/brand/logo-mono.svg?raw';
import { Logo } from './Logo';

describe('Logo', () => {
  it('is an image named Purpler', () => {
    render(<Logo />);

    expect(screen.getByRole('img', { name: 'Purpler' })).toBeInTheDocument();
  });

  it('takes another accessible name when given one', () => {
    render(<Logo aria-label="Purpler, página inicial" />);

    expect(screen.getByRole('img', { name: 'Purpler, página inicial' })).toBeInTheDocument();
  });

  it('names the link that wraps it', () => {
    render(
      <a href="/">
        <Logo />
      </a>
    );

    expect(screen.getByRole('link', { name: 'Purpler' })).toHaveAttribute('href', '/');
  });

  it('can be hidden from assistive technology when text next to it names the brand', () => {
    render(
      <p>
        <Logo aria-hidden="true" /> Purpler
      </p>
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('forwards the ref and native attributes', () => {
    const ref = { current: null as SVGSVGElement | null };
    render(<Logo ref={ref} id="brand" />);

    const logo = screen.getByRole('img', { name: 'Purpler' });
    expect(ref.current).toBe(logo);
    expect(logo).toHaveAttribute('id', 'brand');
  });

  it('draws the same geometry as the brand file', () => {
    const asset = new DOMParser().parseFromString(logoMono, 'image/svg+xml').documentElement;
    render(<Logo />);

    const logo = screen.getByRole('img', { name: 'Purpler' });
    expect(logo).toHaveAttribute('viewBox', asset.getAttribute('viewBox'));
    const paths = (svg: Element) =>
      [...svg.querySelectorAll('path')].map((path) => path.getAttribute('d'));
    expect(paths(logo)).toEqual(paths(asset));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <header>
        <a href="/">
          <Logo size="sm" />
        </a>
        <Logo size="lg" />
      </header>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
