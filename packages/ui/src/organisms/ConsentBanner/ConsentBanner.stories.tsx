import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
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
  decorators: [
    // translate-x-0 makes this box the containing block, so the fixed banner stays inside its story.
    (Story) => (
      <div className="min-h-96 translate-x-0">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConsentBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Reopened: Story = { args: { focusOnMount: true } };
