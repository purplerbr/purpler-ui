import type { Meta, StoryObj } from '@storybook/react-vite';
import { motion } from '@purplerbr/tokens';
import { DataTable, FoundationPage, Section, cell } from './FoundationPage';

const DURATIONS: readonly { name: keyof typeof motion.duration; use: string }[] = [
  { name: 'instant', use: 'Retorno de toque e troca de estado' },
  { name: 'fast', use: 'Hover, foco e cores (padrão do transition)' },
  { name: 'base', use: 'Abrir menus, popovers e tooltips' },
  { name: 'slow', use: 'Gavetas, diálogos e mudanças de layout' },
];

const EASINGS: readonly { name: keyof typeof motion.easing; use: string }[] = [
  { name: 'standard', use: 'Movimento dentro da tela (ease-standard)' },
  { name: 'enter', use: 'Algo que entra na tela (ease-enter)' },
  { name: 'exit', use: 'Algo que sai da tela (ease-exit)' },
];

function MotionPage() {
  return (
    <FoundationPage
      title="Movimento"
      lead="Transições curtas e calmas, que explicam o que mudou. Movimento nunca é obrigatório para entender a tela."
    >
      <Section title="Durações">
        <DataTable label="Durações" head={['Token', 'Valor', 'Uso']}>
          {DURATIONS.map(({ name, use }) => (
            <tr key={name}>
              <td className={`${cell} font-mono`}>--duration-{name}</td>
              <td className={`${cell} font-mono`}>{motion.duration[name]}</td>
              <td className={cell}>{use}</td>
            </tr>
          ))}
        </DataTable>
      </Section>

      <Section title="Curvas">
        <DataTable label="Curvas de aceleração" head={['Token', 'Valor', 'Uso']}>
          {EASINGS.map(({ name, use }) => (
            <tr key={name}>
              <td className={`${cell} font-mono`}>--easing-{name}</td>
              <td className={`${cell} font-mono`}>{motion.easing[name]}</td>
              <td className={cell}>{use}</td>
            </tr>
          ))}
        </DataTable>
      </Section>

      <Section title="Movimento reduzido">
        <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5">
          <li>Com prefers-reduced-motion, @purplerbr/ui/styles.css zera animações e transições.</li>
          <li>Indicadores de carregamento param de girar e continuam visíveis.</li>
          <li>Nada pisca mais de três vezes por segundo.</li>
        </ul>
      </Section>
    </FoundationPage>
  );
}

const meta = {
  title: 'Fundamentos/Movimento',
  id: 'fundamentos-movimento',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;

export const Movimento: StoryObj = { render: () => <MotionPage /> };
