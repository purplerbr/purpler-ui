import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from './Logo';

const SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Atoms/Logo',
  component: Logo,
  tags: ['autodocs'],
  args: { size: 'md' },
  argTypes: {
    size: { control: 'select', options: SIZES, description: 'Altura do logo (24, 32 ou 40 px)' },
    'aria-label': {
      control: 'text',
      description:
        'Nome lido pelo leitor de tela. O padrão é “Purpler”; dentro de um link para a home, o link já leva esse nome',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Logo da Purpler (símbolo + nome) nas superfícies da marca: site, painel e login. Usa os tokens `brand-mark` e `brand-wordmark`, que o tema da loja não altera. Não use na loja, que mostra o logo do lojista.',
      },
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: 'sm' } };

export const Large: Story = { args: { size: 'lg' } };

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      {SIZES.map((size) => (
        <Logo key={size} size={size} />
      ))}
    </div>
  ),
};
