import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RadioGroup, RadioGroupItem } from './RadioGroup';

// Sample copy only: the real plans come from the app (§1.3), never from the lib.
const PLANS = [
  { value: 'basic', label: 'Básico', description: 'Grátis · até 30 produtos físicos' },
  {
    value: 'professional',
    label: 'Profissional',
    description: 'R$ 79,99/mês · até 100 produtos, físicos e digitais',
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: 'R$ 149,99/mês · cursos em vídeo com marca d’água',
    badge: 'Em breve',
    disabled: true,
  },
];

const meta = {
  title: 'Atoms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Plano',
    variant: 'default',
    defaultValue: 'basic',
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'card'],
      description: '`card` mostra cada opção num cartão clicável, para escolhas com detalhes',
    },
    disabled: { control: 'boolean', description: 'Desativa todas as opções' },
    defaultValue: { control: 'text' },
    asChild: { table: { disable: true } },
  },
  render: (args) => (
    <RadioGroup {...args}>
      {PLANS.map((plan) => (
        <RadioGroupItem key={plan.value} {...plan} />
      ))}
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Card: Story = {
  args: { variant: 'card', className: 'max-w-md' },
};

export const Disabled: Story = { args: { disabled: true } };

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-8 md:grid-cols-2">
      <RadioGroup aria-label="Frete" defaultValue="pac">
        <RadioGroupItem value="pac" label="PAC" description="Chega em até 8 dias úteis" />
        <RadioGroupItem value="sedex" label="SEDEX" description="Chega em até 3 dias úteis" />
        <RadioGroupItem value="pickup" label="Retirar na loja" />
        <RadioGroupItem value="moto" label="Motoboy" badge="Em breve" disabled />
      </RadioGroup>
      <RadioGroup aria-label="Plano" variant="card" defaultValue="professional">
        {PLANS.map((plan) => (
          <RadioGroupItem key={plan.value} {...plan} />
        ))}
      </RadioGroup>
    </div>
  ),
};
