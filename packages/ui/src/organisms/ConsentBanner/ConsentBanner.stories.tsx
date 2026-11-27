import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MessageCircle } from 'lucide-react';
import { FloatingContactLink } from '../../atoms/FloatingContactLink/FloatingContactLink';
import { Heading } from '../../atoms/Heading/Heading';
import { Text } from '../../atoms/Text/Text';
import { MarketingLayout } from '../../templates/MarketingLayout/MarketingLayout';
import { MarketingFooter } from '../MarketingFooter/MarketingFooter';
import { MarketingHeader } from '../MarketingHeader/MarketingHeader';
import { ConsentBanner } from './ConsentBanner';

const meta = {
  title: 'Organisms/ConsentBanner',
  component: ConsentBanner,
  tags: ['autodocs'],
  args: {
    description:
      'Usamos cookies do Google e da Meta, nos EUA, para medir o uso do site e para anúncios.',
    acceptLabel: 'Ok',
    privacyHref: '#privacidade',
    onAccept: fn(),
    onReject: fn(),
  },
  argTypes: {
    description: {
      control: 'text',
      description: 'O que é medido, por quem e para onde vão os dados',
    },
    privacyHref: { control: 'text', description: 'Destino do link da política de privacidade' },
    focusOnMount: {
      control: 'boolean',
      description: 'Leva o foco ao título ao abrir (reabertura pelo rodapé)',
    },
    title: { control: 'text' },
    privacyLabel: { control: 'text' },
    acceptLabel: { control: 'text' },
    rejectLabel: { control: 'text' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Aviso de cookies com escolha, fixo no rodapé da página e sem bloquear a navegação. Os dois botões ("Aceitar" ou "Ok" e "Recusar") têm o mesmo peso visual. O app decide quando mostrar e o que fazer com a escolha (veja `@purplerbr/analytics`).',
      },
    },
  },
} satisfies Meta<typeof ConsentBanner>;

// translate-x-0 makes this box the containing block, so the fixed banner stays inside its story.
const inBox: Decorator = (Story) => (
  <div className="min-h-96 translate-x-0">
    <Story />
  </div>
);

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { decorators: [inBox] };

export const Reopened: Story = { args: { focusOnMount: true }, decorators: [inBox] };

// Each banner in its own box: translate-x-0 makes the box the containing block of the fixed banner.
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="grid gap-6">
      {[
        { label: 'Rótulos padrão', props: {} },
        { label: 'OK e Recusar', props: { acceptLabel: 'OK' } },
        {
          label: 'Reaberto pelo rodapé (foco no título)',
          props: { acceptLabel: 'OK', focusOnMount: true },
        },
      ].map(({ label, props }) => (
        <section key={label} aria-label={label} className="grid gap-2">
          <Text size="small" tone="muted" className="px-4">
            {label}
          </Text>
          <div className="relative min-h-56 translate-x-0">
            <ConsentBanner {...args} {...props} />
          </div>
        </section>
      ))}
    </div>
  ),
};

// The whole page at 360 px: the open banner pushes the page end and the floating link above itself.
export const OnMarketingPage: Story = {
  args: { acceptLabel: 'OK' },
  render: (args) => (
    <MarketingLayout
      header={
        <>
          <ConsentBanner {...args} />
          <MarketingHeader
            homeHref="#"
            links={[{ href: '#planos', label: 'Planos' }]}
            cta={{ href: '#entrar', label: 'Entrar' }}
          />
        </>
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
          Venda produtos físicos, digitais e cursos com as suas contas de pagamento.
        </Text>
      </div>
      <FloatingContactLink href="#whatsapp" label="WhatsApp" icon={<MessageCircle />} />
    </MarketingLayout>
  ),
};
