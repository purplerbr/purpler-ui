import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/Button/Button';
import { toast } from './index';
import { Toaster } from './Toaster';

const SAMPLES = [
  { label: 'Neutro', show: () => toast('Rascunho salvo') },
  {
    label: 'Sucesso',
    show: () => toast.success('Loja criada', { description: 'Ela já aparece no seu painel.' }),
  },
  { label: 'Informação', show: () => toast.info('Seu domínio está em verificação') },
  { label: 'Aviso', show: () => toast.warning('Faltam 2 produtos para o limite do plano') },
  {
    label: 'Erro',
    show: () =>
      toast.error('Não foi possível salvar', {
        description: 'Confira sua conexão e tente de novo.',
      }),
  },
  {
    label: 'Com ação',
    show: () =>
      toast('Produto arquivado', {
        action: { label: 'Desfazer', onClick: () => toast.success('Produto restaurado') },
      }),
  },
];

const meta = {
  title: 'Molecules/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  args: { position: 'bottom-right', closeButton: false, expand: false },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
    closeButton: { control: 'boolean', description: 'Mostra o botão “Fechar notificação”' },
    expand: { control: 'boolean', description: 'Mostra as notificações empilhadas abertas' },
  },
  render: (args) => (
    <>
      <Button onClick={() => toast.success('Loja criada')}>Criar loja</Button>
      <Toaster {...args} />
    </>
  ),
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Toasts stay until closed here, so they can be inspected and checked with axe.
export const AllVariants: Story = {
  args: { expand: true, closeButton: true, duration: Number.POSITIVE_INFINITY },
  render: (args) => (
    <>
      <div className="flex flex-wrap gap-3">
        {SAMPLES.map(({ label, show }) => (
          <Button key={label} variant="outline" onClick={show}>
            {label}
          </Button>
        ))}
        <Button variant="ghost" onClick={() => toast.dismiss()}>
          Fechar todas
        </Button>
      </div>
      <Toaster {...args} />
    </>
  ),
};
