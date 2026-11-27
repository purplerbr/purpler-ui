import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/Button/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogActionProps,
} from './AlertDialog';

const ACTION_VARIANTS = ['primary', 'destructive'] as const;

const COPY = {
  primary: {
    trigger: 'Trocar de plano',
    title: 'Trocar para o plano Profissional?',
    description: 'A nova cobrança começa no próximo ciclo da assinatura.',
    cancel: 'Voltar',
    action: 'Trocar de plano',
  },
  destructive: {
    trigger: 'Cancelar assinatura',
    title: 'Cancelar a assinatura?',
    description: 'A loja volta ao plano Básico no fim do ciclo atual.',
    cancel: 'Manter assinatura',
    action: 'Cancelar assinatura',
  },
} as const;

function Example({
  variant = 'destructive',
  loading = false,
  defaultOpen = false,
}: Pick<AlertDialogActionProps, 'variant'> & {
  loading?: boolean | undefined;
  defaultOpen?: boolean;
}) {
  const copy = variant === 'primary' ? COPY.primary : COPY.destructive;
  return (
    <AlertDialog defaultOpen={defaultOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{copy.trigger}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>{copy.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{copy.cancel}</AlertDialogCancel>
          <AlertDialogAction variant={variant} loading={loading}>
            {copy.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const meta = {
  title: 'Molecules/AlertDialog',
  component: AlertDialogAction,
  tags: ['autodocs'],
  args: { variant: 'destructive', loading: false },
  argTypes: {
    variant: {
      control: 'select',
      options: ACTION_VARIANTS,
      description: 'Variante do Button na ação; `destructive` quando não dá para desfazer',
    },
    loading: {
      control: 'boolean',
      description:
        'Enquanto a ação roda: mostra o indicador, mantém o foco e não fecha nem dispara',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Confirmação sobre o AlertDialog do Radix: prende o foco, começa no botão de cancelar, fecha com Esc e devolve o foco a quem o abriu. Clicar fora não fecha. Todo diálogo precisa de `AlertDialogTitle` e `AlertDialogDescription`. A ação fecha o diálogo no clique; para esperar uma requisição, chame `event.preventDefault()` no `onClick`, controle o diálogo por `open` e `onOpenChange` e passe `loading` à ação enquanto a requisição roda: o botão mantém o foco, mostra o indicador e ignora novos cliques.',
      },
    },
  },
  render: ({ variant, loading }) => <Example variant={variant} loading={loading} />,
} satisfies Meta<typeof AlertDialogAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  render: ({ variant, loading }) => <Example variant={variant} loading={loading} defaultOpen />,
};

export const Loading: Story = { ...Open, args: { loading: true } };

export const Primary: Story = { args: { variant: 'primary' } };

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-3">
      {ACTION_VARIANTS.map((variant) => (
        <Example key={variant} variant={variant} />
      ))}
    </div>
  ),
};
