import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Label } from './Label';

describe('Label', () => {
  it('names the control it points to and focuses it when clicked', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="store-name">Nome da loja</Label>
        <input id="store-name" />
      </>
    );

    await user.click(screen.getByText('Nome da loja'));

    expect(screen.getByRole('textbox', { name: 'Nome da loja' })).toHaveFocus();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="email">E-mail de contato</Label>
        <input id="email" type="email" />
      </>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
