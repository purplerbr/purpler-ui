import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Barcode,
  Bell,
  ChartColumn,
  Check,
  ChevronRight,
  CircleCheck,
  CircleX,
  CreditCard,
  Download,
  Gift,
  Heart,
  Image,
  Info,
  LogOut,
  Mail,
  Menu,
  Package,
  Pencil,
  Percent,
  Plus,
  QrCode,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Tag,
  Trash,
  TriangleExclamationPoint,
  Truck,
  Upload,
  User,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { FoundationPage, Section } from './FoundationPage';

const ICONS: readonly { Icon: LucideIcon; name: string; use: string }[] = [
  { Icon: Store, name: 'Store', use: 'Loja' },
  { Icon: ShoppingBag, name: 'ShoppingBag', use: 'Produto' },
  { Icon: ShoppingCart, name: 'ShoppingCart', use: 'Carrinho' },
  { Icon: Package, name: 'Package', use: 'Pedido' },
  { Icon: Truck, name: 'Truck', use: 'Frete' },
  { Icon: CreditCard, name: 'CreditCard', use: 'Cartão' },
  { Icon: QrCode, name: 'QrCode', use: 'Pix' },
  { Icon: Barcode, name: 'Barcode', use: 'Boleto' },
  { Icon: Tag, name: 'Tag', use: 'Preço' },
  { Icon: Percent, name: 'Percent', use: 'Desconto' },
  { Icon: Gift, name: 'Gift', use: 'Presente' },
  { Icon: Star, name: 'Star', use: 'Avaliação' },
  { Icon: Heart, name: 'Heart', use: 'Favoritos' },
  { Icon: Search, name: 'Search', use: 'Busca' },
  { Icon: User, name: 'User', use: 'Conta' },
  { Icon: Bell, name: 'Bell', use: 'Avisos' },
  { Icon: Mail, name: 'Mail', use: 'E-mail' },
  { Icon: ChartColumn, name: 'ChartColumn', use: 'Relatórios' },
  { Icon: Sparkles, name: 'Sparkles', use: 'Recurso de IA' },
  { Icon: Image, name: 'Image', use: 'Imagem' },
  { Icon: Video, name: 'Video', use: 'Vídeo' },
  { Icon: Upload, name: 'Upload', use: 'Enviar arquivo' },
  { Icon: Download, name: 'Download', use: 'Baixar' },
  { Icon: Plus, name: 'Plus', use: 'Adicionar' },
  { Icon: Pencil, name: 'Pencil', use: 'Editar' },
  { Icon: Trash, name: 'Trash', use: 'Excluir' },
  { Icon: Check, name: 'Check', use: 'Confirmar' },
  { Icon: X, name: 'X', use: 'Fechar' },
  { Icon: CircleCheck, name: 'CircleCheck', use: 'Sucesso' },
  { Icon: TriangleExclamationPoint, name: 'TriangleExclamationPoint', use: 'Atenção' },
  { Icon: CircleX, name: 'CircleX', use: 'Erro' },
  { Icon: Info, name: 'Info', use: 'Informação' },
  { Icon: Menu, name: 'Menu', use: 'Menu' },
  { Icon: ChevronRight, name: 'ChevronRight', use: 'Avançar' },
  { Icon: Settings, name: 'Settings', use: 'Configurações' },
  { Icon: LogOut, name: 'LogOut', use: 'Sair' },
];

const ICON_SIZES = [
  { className: 'size-4', px: 16 },
  { className: 'size-5', px: 20 },
  { className: 'size-6', px: 24 },
] as const;

function IconsPage() {
  return (
    <FoundationPage
      title="Ícones"
      lead="Lucide, o conjunto padrão do shadcn/ui: traço de 2 px, cantos arredondados e a cor do texto ao redor."
    >
      <Section
        title="Ícones mais usados"
        description="Importe de lucide-react pelo nome. Esta lista não é exaustiva."
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {ICONS.map(({ Icon, name, use }) => (
            <li
              key={name}
              className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
            >
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              <span className="flex min-w-0 flex-col text-small">
                <span className="font-semibold">{use}</span>
                <span className="truncate font-mono text-muted-foreground">{name}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tamanhos">
        <div className="flex flex-wrap items-end gap-6">
          {ICON_SIZES.map(({ className, px }) => (
            <span key={px} className="flex flex-col items-center gap-2 text-small">
              <ShoppingCart aria-hidden="true" className={className} />
              {px} px
            </span>
          ))}
        </div>
      </Section>

      <Section title="Acessibilidade">
        <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5">
          <li>Ícone ao lado de texto é decorativo: use aria-hidden="true".</li>
          <li>Botão só com ícone precisa de aria-label com a ação, como “Adicionar produto”.</li>
          <li>Estado nunca é indicado só pela cor ou só pelo ícone: sempre há texto.</li>
        </ul>
        <div className="flex flex-wrap gap-3">
          <Button>
            <Plus aria-hidden="true" />
            Cadastrar produto
          </Button>
          <Button variant="outline" size="icon" aria-label="Buscar produtos">
            <Search aria-hidden="true" />
          </Button>
        </div>
      </Section>
    </FoundationPage>
  );
}

const meta = {
  title: 'Fundamentos/Ícones',
  id: 'fundamentos-icones',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;

export const Icones: StoryObj = { name: 'Ícones', render: () => <IconsPage /> };
