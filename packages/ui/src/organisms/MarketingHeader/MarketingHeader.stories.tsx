import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from '../../atoms/Heading/Heading';
import { Text } from '../../atoms/Text/Text';
import { MarketingHeader, type MarketingHeaderProps, type MarketingLink } from './MarketingHeader';

const LINKS: readonly MarketingLink[] = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#planos', label: 'Planos' },
  { href: '#duvidas', label: 'Dúvidas' },
];

function Page(props: MarketingHeaderProps) {
  return (
    <>
      <MarketingHeader {...props} />
      <main
        id="conteudo"
        tabIndex={-1}
        className="mx-auto grid max-w-6xl gap-4 px-4 py-12 outline-none md:px-6"
      >
        <Heading level={1} size="display">
          Sua loja online com a sua marca
        </Heading>
        <Text size="body-lg" tone="muted">
          Venda produtos físicos, digitais e cursos com o seu domínio e as suas contas de pagamento.
        </Text>
      </main>
    </>
  );
}

const meta = {
  title: 'Organisms/MarketingHeader',
  component: MarketingHeader,
  tags: ['autodocs'],
  args: {
    homeHref: '#',
    links: LINKS,
    cta: { href: '#construindo', label: 'Começar grátis' },
  },
  argTypes: {
    homeHref: { control: 'text', description: 'Destino do logo, em geral a página inicial' },
    links: {
      control: 'object',
      description: 'Links da navegação; `current` marca a página aberta',
    },
    cta: { control: 'object', description: 'Chamada principal, sempre visível' },
    contentId: {
      control: 'text',
      description: '`id` do conteúdo principal, destino do link de pular',
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Cabeçalho do site da Purpler, sempre com a marca Purpler. O primeiro Tab mostra o link “Pular para o conteúdo”, que leva ao `#conteudo` (o `MarketingLayout` já cria o `main` com esse `id`). Em telas largas, os links ficam na barra. No celular, um botão abre os mesmos links num `Sheet`. Sem JavaScript, o botão some e os links aparecem embaixo da barra, então a página pré-renderizada continua navegável. Rotas e textos vêm todos por props.',
      },
    },
  },
  render: (args) => <Page {...args} />,
} satisfies Meta<typeof MarketingHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CurrentPage: Story = {
  args: {
    links: LINKS.map((link) => ({ ...link, current: link.label === 'Planos' })),
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="grid gap-8">
      <MarketingHeader {...args} />
      <MarketingHeader
        {...args}
        links={LINKS.map((link) => ({ ...link, current: link.label === 'Recursos' }))}
        cta={{ href: '#construindo', label: 'Criar minha loja grátis' }}
      />
      <main id="conteudo" tabIndex={-1} className="px-4 outline-none">
        <Text tone="muted">Conteúdo da página.</Text>
      </main>
    </div>
  ),
};
