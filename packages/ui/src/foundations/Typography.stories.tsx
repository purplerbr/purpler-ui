import type { Meta, StoryObj } from '@storybook/react-vite';
import { typography, type TextStyleName } from '@purplerbr/tokens';
import { Card, DataTable, FoundationPage, Section, cell } from './FoundationPage';

// Literal class names, so Tailwind finds them when it scans this file.
const SAMPLE_CLASS: Record<TextStyleName, string> = {
  display: 'font-display text-display',
  'title-1': 'font-display text-title-1',
  'title-2': 'font-display text-title-2',
  'title-3': 'font-display text-title-3',
  'body-lg': 'text-body-lg',
  body: 'text-body',
  small: 'text-small',
  caption: 'text-caption uppercase',
};

const STYLE_LABELS: Record<TextStyleName, string> = {
  display: 'Display',
  'title-1': 'Título 1',
  'title-2': 'Título 2',
  'title-3': 'Título 3',
  'body-lg': 'Texto grande',
  body: 'Texto',
  small: 'Pequeno',
  caption: 'Legenda',
};

const SCALE = Object.entries(typography.scale).filter(
  (entry): entry is [TextStyleName, (typeof entry)[1]] => Object.hasOwn(SAMPLE_CLASS, entry[0])
);

const toPx = (rem: string): string => `${String(Number.parseFloat(rem) * 16)} px`;

function TypographyPage() {
  return (
    <FoundationPage
      title="Tipografia"
      lead="Duas famílias auto-hospedadas: Bricolage Grotesque nos títulos e números de destaque, Figtree em todo o resto."
    >
      <Section title="Famílias">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="font-display text-title-2">Bricolage Grotesque</p>
            <p className="text-muted-foreground">
              Títulos a partir de 22 px e números de destaque. Pesos 600, 700 e 800.
            </p>
            <p className="font-display text-title-3 font-semibold">Semibold 600 · Aa Bb Çç 0123</p>
            <p className="font-display text-title-3 font-bold">Bold 700 · Aa Bb Çç 0123</p>
            <p className="font-display text-title-3 font-extrabold">
              ExtraBold 800 · Aa Bb Çç 0123
            </p>
          </Card>
          <Card>
            <p className="text-title-2 font-semibold">Figtree</p>
            <p className="text-muted-foreground">
              Texto corrido, interface e formulários. Pesos 400, 500, 600 e 700.
            </p>
            <p className="font-normal">
              Regular 400 · Sua vitrine ganha vida com o primeiro produto.
            </p>
            <p className="font-medium">
              Medium 500 · Sua vitrine ganha vida com o primeiro produto.
            </p>
            <p className="font-semibold">Semibold 600 · Botões e rótulos.</p>
            <p className="font-bold">Bold 700 · Ênfase pontual.</p>
          </Card>
        </div>
      </Section>

      <Section
        title="Escala"
        description="Use os utilitários text-display, text-title-1 … text-caption. Cada um já traz tamanho, altura de linha, espaçamento e peso."
      >
        <DataTable
          label="Escala tipográfica"
          head={['Nível', 'Família e peso', 'Tamanho / linha', 'Exemplo']}
        >
          {SCALE.map(([name, style]) => (
            <tr key={name}>
              <td className={`${cell} font-semibold`}>{STYLE_LABELS[name]}</td>
              <td className={cell}>
                {style.family === 'heading' ? 'Bricolage' : 'Figtree'} {style.weight}
              </td>
              <td className={`${cell} tabular-nums`}>
                {toPx(style.size)} / {toPx(style.lineHeight)}
              </td>
              <td className={cell}>
                <p className={SAMPLE_CLASS[name]}>Sua primeira venda</p>
              </td>
            </tr>
          ))}
        </DataTable>
      </Section>

      <Section
        title="Números de destaque"
        description="Preço e total do dia em Bricolage, com algarismos tabulares e formato brasileiro."
      >
        <Card>
          <p className="text-small text-muted-foreground">Vendas de hoje</p>
          <p className="font-display text-title-1 tabular-nums">R$ 1.248,90</p>
          <p className="text-small text-muted-foreground">23/11/2026 · 12 pedidos</p>
        </Card>
      </Section>

      <Section title="Regras">
        <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5">
          <li>
            Bricolage só de 22 px para cima e em números de destaque; nunca em parágrafos, botões ou
            campos.
          </li>
          <li>Texto corrido com no mínimo 16 px e linhas de até cerca de 65 caracteres.</li>
          <li>Botões em Figtree 600.</li>
          <li>Números em coluna com tabular-nums.</li>
          <li>As fontes vêm de @purplerbr/tokens/fonts.css, sem Google Fonts em produção.</li>
        </ul>
      </Section>
    </FoundationPage>
  );
}

const meta = {
  title: 'Fundamentos/Tipografia',
  id: 'fundamentos-tipografia',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;

export const Tipografia: StoryObj = { render: () => <TypographyPage /> };
