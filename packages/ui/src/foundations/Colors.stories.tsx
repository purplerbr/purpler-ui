import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CONTRAST_MINIMUM,
  SCALE_STEPS,
  SEMANTIC_PAIRS,
  SEMANTIC_TOKENS,
  STORE_THEME_PRESETS,
  buildStoreTheme,
  contrastRatio,
  palette,
  pickForeground,
  semantic,
  type ScaleName,
  type SemanticToken,
} from '@purplerbr/tokens';
import { activeTheme, type Scheme } from '../../.storybook/theme';
import { DataTable, FoundationPage, Section, cell } from './FoundationPage';

const SCALE_LABELS: Record<ScaleName, string> = {
  brand: 'Uva (brand)',
  accent: 'Manga (accent)',
  neutral: 'Areia → ameixa (neutral)',
  success: 'Sucesso (success)',
  warning: 'Atenção (warning)',
  danger: 'Perigo (danger)',
  info: 'Informação (info)',
};

const LEVEL_LABELS = {
  text: 'Texto',
  'large-text': 'Texto grande',
  ui: 'Componente de UI',
} as const;
const SCALE_NAMES = Object.keys(SCALE_LABELS).filter((name): name is ScaleName => name in palette);

const formatRatio = (ratio: number): string =>
  `${ratio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}:1`;

type ColorOf = (token: SemanticToken) => string;

function colorsFor(scheme: Scheme, store: string): { colorOf: ColorOf; source: string } {
  const preset = STORE_THEME_PRESETS.find(({ id }) => id === store);
  if (preset !== undefined) {
    const theme = buildStoreTheme(preset.input)[scheme];
    return { colorOf: (token) => theme[token], source: `loja ${preset.name}` };
  }
  return { colorOf: (token) => semantic[scheme][token].oklch, source: 'marca Purpler' };
}

/** Text pairs show text; UI pairs (ring, input, charts) show a 3 px stroke, as they are used. */
function PairSample({
  background,
  foreground,
  text,
}: {
  background: SemanticToken;
  foreground: SemanticToken;
  text: boolean;
}) {
  if (text) {
    return (
      <span
        className="inline-flex rounded-md border border-border px-3 py-1 font-semibold"
        style={{ backgroundColor: `var(--${background})`, color: `var(--${foreground})` }}
      >
        Aa
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-8 w-12 items-center justify-center rounded-md border border-border"
      style={{ backgroundColor: `var(--${background})` }}
    >
      <span
        className="size-5 rounded-full border-3"
        style={{ borderColor: `var(--${foreground})` }}
      />
    </span>
  );
}

function ScaleRow({ name }: { name: ScaleName }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold">{SCALE_LABELS[name]}</h3>
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
        {SCALE_STEPS.map((step) => {
          const color = palette[name][step];
          return (
            <li
              key={step}
              className="flex h-20 flex-col justify-end rounded-md p-2 text-small"
              style={{
                backgroundColor: color.oklch,
                color: pickForeground(color.hex, ['#ffffff', palette.neutral[950].hex, '#000000']),
              }}
            >
              <span className="font-semibold">{step}</span>
              <span className="font-mono">{color.hex}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ColorsPage({ scheme, store }: { scheme: Scheme; store: string }) {
  const { colorOf, source } = colorsFor(scheme, store);
  const schemeLabel = scheme === 'dark' ? 'escuro' : 'claro';

  return (
    <FoundationPage
      title="Cores"
      lead="A interface é quase toda areia e ameixa. O uva marca as ações e a marca; a manga aparece pouco, só para chamar atenção."
    >
      <Section
        title="Escalas"
        description="Sete escalas de 50 a 950 em OKLCH. O hex é a mesma cor: o croma foi reduzido até caber no sRGB. Use as escalas só por meio dos tokens semânticos."
      >
        {SCALE_NAMES.map((name) => (
          <ScaleRow key={name} name={name} />
        ))}
      </Section>

      <Section
        title={`Contraste dos pares semânticos (tema ${schemeLabel}, ${source})`}
        description="Todo par que os componentes usam passa no WCAG 2.2 AA: 4,5:1 para texto e 3:1 para componentes de UI e foco. Troque o tema e a marca na barra de ferramentas."
      >
        <DataTable
          label="Contraste dos pares semânticos"
          head={['Exemplo', 'Fundo × frente', 'Mínimo', 'Contraste', 'Resultado']}
        >
          {SEMANTIC_PAIRS.map(({ background, foreground, level }) => {
            const ratio = contrastRatio(colorOf(background), colorOf(foreground));
            const passes = ratio >= CONTRAST_MINIMUM[level];
            return (
              <tr key={`${background}-${foreground}`}>
                <td className={cell}>
                  <PairSample
                    background={background}
                    foreground={foreground}
                    text={level !== 'ui'}
                  />
                </td>
                <td className={`${cell} font-mono`}>
                  {background} × {foreground}
                </td>
                <td className={cell}>
                  {LEVEL_LABELS[level]} · {formatRatio(CONTRAST_MINIMUM[level])}
                </td>
                <td className={`${cell} tabular-nums`}>{formatRatio(ratio)}</td>
                <td className={cell}>{passes ? 'Passa (AA)' : 'Falha'}</td>
              </tr>
            );
          })}
        </DataTable>
      </Section>

      <Section title={`Tokens semânticos (tema ${schemeLabel}, ${source})`}>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SEMANTIC_TOKENS.map((token) => (
            <li
              key={token}
              className="flex items-center gap-3 rounded-md border border-border bg-card p-2 text-small"
            >
              <span
                aria-hidden="true"
                className="size-8 shrink-0 rounded-sm border border-border"
                style={{ backgroundColor: `var(--${token})` }}
              />
              <span className="flex min-w-0 flex-col">
                <span className="font-mono font-semibold">{token}</span>
                <span className="truncate font-mono text-muted-foreground">{colorOf(token)}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Regras de uso">
        <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5">
          <li>Manga 500 nunca é texto sobre fundo claro (2,31:1). Ela é destaque pontual.</li>
          <li>
            <code className="font-mono">warning</code> é sempre fundo com{' '}
            <code className="font-mono">warning-foreground</code>, nunca texto sobre o fundo da
            página.
          </li>
          <li>
            <code className="font-mono">input</code> é a borda de campo e tem no mínimo 3:1;{' '}
            <code className="font-mono">border</code> é só separador decorativo.
          </li>
          <li>
            No escuro, o mesmo uva 400 serve de fundo de botão e de cor de link, com texto uva 950.
          </li>
          <li>
            O tema de loja é derivado por <code className="font-mono">buildStoreTheme()</code>, que
            garante AA em todos os pares.
          </li>
        </ul>
      </Section>
    </FoundationPage>
  );
}

const meta = {
  title: 'Fundamentos/Cores',
  id: 'fundamentos-cores',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;

export const Cores: StoryObj = {
  render: () => <ColorsPage {...activeTheme()} />,
};
