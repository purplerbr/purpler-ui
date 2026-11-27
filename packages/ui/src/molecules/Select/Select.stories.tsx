import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FormField } from '../FormField/FormField';
import { Select } from './Select';

const CATEGORIES = [
  { value: 'bolos', label: 'Bolos' },
  { value: 'doces', label: 'Doces' },
  { value: 'salgados', label: 'Salgados' },
  { value: 'bebidas', label: 'Bebidas', disabled: true },
];

const meta = {
  title: 'Molecules/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Categoria',
    options: CATEGORIES,
    placeholder: 'Escolha uma categoria',
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    options: { control: 'object', description: 'Opções `{ value, label, disabled? }`' },
    placeholder: { control: 'text', description: 'Texto enquanto nada foi escolhido' },
    allLabel: {
      control: 'text',
      description: 'Primeira opção que significa “sem filtro”; quando escolhida, informa `""`',
    },
    value: { control: 'text', description: 'Valor controlado' },
    defaultValue: { control: false },
    disabled: { control: 'boolean', description: 'Desativa o campo e tira do foco' },
    asChild: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFormField: Story = {
  render: (args) => (
    <FormField label="Categoria" description="Onde o produto aparece na loja.">
      <Select {...args} aria-label={undefined} />
    </FormField>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <FormField label="Categoria" error="Escolha a categoria do produto.">
      <Select {...args} aria-label={undefined} />
    </FormField>
  ),
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 'bolos' } };

export const AllOption: Story = {
  args: {
    'aria-label': 'Filtrar por categoria',
    allLabel: 'Todas as categorias',
    defaultValue: '',
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-6">
      <FormField label="Vazio">
        <Select options={CATEGORIES} placeholder="Escolha uma categoria" />
      </FormField>
      <FormField label="Escolhido">
        <Select options={CATEGORIES} defaultValue="doces" />
      </FormField>
      <FormField label="Todas" description="Filtro da lista de produtos.">
        <Select options={CATEGORIES} allLabel="Todas as categorias" defaultValue="" />
      </FormField>
      <FormField label="Com erro" error="Escolha a categoria do produto.">
        <Select options={CATEGORIES} placeholder="Escolha uma categoria" />
      </FormField>
      <FormField label="Desativado">
        <Select options={CATEGORIES} defaultValue="bolos" disabled />
      </FormField>
    </div>
  ),
};
