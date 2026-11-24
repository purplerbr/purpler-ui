import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { List, ListItem } from './List';

const MARKERS = ['disc', 'none'] as const;

describe('List', () => {
  it.each(MARKERS)('keeps the list and listitem roles with marker %s', (marker) => {
    render(
      <List marker={marker}>
        <ListItem>Cadastre um produto</ListItem>
        <ListItem>Conecte o pagamento</ListItem>
      </List>
    );

    const list = screen.getByRole('list');
    expect(list.tagName).toBe('UL');
    // Explicit, because Safari drops the implicit role under `list-style: none`.
    expect(list).toHaveAttribute('role', 'list');
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent)
    ).toEqual(['Cadastre um produto', 'Conecte o pagamento']);
  });

  it('forwards the ref and native attributes to the list and its items', () => {
    const ref = { current: null as HTMLUListElement | null };
    render(
      <List ref={ref} aria-label="Próximos passos" id="passos">
        <ListItem id="passo-1">Cadastre um produto</ListItem>
      </List>
    );

    const list = screen.getByRole('list', { name: 'Próximos passos' });
    expect(ref.current).toBe(list);
    expect(list).toHaveAttribute('id', 'passos');
    expect(screen.getByRole('listitem')).toHaveAttribute('id', 'passo-1');
  });

  it('has no accessibility violations in any marker, alone or inside an EmptyState', async () => {
    const { container } = render(
      <main>
        <h1>Primeiros passos</h1>
        {MARKERS.map((marker) => (
          <List key={marker} marker={marker}>
            <ListItem>Cadastre um produto</ListItem>
            <ListItem>Conecte o pagamento</ListItem>
          </List>
        ))}
        <EmptyState title="Sua vitrine ainda está vazia">
          <List>
            <ListItem>Cadastre um produto</ListItem>
          </List>
        </EmptyState>
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
