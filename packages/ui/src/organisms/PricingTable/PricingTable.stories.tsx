import type { Meta, StoryObj } from '@storybook/react-vite';
import { PricingTable, type PricingTablePlan, type PricingTableRow } from './PricingTable';

// Example copy only: the real comparison comes from the app (CLAUDE.md §1.3), never from the lib.
const PLANS: readonly PricingTablePlan[] = [
  { id: 'basic', name: 'Básico' },
  { id: 'professional', name: 'Profissional' },
  { id: 'enterprise', name: 'Enterprise' },
];

const ROWS: readonly PricingTableRow[] = [
  {
    label: 'Preço por mês',
    values: { basic: 'Grátis', professional: 'R$ 79,99', enterprise: 'R$ 149,99' },
  },
  {
    label: 'Produtos',
    values: { basic: 'Até 30', professional: 'Até 100', enterprise: 'Até 150' },
  },
  {
    label: 'Tipos de produto',
    values: {
      basic: 'Físico',
      professional: 'Físico e digital',
      enterprise: 'Físico, digital e curso',
    },
  },
  {
    label: 'Interações com IA por mês',
    values: { basic: '100', professional: '250', enterprise: '500' },
  },
  {
    label: 'Entrega automática de produtos digitais',
    values: { basic: false, professional: true, enterprise: true },
  },
  {
    label: 'Hospedagem de vídeo integrada',
    values: { basic: false, professional: false, enterprise: true },
  },
  {
    label: 'Marca d’água dinâmica',
    values: { basic: false, professional: false, enterprise: true },
  },
];

const meta = {
  title: 'Organisms/PricingTable',
  component: PricingTable,
  tags: ['autodocs'],
  args: { caption: 'Comparação dos planos da Purpler', plans: PLANS, rows: ROWS },
  argTypes: {
    caption: { control: 'text', description: 'Nome da tabela para o leitor de tela' },
    plans: { control: 'object', description: 'Uma coluna por plano' },
    rows: {
      control: 'object',
      description: 'Uma linha por recurso; valor em texto, `true` (incluído) ou `false`',
    },
    includedLabel: { control: 'text', description: 'Lido no lugar do ícone de incluído' },
    notIncludedLabel: { control: 'text', description: 'Lido no lugar do traço' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Comparação dos planos numa tabela de verdade: cabeçalho por plano, uma linha por recurso. Os valores vêm prontos do app, a partir da fonte única dos planos. `true` vira um ícone de incluído e `false`, um traço, os dois com texto para o leitor de tela. No celular, a tabela rola para o lado e a área de rolagem recebe o foco pelo teclado.',
      },
    },
  },
} satisfies Meta<typeof PricingTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-8">
      <PricingTable caption="Comparação dos planos da Purpler" plans={PLANS} rows={ROWS} />
      <PricingTable caption="Recursos de vídeo" plans={PLANS.slice(1)} rows={ROWS.slice(-2)} />
    </div>
  ),
};
