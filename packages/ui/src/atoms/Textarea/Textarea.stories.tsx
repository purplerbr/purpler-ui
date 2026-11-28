import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FormField } from '../../molecules/FormField/FormField';
import { Textarea } from './Textarea';

const POLICY =
  'Você pode devolver o produto em até 7 dias corridos depois de receber o pedido, sem precisar explicar o motivo. ' +
  'O produto precisa voltar sem sinais de uso, com a etiqueta e na embalagem original. ' +
  'Para pedir a devolução, fale com a gente pelo e-mail da loja informando o número do pedido. ' +
  'Assim que o produto chegar e for conferido, devolvemos o valor pago, inclusive o frete, pelo mesmo meio de pagamento.';
const LONG_POLICY = Array.from({ length: 6 }, () => POLICY).join('\n\n');

const meta = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Política de trocas e devoluções',
    placeholder: 'Explique como o cliente pode trocar ou devolver um produto.',
    rows: 6,
    maxLength: 20000,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    rows: {
      control: 'number',
      description: 'Altura mínima, em linhas; o campo cresce com o texto',
    },
    maxLength: { control: 'number', description: 'Limite de caracteres do navegador' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean', description: 'Desativa o campo e tira do foco' },
    'aria-invalid': {
      control: 'boolean',
      description: 'Estado de erro; dentro de um `FormField`, vem da prop `error`',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = { args: { defaultValue: LONG_POLICY } };

export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: POLICY } };

export const Disabled: Story = { args: { disabled: true, defaultValue: POLICY } };

export const InFormField: Story = {
  render: (args) => (
    <FormField
      label="Política de privacidade"
      description="Aparece no rodapé da loja. Até 20.000 caracteres."
      error="Conte como a loja usa os dados dos clientes."
    >
      <Textarea {...args} aria-label={undefined} placeholder="Como a loja usa os dados." />
    </FormField>
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="Política de trocas" placeholder="Como o cliente devolve um produto." />
      <Textarea aria-label="Política de trocas com 3 linhas" rows={3} defaultValue={POLICY} />
      <Textarea aria-label="Política de trocas longa" defaultValue={LONG_POLICY} />
      <Textarea aria-label="Política com erro" aria-invalid defaultValue={POLICY} />
      <Textarea aria-label="Política desativada" disabled defaultValue={POLICY} />
      <FormField
        label="Política de privacidade"
        description="Aparece no rodapé da loja. Até 20.000 caracteres."
      >
        <Textarea maxLength={20000} />
      </FormField>
      <FormField
        label="Política de privacidade com erro"
        error="Conte como a loja usa os dados dos clientes."
      >
        <Textarea />
      </FormField>
    </div>
  ),
};
