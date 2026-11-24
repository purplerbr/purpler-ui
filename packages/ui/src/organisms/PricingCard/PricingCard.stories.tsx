import type { Meta, StoryObj } from '@storybook/react-vite';
import { PricingCard, type PricingCardProps } from './PricingCard';

// Example copy only: the real plans come from the app (CLAUDE.md §1.3), never from the lib.
const BASIC: PricingCardProps = {
  name: 'Básico',
  price: 'Grátis',
  description: 'Para abrir a primeira loja e fazer as primeiras vendas.',
  features: ['Até 30 produtos', 'Produtos físicos', '100 interações com IA por mês'],
  cta: { href: '#construindo?plano=basic', label: 'Começar grátis' },
};

const PROFESSIONAL: PricingCardProps = {
  name: 'Profissional',
  price: 'R$ 79,99',
  period: '/mês',
  description: 'Para quem vende também produtos digitais.',
  features: [
    'Tudo do Básico',
    'Até 100 produtos',
    'Produtos físicos e digitais',
    'Entrega automática de produtos digitais',
    '250 interações com IA por mês',
  ],
  cta: { href: '#construindo?plano=professional', label: 'Assinar o Profissional' },
  highlight: 'Mais popular',
};

const ENTERPRISE: PricingCardProps = {
  name: 'Enterprise',
  price: 'R$ 149,99',
  period: '/mês',
  description: 'Para quem vende cursos em vídeo.',
  features: [
    'Tudo do Profissional',
    'Até 150 produtos',
    'Produtos físicos, digitais e cursos',
    'Hospedagem de vídeo integrada',
    'Marca d’água dinâmica',
    '500 interações com IA por mês',
  ],
  cta: { href: '#construindo?plano=enterprise', label: 'Assinar o Enterprise' },
};

const PLANS = [BASIC, PROFESSIONAL, ENTERPRISE] as const;

const meta = {
  title: 'Organisms/PricingCard',
  component: PricingCard,
  tags: ['autodocs'],
  args: BASIC,
  argTypes: {
    name: { control: 'text', description: 'Nome do plano' },
    price: { control: 'text', description: 'Preço já formatado pelo app, como “R$ 79,99”' },
    period: { control: 'text', description: 'Depois do preço, como “/mês”' },
    description: { control: 'text', description: 'Para quem é o plano, em uma frase' },
    features: { control: 'object', description: 'O que o plano inclui' },
    cta: { control: 'object', description: 'Destino e texto do botão' },
    highlight: { control: 'text', description: 'Texto do selo; também destaca o cartão' },
    headingLevel: { control: 'select', options: [2, 3, 4], description: 'Nível do título' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Um plano: nome, preço, o que inclui e o botão. A lib não calcula nem conhece preços: o app passa tudo pronto, a partir da fonte única dos planos. `highlight` mostra o selo (“Mais popular”) e destaca a borda; o selo diz o destaque em texto, sem depender da cor. O botão leva o nome do plano como descrição, para os três “Assinar” não soarem iguais no leitor de tela.',
      },
    },
  },
  render: (args) => (
    <div className="max-w-sm">
      <PricingCard {...args} />
    </div>
  ),
} satisfies Meta<typeof PricingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Highlighted: Story = { args: PROFESSIONAL };

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul className="grid gap-6 md:grid-cols-3">
      {PLANS.map((plan) => (
        <li key={plan.name}>
          <PricingCard {...plan} />
        </li>
      ))}
    </ul>
  ),
};
