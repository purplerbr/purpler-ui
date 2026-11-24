import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { Heading } from '../Heading/Heading';
import { Text } from '../Text/Text';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../molecules/Sheet/Sheet';
import { MarketingFooter } from '../../organisms/MarketingFooter/MarketingFooter';
import { MarketingHeader } from '../../organisms/MarketingHeader/MarketingHeader';
import { MarketingLayout } from '../../templates/MarketingLayout/MarketingLayout';
import { FloatingContactLink, type FloatingContactLinkProps } from './FloatingContactLink';

const PHONE_360 = {
  viewport: {
    options: { phone360: { name: '360 px', styles: { width: '360px', height: '800px' } } },
  },
};

const meta = {
  title: 'Atoms/FloatingContactLink',
  component: FloatingContactLink,
  tags: ['autodocs'],
  args: {
    href: '#conversar',
    icon: <MessageCircle />,
    label: 'Conversar pelo WhatsApp',
  },
  argTypes: {
    href: {
      control: 'text',
      description: 'Destino do contato, vindo do app (ex.: o link do chat)',
    },
    icon: { control: false, description: 'Ícone decorativo; o nome do link vem de `label`' },
    label: {
      control: 'text',
      description: 'Texto do link: visível a partir de 768 px e nome acessível no celular',
    },
    newTabLabel: { control: 'text', description: 'Aviso lido depois do texto' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Link de contato fixo no canto inferior direito, nas cores da marca. No celular mostra só o ícone, com alvo de 48 px; a partir de 768 px mostra também o texto. Sempre abre em nova aba e avisa isso ao leitor de tela. Fica abaixo do menu e do link de pular, então um `Sheet` aberto o cobre. Funciona sem JavaScript, porque é um link. Destino, ícone e texto vêm todos do app.',
      },
    },
  },
  render: (args) => <Page {...args} />,
} satisfies Meta<typeof FloatingContactLink>;

export default meta;
type Story = StoryObj<typeof meta>;

function Page(props: FloatingContactLinkProps) {
  return (
    <main className="grid gap-4">
      <Heading level={1} size="title-2">
        Fale com a gente
      </Heading>
      <Text tone="muted">O botão de contato fica no canto da tela, em qualquer página.</Text>
      <FloatingContactLink {...props} />
    </main>
  );
}

export const Default: Story = {};

export const OnMarketingPage: Story = {
  parameters: PHONE_360,
  globals: { viewport: { value: 'phone360', isRotated: false } },
  render: (args) => (
    <MarketingLayout
      header={
        <MarketingHeader
          homeHref="#"
          links={[
            { href: '#recursos', label: 'Recursos' },
            { href: '#planos', label: 'Planos' },
          ]}
          cta={{ href: '#construindo', label: 'Começar grátis' }}
        />
      }
      footer={
        <MarketingFooter
          homeHref="#"
          links={[
            { href: '#termos', label: 'Termos de uso' },
            { href: '#privacidade', label: 'Política de privacidade' },
          ]}
          contact={{ label: 'Fale com a gente:', email: 'contato@purpler.com.br' }}
          note="© 2026 Purpler"
        />
      }
    >
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:px-6">
        <Heading level={1} size="display">
          Sua loja online com a sua marca
        </Heading>
        <Text size="body-lg" tone="muted">
          Venda produtos físicos, digitais e cursos com o seu domínio e as suas contas de pagamento.
        </Text>
      </div>
      <FloatingContactLink {...args} />
    </MarketingLayout>
  ),
};

export const WithSheetOpen: Story = {
  render: (args) => (
    <>
      <Page {...args} />
      <Sheet defaultOpen>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Com o painel aberto, o contato fica por baixo dele.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  ),
};

// `static` takes them out of the corner so every combination shows side by side.
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <main className="grid gap-4">
      <Text tone="muted">No celular, só o ícone; a partir de 768 px, o ícone e o texto.</Text>
      <div className="flex flex-wrap items-center gap-4">
        <FloatingContactLink
          className="static"
          href="#conversar"
          icon={<MessageCircle />}
          label="Conversar pelo WhatsApp"
        />
        <FloatingContactLink
          className="static"
          href="#ligar"
          icon={<Phone />}
          label="Ligar para a loja"
        />
        <FloatingContactLink
          className="static"
          href="#escrever"
          icon={<Mail />}
          label="Mandar um e-mail"
        />
      </div>
    </main>
  ),
};
