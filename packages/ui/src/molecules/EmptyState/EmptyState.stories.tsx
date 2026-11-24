import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hammer, MapPinOff, PackageOpen } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    icon: <PackageOpen />,
    title: 'Sua vitrine ainda está vazia',
    description: 'Cadastre o primeiro produto e ela ganha vida.',
    action: <Button>Cadastrar meu primeiro produto</Button>,
  },
  argTypes: {
    title: { control: 'text', description: 'O que aconteceu, em uma frase' },
    titleLevel: {
      control: 'select',
      options: [1, 2, 3],
      description: '`1` quando o estado vazio é a página inteira, como no 404',
    },
    description: { control: 'text', description: 'Por que está assim e o que fazer' },
    icon: { control: false, description: 'Ícone do lucide, decorativo' },
    action: { control: false, description: 'Próximo passo, em geral um `Button`' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Mostra que não há nada aqui ainda, ou que a página não existe, e leva à próxima ação. O texto segue a voz da marca: diz o que aconteceu e o que fazer, sem “Nenhum registro encontrado”. O ícone é decorativo.',
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NotFound: Story = {
  args: {
    icon: <MapPinOff />,
    titleLevel: 1,
    title: 'Não achamos esta página',
    description: 'O endereço pode ter mudado ou ter sido digitado com algum erro.',
    action: (
      <Button asChild>
        <a href="#inicio">Voltar para o início</a>
      </Button>
    ),
  },
};

export const Building: Story = {
  args: {
    icon: <Hammer />,
    titleLevel: 1,
    title: 'Estamos construindo a Purpler',
    description: 'Falta pouco para você abrir a sua loja. Enquanto isso, conheça os planos.',
    action: (
      <>
        <Button asChild>
          <a href="#planos">Ver os planos</a>
        </Button>
        <Button asChild variant="outline">
          <a href="#inicio">Voltar para o início</a>
        </Button>
      </>
    ),
  },
};

export const WithoutIconOrAction: Story = {
  args: { icon: undefined, action: undefined },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-8">
      <EmptyState
        icon={<PackageOpen />}
        title="Sua vitrine ainda está vazia"
        description="Cadastre o primeiro produto e ela ganha vida."
        action={<Button>Cadastrar meu primeiro produto</Button>}
      />
      <EmptyState
        icon={<MapPinOff />}
        title="Não achamos esta página"
        description="O endereço pode ter mudado ou ter sido digitado com algum erro."
        action={
          <Button asChild variant="outline">
            <a href="#inicio">Voltar para o início</a>
          </Button>
        }
      />
      <EmptyState
        title="Você ainda não recebeu pedidos hoje"
        description="Quando alguém comprar, o pedido aparece aqui."
      />
    </div>
  ),
};
