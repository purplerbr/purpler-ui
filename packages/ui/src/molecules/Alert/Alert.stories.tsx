import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertDescription, AlertTitle } from './Alert';

const VARIANTS = ['info', 'success', 'warning', 'destructive'] as const;

const COPY: Record<(typeof VARIANTS)[number], { title: string; description: string }> = {
  info: {
    title: 'Sua loja está em rascunho',
    description: 'Cadastre um produto e um meio de pagamento para publicar.',
  },
  success: {
    title: 'Produto salvo',
    description: 'As mudanças já aparecem na sua loja.',
  },
  warning: {
    title: 'Você usou 80% das interações com IA',
    description: 'A cota renova no primeiro dia do mês.',
  },
  destructive: {
    title: 'Não foi possível entrar',
    description: 'A conexão com o Google falhou. Tente de novo em alguns minutos.',
  },
};

const content = (variant: (typeof VARIANTS)[number]) => (
  <>
    <AlertTitle>{COPY[variant].title}</AlertTitle>
    <AlertDescription>{COPY[variant].description}</AlertDescription>
  </>
);

const meta = {
  title: 'Molecules/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { variant: 'info', children: content('info') },
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description: 'Tipo do aviso: só `destructive` interrompe o leitor de tela (`role="alert"`)',
    },
    children: { control: false, description: '`AlertTitle` e `AlertDescription`' },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = { args: { variant: 'success', children: content('success') } };

export const Warning: Story = { args: { variant: 'warning', children: content('warning') } };

export const Destructive: Story = {
  args: { variant: 'destructive', children: content('destructive') },
};

export const DescriptionOnly: Story = {
  args: { children: <AlertDescription>{COPY.info.description}</AlertDescription> },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      {VARIANTS.map((variant) => (
        <Alert key={variant} variant={variant}>
          {content(variant)}
        </Alert>
      ))}
      {VARIANTS.map((variant) => (
        <Alert key={`${variant}-title`} variant={variant}>
          <AlertTitle>{COPY[variant].title}</AlertTitle>
        </Alert>
      ))}
    </div>
  ),
};
