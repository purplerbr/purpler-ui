import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/Button/Button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
} from './Sheet';

const SIDES = ['right', 'left', 'top', 'bottom'] as const;

function Example({
  side,
  defaultOpen = false,
}: Pick<SheetContentProps, 'side'> & { defaultOpen?: boolean }) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Ver resumo do pedido</Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Resumo do pedido</SheetTitle>
          <SheetDescription>Confira os itens antes de seguir para o pagamento.</SheetDescription>
        </SheetHeader>
        <p className="px-4 text-body">2 itens · frete calculado no próximo passo.</p>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Continuar comprando</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: 'Molecules/Sheet',
  component: SheetContent,
  tags: ['autodocs'],
  args: { side: 'right', closeLabel: 'Fechar' },
  argTypes: {
    side: { control: 'select', options: SIDES, description: 'Borda da tela de onde o painel sai' },
    closeLabel: { control: 'text', description: 'Nome do botão de fechar para o leitor de tela' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Painel lateral sobre o Dialog do Radix: prende o foco dentro dele, fecha com Esc ou no botão de fechar e devolve o foco a quem o abriu. Todo painel precisa de `SheetTitle`; sem descrição, passe `aria-describedby={undefined}` ao `SheetContent`. Ele depende de JavaScript: numa página pré-renderizada, deixe um caminho que funcione sem ele (veja o `MarketingHeader`).',
      },
    },
  },
  render: ({ side }) => <Example side={side} />,
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = { render: ({ side }) => <Example side={side} defaultOpen /> };

export const Left: Story = { args: { side: 'left' } };

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-3">
      {SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">Abrir painel ({side})</Button>
          </SheetTrigger>
          <SheetContent side={side} aria-describedby={undefined}>
            <SheetHeader>
              <SheetTitle>Painel ({side})</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
