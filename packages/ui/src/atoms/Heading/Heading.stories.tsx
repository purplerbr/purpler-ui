import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';

const SIZES = ['display', 'title-1', 'title-2', 'title-3'] as const;
const LEVELS = [1, 2, 3, 4, 5, 6] as const;

const meta = {
  title: 'Atoms/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: { children: 'Venda com a sua marca', level: 2 },
  argTypes: {
    level: {
      control: 'select',
      options: LEVELS,
      description: 'Nível no sumário da página (`h1`–`h6`); mantenha a ordem sem pular níveis',
    },
    size: {
      control: 'select',
      options: SIZES,
      description: 'Tamanho visual, independente do nível; sem valor, segue o nível',
    },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PageTitle: Story = { args: { level: 1, children: 'Entrar na Purpler' } };

export const Display: Story = {
  args: { level: 1, size: 'display', children: 'Sua loja no ar hoje' },
};

export const SmallSizeHighLevel: Story = {
  args: { level: 1, size: 'title-3', children: 'Meus pedidos' },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <Heading key={size} level={2} size={size}>
          {`Tamanho ${size}`}
        </Heading>
      ))}
      {LEVELS.map((level) => (
        <Heading key={level} level={level}>
          {`Nível ${String(level)} com o tamanho padrão`}
        </Heading>
      ))}
    </div>
  ),
};
