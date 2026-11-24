import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from 'lucide-react';
import { fn } from 'storybook/test';
import { Input } from './Input';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Nome da loja',
    placeholder: 'Doces da Ana',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    prefix: { control: 'text', description: 'Texto fixo antes do valor (fica fora do valor)' },
    suffix: { control: 'text', description: 'Texto fixo depois do valor (fica fora do valor)' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean', description: 'Desativa o campo e tira do foco' },
    'aria-invalid': {
      control: 'boolean',
      description: 'Estado de erro; dentro de um `FormField`, vem da prop `error`',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSuffix: Story = {
  args: { 'aria-label': 'Endereço da loja', placeholder: 'docesdaana', suffix: '.purpler.com.br' },
};

export const WithPrefix: Story = {
  args: { 'aria-label': 'Preço', placeholder: '0,00', prefix: 'R$', inputMode: 'decimal' },
};

export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: 'Doces da Ana!' } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'Doces da Ana' } };

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <Input aria-label="Nome da loja" placeholder="Doces da Ana" />
      <Input aria-label="Endereço da loja" placeholder="docesdaana" suffix=".purpler.com.br" />
      <Input aria-label="Preço" placeholder="0,00" prefix="R$" inputMode="decimal" />
      <Input
        aria-label="Buscar produtos"
        type="search"
        placeholder="Buscar produtos"
        prefix={<Search aria-hidden="true" />}
      />
      <Input aria-label="Nome com erro" aria-invalid defaultValue="Doces da Ana!" />
      <Input
        aria-label="Endereço com erro"
        aria-invalid
        defaultValue="doces da ana"
        suffix=".purpler.com.br"
      />
      <Input aria-label="Nome desativado" disabled defaultValue="Doces da Ana" />
      <Input
        aria-label="Endereço desativado"
        disabled
        defaultValue="docesdaana"
        suffix=".purpler.com.br"
      />
    </div>
  ),
};
