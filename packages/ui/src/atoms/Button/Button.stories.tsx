import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Plus, Trash } from 'lucide-react';
import { fn } from 'storybook/test';
import { Text } from '../Text/Text';
import { Button } from './Button';

const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

const VARIANT_LABELS: Record<(typeof VARIANTS)[number], string> = {
  primary: 'Publicar loja',
  secondary: 'Ver detalhes',
  outline: 'Editar produto',
  ghost: 'Cancelar',
  destructive: 'Excluir produto',
  link: 'Ver todos os pedidos',
};

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Comprar agora',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS, description: 'Estilo visual' },
    size: { control: 'select', options: [...SIZES, 'icon'], description: 'Tamanho' },
    disabled: { control: 'boolean', description: 'Desativa o botão e tira do foco' },
    loading: {
      control: 'boolean',
      description: 'Mostra o indicador de carregamento e bloqueia o clique, sem perder o foco',
    },
    asChild: { table: { disable: true } },
    children: { control: 'text', description: 'Texto do botão: comece com um verbo' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: VARIANT_LABELS.secondary },
};

export const Outline: Story = { args: { variant: 'outline', children: VARIANT_LABELS.outline } };

export const Ghost: Story = { args: { variant: 'ghost', children: VARIANT_LABELS.ghost } };

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <Trash aria-hidden="true" />
        {VARIANT_LABELS.destructive}
      </>
    ),
  },
};

export const Link: Story = { args: { variant: 'link', children: VARIANT_LABELS.link } };

export const WithIcon: Story = {
  args: {
    children: (
      <>
        Cadastrar meu primeiro produto
        <ArrowRight aria-hidden="true" />
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: { size: 'icon', 'aria-label': 'Adicionar produto', children: <Plus aria-hidden="true" /> },
};

export const Disabled: Story = { args: { disabled: true, children: 'Publicar loja' } };

export const Loading: Story = { args: { loading: true, children: 'Salvando produto' } };

export const AsLink: Story = {
  args: { variant: 'outline' },
  render: (args) => (
    <Button {...args} asChild>
      <a href="#pedidos">Ver meus pedidos</a>
    </Button>
  ),
};

export const LongLabel: Story = {
  args: {
    variant: 'outline',
    children: 'Doceria e Confeitaria Artesanal da Vó Maria — Unidade Centro',
  },
  parameters: {
    viewport: {
      options: { phone360: { name: '360 px', styles: { width: '360px', height: '800px' } } },
    },
  },
  globals: { viewport: { value: 'phone360', isRotated: false } },
};

export const LongWord: Story = {
  ...LongLabel,
  args: { ...LongLabel.args, children: 'MinhaLojaDeRoupasFemininasEAcessoriosDaVilaMariana' },
};

export const LinkInText: Story = {
  args: { variant: 'link', size: 'sm', children: VARIANT_LABELS.link },
  render: (args) => (
    <div className="flex flex-col items-start gap-1">
      <Text>Você ainda não recebeu pedidos hoje.</Text>
      <Button {...args} />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          {SIZES.map((size) => (
            <Button key={size} variant={variant} size={size}>
              {VARIANT_LABELS[variant]}
            </Button>
          ))}
          <Button variant={variant} size="icon" aria-label={`Adicionar (${variant})`}>
            <Plus aria-hidden="true" />
          </Button>
          <Button variant={variant} disabled>
            Indisponível
          </Button>
          <Button variant={variant} loading>
            Salvando
          </Button>
        </div>
      ))}
    </div>
  ),
};
