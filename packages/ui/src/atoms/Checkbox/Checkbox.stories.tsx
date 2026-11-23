import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';

const STATES = [
  { label: 'Desmarcado', checked: false },
  { label: 'Marcado', checked: true },
  { label: 'Parcial', checked: 'indeterminate' },
] as const;

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Li e aceito os termos de uso',
    disabled: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    label: { control: 'text', description: 'Texto clicável ligado à caixa pelo `id`' },
    checked: {
      control: 'select',
      options: [false, true, 'indeterminate'],
      description:
        'Estado controlado; `indeterminate` aparece como parcial (`aria-checked="mixed"`)',
    },
    defaultChecked: { control: false },
    disabled: { control: 'boolean', description: 'Desativa a caixa e tira do foco' },
    asChild: { table: { disable: true } },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Indeterminate: Story = {
  args: { label: 'Selecionar todos os pedidos', defaultChecked: 'indeterminate' },
};

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } };

export const WithoutLabel: Story = {
  args: { label: undefined, 'aria-label': 'Selecionar pedido #1001' },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      {[false, true].map((disabled) => (
        <div key={String(disabled)} className="flex flex-col gap-3">
          {STATES.map(({ label, checked }) => (
            <Checkbox
              key={label}
              label={disabled ? `${label} (desativado)` : label}
              defaultChecked={checked}
              disabled={disabled}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};
