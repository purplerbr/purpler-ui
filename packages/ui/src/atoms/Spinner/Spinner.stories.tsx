import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const SIZES = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: { label: 'Carregando…', showLabel: false },
  argTypes: {
    size: { control: 'select', options: SIZES, description: 'Tamanho do anel' },
    label: {
      control: 'text',
      description: 'Texto do `role="status"`; diga o que está carregando quando der',
    },
    showLabel: {
      control: 'boolean',
      description:
        'Mostra o texto ao lado do anel. Com movimento reduzido, o anel para e o texto aparece sempre',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { showLabel: true, label: 'Carregando pedidos…' },
};

export const Small: Story = { args: { size: 'sm' } };

export const Large: Story = { args: { size: 'lg' } };

/** Route fallback for `<Suspense>`: a centered spinner with a visible label, nothing else. */
export const PageLoading: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Use como `fallback` do `<Suspense>` das rotas: `<div className="grid min-h-dvh place-items-center"><Spinner size="lg" showLabel label="Carregando o painel…" /></div>`. O app só posiciona; o visual vem da lib.',
      },
    },
  },
  render: () => (
    <div className="grid min-h-dvh place-items-center">
      <Spinner size="lg" showLabel label="Carregando o painel…" />
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-8">
          <Spinner size={size} label={`Carregando (${size})…`} />
          <Spinner size={size} showLabel label={`Carregando (${size})…`} />
        </div>
      ))}
    </div>
  ),
};
