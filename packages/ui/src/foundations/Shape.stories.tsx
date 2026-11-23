import type { Meta, StoryObj } from '@storybook/react-vite';
import { radius } from '@purplerbr/tokens';
import { FoundationPage, Section } from './FoundationPage';

// Literal class names, so Tailwind finds them when it scans this file.
const RADII = [
  { className: 'rounded-xs', label: 'rounded-xs', use: 'Detalhes pequenos' },
  { className: 'rounded-sm', label: 'rounded-sm', use: 'Etiquetas e chips' },
  { className: 'rounded-md', label: 'rounded-md', use: 'Campos e menus' },
  { className: 'rounded-lg', label: 'rounded-lg', use: `Cards (base, ${radius.base})` },
  { className: 'rounded-xl', label: 'rounded-xl', use: 'Diálogos e painéis' },
  { className: 'rounded-2xl', label: 'rounded-2xl', use: 'Destaques e banners' },
  { className: 'rounded-button', label: 'rounded-button', use: 'Botões (pílula na marca)' },
  { className: 'rounded-full', label: 'rounded-full', use: 'Avatares e indicadores' },
] as const;

const SHADOWS = [
  { className: 'shadow-xs', label: 'shadow-xs', use: 'Campos e cards em repouso' },
  { className: 'shadow-sm', label: 'shadow-sm', use: 'Cards clicáveis' },
  { className: 'shadow-md', label: 'shadow-md', use: 'Menus e popovers' },
  { className: 'shadow-lg', label: 'shadow-lg', use: 'Gavetas e diálogos' },
  { className: 'shadow-xl', label: 'shadow-xl', use: 'Sobreposições raras' },
] as const;

function ShapePage() {
  return (
    <FoundationPage
      title="Raios e elevação"
      lead="Botões em pílula, raio base de 0,875rem e sombras quentes e curtas, tingidas de ameixa em vez de preto."
    >
      <Section
        title="Raios"
        description="Os passos derivam de --radius, então o tema de loja muda todos os raios de uma vez (de nenhum até pílula)."
      >
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {RADII.map((item) => (
            <li key={item.label} className="flex flex-col gap-2">
              <span
                aria-hidden="true"
                className={`h-16 border border-input bg-secondary ${item.className}`}
              />
              <span className="font-mono text-small font-semibold">{item.label}</span>
              <span className="text-small text-muted-foreground">{item.use}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Elevação"
        description="No escuro, as sombras ficam mais densas para continuar visíveis sobre ameixa."
      >
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {SHADOWS.map((item) => (
            <li key={item.label} className="flex flex-col gap-3">
              <span aria-hidden="true" className={`h-20 rounded-lg bg-card ${item.className}`} />
              <span className="font-mono text-small font-semibold">{item.label}</span>
              <span className="text-small text-muted-foreground">{item.use}</span>
            </li>
          ))}
        </ul>
      </Section>
    </FoundationPage>
  );
}

const meta = {
  title: 'Fundamentos/Raios e elevação',
  id: 'fundamentos-raios-elevacao',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;

export const RaiosElevacao: StoryObj = { name: 'Raios e elevação', render: () => <ShapePage /> };
