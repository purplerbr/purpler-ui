import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChartColumn,
  CreditCard,
  FolderTree,
  House,
  LogOut,
  Package,
  ReceiptText,
  Settings,
} from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { Heading } from '../../atoms/Heading/Heading';
import { Text } from '../../atoms/Text/Text';
import { Card, CardDescription, CardHeader, CardTitle } from '../../molecules/Card/Card';
import { DashboardLayout, type DashboardNavGroup } from './DashboardLayout';

const NAV: readonly DashboardNavGroup[] = [
  { items: [{ href: '#inicio', label: 'Início', icon: House }] },
  {
    label: 'Vendas',
    items: [{ href: '#pedidos', label: 'Pedidos', icon: ReceiptText }],
  },
  {
    label: 'Catálogo',
    items: [
      { href: '#produtos', label: 'Produtos', icon: Package, current: true },
      { href: '#categorias', label: 'Categorias', icon: FolderTree },
    ],
  },
  {
    label: 'Loja',
    items: [
      { href: '#plano', label: 'Plano e uso', icon: ChartColumn },
      { href: '#pagamentos', label: 'Pagamentos', icon: CreditCard },
      { href: '#configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
];

const STORE_NAME = 'Doceria e Confeitaria da Ana';
const LONG_STORE_NAME = 'Doceria, Confeitaria e Padaria Artesanal da Ana Beatriz de Albuquerque';

const storeArea = (name: string) => (
  <div className="grid gap-1">
    <Text as="span" size="small">
      Loja atual
    </Text>
    <Text as="span" className="font-semibold break-words">
      {name}
    </Text>
    <Button asChild variant="link" size="lg" className="justify-start">
      <a href="#lojas">Trocar de loja</a>
    </Button>
  </div>
);

// The app passes the short name; the hidden prefix tells screen readers what the name is.
const storeLabel = (name: string) => (
  <>
    <span className="sr-only">Loja atual: </span>
    {name}
  </>
);

const account = (
  <div className="grid gap-1">
    <Text as="span" size="small" className="break-words">
      ana@doceria.example
    </Text>
    <Button variant="link" size="lg" className="justify-start">
      <LogOut aria-hidden="true" />
      Sair
    </Button>
  </div>
);

function Products() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 md:px-8">
      <div className="grid gap-2">
        <Heading level={1}>Produtos</Heading>
        <Text tone="muted">Cadastre, edite e organize o que a sua loja vende.</Text>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {['Bolo de cenoura', 'Brigadeiro gourmet', 'Torta de limão', 'Pão de mel'].map((name) => (
          <li key={name}>
            <Card>
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>Produto físico · ativo</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

const meta = {
  title: 'Templates/DashboardLayout',
  component: DashboardLayout,
  tags: ['autodocs'],
  args: {
    homeHref: '#inicio',
    nav: NAV,
    store: storeArea(STORE_NAME),
    storeLabel: storeLabel(STORE_NAME),
    account,
    children: <Products />,
  },
  argTypes: {
    homeHref: { control: 'text', description: 'Destino do logo, em geral o início da loja atual' },
    nav: {
      control: 'object',
      description:
        'Grupos da navegação; cada item tem `href`, `label`, `icon` (lucide) e `current`',
    },
    store: {
      control: false,
      description: 'Área “loja atual”: nome da loja e o link “Trocar de loja”, montados pelo app',
    },
    storeLabel: {
      control: false,
      description:
        'Nome da loja na barra do topo abaixo de `lg`, numa linha só com reticências. O texto inteiro fica no DOM para o leitor de tela; o app pode prefixar “Loja atual:” em `sr-only`',
    },
    storeLoading: {
      control: 'boolean',
      description: 'Mostra o esqueleto no lugar da loja e do nome na barra do topo',
    },
    account: { control: false, description: 'Rodapé da barra: conta e o botão “Sair”' },
    renderLink: {
      control: false,
      description:
        'Renderiza cada link. `kind` é `home` no logo (use `Link`, que nunca fica ativo) e `nav` nos itens (use `NavLink` com o `end` recebido)',
    },
    children: { control: false, description: 'Conteúdo da página, com o `h1`' },
    contentId: { control: 'text', description: '`id` do `main`, destino do link de pular' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Casco do painel do lojista, sempre com a marca Purpler. A partir de `lg`, a barra lateral fica fixa com o logo, a loja atual, a navegação e a conta. Abaixo disso, a barra do topo mostra o logo e o nome da loja atual (`storeLabel`, cortado com reticências), e um botão abre o mesmo conteúdo num `Sheet` (foco preso, `Esc` fecha e o foco volta ao botão; seguir um link fecha o menu). O primeiro Tab mostra “Pular para o conteúdo”. A lib não conhece lojas nem rotas: o app passa a área da loja, a navegação e um `renderLink` com o `NavLink` do roteador, que marca a página atual com `aria-current="page"`. Com o menu aberto abaixo de `lg`, `store` e `account` montam duas vezes: nada de `id` fixo nem de efeito que não possa rodar duas vezes. O logo chega com `kind` igual a `home` e deve usar `Link`; o item da página inicial da loja leva `end: true`, para não ficar ativo em todas as rotas. Se a janela chega a `lg` com o menu aberto, ele fecha e o foco vai para o logo.',
      },
    },
  },
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StoreLoading: Story = { args: { storeLoading: true } };

export const LongStoreName: Story = {
  args: { store: storeArea(LONG_STORE_NAME), storeLabel: storeLabel(LONG_STORE_NAME) },
};

// One layout per page: two would repeat the banner and main landmarks; the other stories cover the rest.
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <DashboardLayout
      homeHref="#inicio"
      nav={NAV}
      store={storeArea(LONG_STORE_NAME)}
      storeLabel={storeLabel(LONG_STORE_NAME)}
      account={account}
    >
      <Products />
    </DashboardLayout>
  ),
};
