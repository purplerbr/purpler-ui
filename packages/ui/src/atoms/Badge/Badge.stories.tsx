import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkles } from 'lucide-react';
import { Badge } from './Badge';

const VARIANTS = [
  'primary',
  'secondary',
  'accent',
  'outline',
  'success',
  'warning',
  'info',
  'destructive',
] as const;

const EXAMPLES: Record<(typeof VARIANTS)[number], string> = {
  primary: 'Mais popular',
  secondary: 'Novo',
  accent: 'Oferta',
  outline: 'Rascunho',
  success: 'Pago',
  warning: 'Aguardando pagamento',
  info: 'Em separação',
  destructive: 'Cancelado',
};

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Mais popular', variant: 'primary' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS, description: 'Cor do selo' },
    children: { control: 'text', description: 'Texto curto, em até três palavras' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Selo estático para destacar um item: o plano mais escolhido, um rascunho, o status de um pedido. Não é clicável. O texto diz o que o selo significa, sem depender da cor. Escreva com inicial maiúscula (“Rascunho”), não em caixa alta: alguns leitores de tela soletram palavras curtas em maiúsculas.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Draft: Story = { args: { variant: 'outline', children: 'Rascunho' } };

export const WithIcon: Story = {
  args: {
    variant: 'accent',
    children: (
      <>
        <Sparkles aria-hidden="true" />
        Mais popular
      </>
    ),
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant}>
          {EXAMPLES[variant]}
        </Badge>
      ))}
    </div>
  ),
};
