import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/Button/Button';
import { Heading } from '../../atoms/Heading/Heading';
import { Text } from '../../atoms/Text/Text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../molecules/Accordion/Accordion';
import { Card, CardDescription, CardHeader, CardTitle } from '../../molecules/Card/Card';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { MarketingFooter } from '../../organisms/MarketingFooter/MarketingFooter';
import { MarketingHeader } from '../../organisms/MarketingHeader/MarketingHeader';
import { PricingCard } from '../../organisms/PricingCard/PricingCard';
import { MarketingLayout } from './MarketingLayout';

const header = (
  <MarketingHeader
    homeHref="#"
    links={[
      { href: '#recursos', label: 'Recursos' },
      { href: '#planos', label: 'Planos' },
      { href: '#duvidas', label: 'Dúvidas' },
    ]}
    cta={{ href: '#construindo', label: 'Começar grátis' }}
  />
);

const footer = (
  <MarketingFooter
    homeHref="#"
    links={[
      { href: '#termos', label: 'Termos de uso' },
      { href: '#privacidade', label: 'Política de privacidade' },
    ]}
    contact={{ label: 'Fale com a gente:', email: 'contato@purpler.com.br' }}
    note="© 2026 Purpler"
  />
);

const FEATURES = [
  ['Sua loja, seu domínio', 'A loja abre no endereço da sua marca, com SEO desde o primeiro dia.'],
  [
    'Seu dinheiro na sua conta',
    'Conecte Mercado Pago, PayPal ou Pagar.me; cada venda cai direto para você.',
  ],
  ['Frete sem planilha', 'O Melhor Envio calcula o frete e gera a etiqueta.'],
] as const;

function Home() {
  return (
    <div className="mx-auto grid max-w-6xl gap-16 px-4 py-12 md:px-6 md:py-20">
      <section aria-labelledby="hero" className="grid max-w-3xl gap-6">
        <Heading id="hero" level={1} size="display">
          Sua loja online com a sua marca
        </Heading>
        <Text size="body-lg" tone="muted">
          Venda produtos físicos, digitais e cursos com o seu domínio e as suas contas de pagamento.
        </Text>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="#construindo">Criar minha loja grátis</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#planos">Ver os planos</a>
          </Button>
        </div>
      </section>
      <section id="recursos" aria-labelledby="recursos-titulo" className="grid gap-6">
        <Heading id="recursos-titulo">Tudo para vender sem complicação</Heading>
        <ul className="grid gap-6 md:grid-cols-3">
          {FEATURES.map(([title, text]) => (
            <li key={title}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </section>
      <section id="planos" aria-labelledby="planos-titulo" className="grid gap-6">
        <Heading id="planos-titulo">Comece grátis e cresça quando quiser</Heading>
        <div className="max-w-sm">
          <PricingCard
            name="Básico"
            price="Grátis"
            features={['Até 30 produtos', 'Produtos físicos', '100 interações com IA por mês']}
            cta={{ href: '#construindo', label: 'Começar grátis' }}
          />
        </div>
      </section>
      <section id="duvidas" aria-labelledby="duvidas-titulo" className="grid max-w-2xl gap-6">
        <Heading id="duvidas-titulo">Dúvidas frequentes</Heading>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>O dinheiro das vendas cai na minha conta?</AccordionTrigger>
            <AccordionContent>Cai, sim. A Purpler cobra só a assinatura do plano.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}

const meta = {
  title: 'Templates/MarketingLayout',
  component: MarketingLayout,
  tags: ['autodocs'],
  args: { header, footer, children: <Home /> },
  argTypes: {
    header: { control: false, description: 'Em geral um `MarketingHeader`' },
    footer: { control: false, description: 'Em geral um `MarketingFooter`' },
    children: { control: false, description: 'Conteúdo da página, com o `h1`' },
    contentId: { control: 'text', description: '`id` do `main`, destino do link de pular' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Esqueleto das páginas do site da Purpler: cabeçalho, `main` e rodapé. O `main` recebe o `id="conteudo"`, destino do link “Pular para o conteúdo” do `MarketingHeader`, e aceita foco por script. Use no lugar do `AuthLayout` em toda página pública que não é de login.',
      },
    },
  },
} satisfies Meta<typeof MarketingLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NotFound: Story = {
  args: {
    children: (
      <EmptyState
        titleLevel={1}
        title="Não achamos esta página"
        description="O endereço pode ter mudado ou ter sido digitado com algum erro."
        action={
          <Button asChild>
            <a href="#inicio">Voltar para o início</a>
          </Button>
        }
      />
    ),
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <MarketingLayout header={header} footer={footer}>
      <Home />
    </MarketingLayout>
  ),
};
