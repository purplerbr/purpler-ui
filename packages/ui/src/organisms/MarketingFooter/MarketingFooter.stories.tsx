import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarketingFooter } from './MarketingFooter';

const LINKS = [
  { href: '#planos', label: 'Planos' },
  { href: '#termos', label: 'Termos de uso' },
  { href: '#privacidade', label: 'Política de privacidade' },
] as const;

const meta = {
  title: 'Organisms/MarketingFooter',
  component: MarketingFooter,
  tags: ['autodocs'],
  args: {
    homeHref: '#',
    links: LINKS,
    tagline: 'O balcão digital de quem empreende: sua loja, sua marca, seu dinheiro.',
    contact: { label: 'Fale com a gente:', email: 'contato@purpler.com.br' },
    note: '© 2026 Purpler. Todos os direitos reservados.',
  },
  argTypes: {
    homeHref: { control: 'text', description: 'Destino do logo' },
    links: { control: 'object', description: 'Links legais e secundários' },
    tagline: { control: 'text', description: 'Frase curta embaixo do logo' },
    contact: { control: 'object', description: 'Rótulo e e-mail de contato (vira `mailto:`)' },
    note: { control: 'text', description: 'Última linha, como o copyright' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Rodapé do site da Purpler, com a marca Purpler: logo, links legais e o e-mail de contato, que também recebe os pedidos sobre dados pessoais. Tudo vem por props e funciona sem JavaScript.',
      },
    },
  },
} satisfies Meta<typeof MarketingFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Minimal: Story = {
  render: ({ homeHref, links }) => <MarketingFooter homeHref={homeHref} links={links} />,
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="grid gap-8">
      <MarketingFooter {...args} />
      <MarketingFooter
        homeHref="#"
        navLabel="Rodapé resumido"
        links={LINKS.map((link) => ({ ...link, current: link.label === 'Termos de uso' }))}
      />
    </div>
  ),
};
