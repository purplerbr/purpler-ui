import type { Meta, StoryObj } from '@storybook/react-vite';
import { PackageOpen } from 'lucide-react';
import { Button } from '../Button/Button';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { List, ListItem } from './List';

const MARKERS = ['disc', 'none'] as const;
const STEPS = [
  'Cadastre o primeiro produto, com foto e preço.',
  'Conecte o seu meio de pagamento.',
  'Divulgue o endereço da loja para os seus clientes.',
];

const meta = {
  title: 'Atoms/List',
  component: List,
  tags: ['autodocs'],
  args: {
    marker: 'disc',
    children: STEPS.map((step) => <ListItem key={step}>{step}</ListItem>),
  },
  argTypes: {
    marker: {
      control: 'select',
      options: MARKERS,
      description: '`disc` mostra o marcador; `none` tira o marcador e o recuo',
    },
    children: { control: false, description: 'Um `ListItem` por item' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Lista de itens com marcador e recuo da marca. O texto fica alinhado ao início mesmo dentro de um bloco centralizado, como o `EmptyState`, sem classe no app. A lista continua sendo lida como lista pelo leitor de tela, também sem marcador.',
      },
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutMarker: Story = { args: { marker: 'none' } };

export const InsideEmptyState: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <EmptyState
      icon={<PackageOpen />}
      title="Sua vitrine ainda está vazia"
      description="Três passos para receber o primeiro pedido:"
      action={<Button>Cadastrar meu primeiro produto</Button>}
    >
      <List {...args} />
    </EmptyState>
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-8">
      {MARKERS.map((marker) => (
        <List key={marker} marker={marker}>
          {STEPS.map((step) => (
            <ListItem key={step}>{step}</ListItem>
          ))}
        </List>
      ))}
    </div>
  ),
};
