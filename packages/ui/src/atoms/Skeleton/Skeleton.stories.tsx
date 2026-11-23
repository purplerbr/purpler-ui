import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../Text/Text';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { className: 'h-4 w-48' },
  argTypes: {
    className: {
      control: 'text',
      description:
        'Só tamanho e forma (`h-*`, `w-*`, `rounded-full`). O bloco tem `aria-hidden`: quem o envolve anuncia o carregamento',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'O `Skeleton` é decorativo e fica fora do leitor de tela. Envolva os blocos num contêiner com `aria-busy="true"` e um texto em `role="status"` (pode ser `sr-only`) que diga o que está carregando.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Circle: Story = { args: { className: 'size-10 rounded-full' } };

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div aria-busy="true" className="flex max-w-sm flex-col gap-4">
      <Text as="span" role="status" className="sr-only">
        Carregando pedidos…
      </Text>
      {[1, 2, 3].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  ),
};
