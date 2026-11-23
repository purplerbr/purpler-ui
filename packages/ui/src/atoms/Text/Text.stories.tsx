import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const SIZES = ['body-lg', 'body', 'small', 'caption'] as const;
const TONES = ['inherit', 'default', 'muted', 'primary', 'destructive'] as const;

const meta = {
  title: 'Atoms/Text',
  component: Text,
  tags: ['autodocs'],
  args: { children: 'Monte sua loja e venda com a sua marca.' },
  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'span', 'div'],
      description:
        'Elemento: `p` para parágrafo, `span` dentro de uma linha, `div` em volta de blocos',
    },
    size: { control: 'select', options: SIZES, description: 'Estilo de texto da escala da marca' },
    tone: {
      control: 'select',
      options: TONES,
      description: 'Cor semântica; `inherit` usa a cor de quem envolve o texto',
    },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = {
  args: { size: 'small', tone: 'muted', children: 'Ao continuar, você aceita os termos de uso.' },
};

export const Caption: Story = { args: { as: 'span', size: 'caption', children: 'Novidade' } };

export const Destructive: Story = {
  args: { tone: 'destructive', children: 'Não foi possível entrar. Tente de novo.' },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <Text key={size} size={size}>
          {`Tamanho ${size}: seu pedido saiu para entrega.`}
        </Text>
      ))}
      {TONES.map((tone) => (
        <Text key={tone} tone={tone}>
          {`Tom ${tone}: seu pedido saiu para entrega.`}
        </Text>
      ))}
    </div>
  ),
};
