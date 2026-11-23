import type { Meta, StoryObj } from '@storybook/react-vite';
import { spacing } from '@purplerbr/tokens';
import { DataTable, FoundationPage, Section, cell } from './FoundationPage';

const STEPS = Object.entries(spacing.scale).sort(([a], [b]) => Number(a) - Number(b));

const toPx = (rem: string): number => Number.parseFloat(rem) * 16 || 0;

function SpacingPage() {
  return (
    <FoundationPage
      title="Espaçamento"
      lead="Grade de 4 px. A unidade é a mesma do Tailwind, então p-4 é 1rem (16 px) e gap-6 é 1,5rem (24 px)."
    >
      <Section title="Escala">
        <DataTable head={['Passo', 'Valor', 'Pixels', 'Tamanho']}>
          {STEPS.map(([step, value]) => (
            <tr key={step}>
              <td className={`${cell} font-mono`}>{step}</td>
              <td className={`${cell} font-mono`}>{value}</td>
              <td className={`${cell} tabular-nums`}>{toPx(value)} px</td>
              <td className={cell}>
                <span
                  aria-hidden="true"
                  className="block h-4 rounded-xs bg-primary"
                  style={{ width: value }}
                />
              </td>
            </tr>
          ))}
        </DataTable>
      </Section>

      <Section title="Layout">
        <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5">
          <li>Mobile-first: toda tela é validada em 360, 768 e 1280 px.</li>
          <li>Margem lateral de 16 px no celular e de 24 a 32 px a partir de 768 px.</li>
          <li>Espaço entre seções de 48 px ou mais; dentro de um card, 12 a 16 px.</li>
          <li>
            Alvo de toque com no mínimo 24 × 24 px, e 44 × 44 px no celular sempre que possível.
          </li>
        </ul>
      </Section>
    </FoundationPage>
  );
}

const meta = {
  title: 'Fundamentos/Espaçamento',
  id: 'fundamentos-espacamento',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;

export const Espacamento: StoryObj = { name: 'Espaçamento', render: () => <SpacingPage /> };
