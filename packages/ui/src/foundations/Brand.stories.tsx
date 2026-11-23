import type { Meta, StoryObj } from '@storybook/react-vite';
import { fontStack, palette } from '@purplerbr/tokens';
import type { CSSProperties } from 'react';
import appleTouchIcon from '../assets/brand/apple-touch-icon.png';
import favicon from '../assets/brand/favicon.svg';
import icon512 from '../assets/brand/icon-512.png';
import logoDark from '../assets/brand/logo-cor-escuro.svg';
import logoLight from '../assets/brand/logo-cor-claro.svg';
import logoMono from '../assets/brand/logo-mono.svg';
import logoWhite from '../assets/brand/logo-mono-branco.svg';
import symbol from '../assets/brand/simbolo.svg';
import { Card, DataTable, FoundationPage, Section, Verdict, cell } from './FoundationPage';

// Fixed brand surfaces: these panels show the logo on a given color, whatever the theme.
const SAND = { backgroundColor: palette.neutral[50].oklch } satisfies CSSProperties;
const PLUM = { backgroundColor: palette.neutral[950].oklch } satisfies CSSProperties;
const GRAPE = { backgroundColor: palette.brand[600].oklch } satisfies CSSProperties;
const GRAPE_LIGHT = { backgroundColor: palette.brand[500].oklch } satisfies CSSProperties;

const LOGO_VERSIONS = [
  { src: logoLight, surface: SAND, name: 'Cor, fundo claro', use: 'Areia 50 ou branco.' },
  { src: logoDark, surface: PLUM, name: 'Cor, fundo escuro', use: 'Ameixa 900 ou 950.' },
  { src: logoWhite, surface: GRAPE, name: 'Branco', use: 'Uva 600 ou foto escura com área lisa.' },
  {
    src: logoMono,
    surface: SAND,
    name: 'Monocromático',
    use: 'Usa a cor do texto (currentColor).',
  },
] as const;

const MISUSES: readonly { label: string; style: CSSProperties; surface: CSSProperties }[] = [
  { label: 'esticar ou achatar', style: { transform: 'scale(1.35, 0.7)' }, surface: SAND },
  { label: 'trocar as cores', style: { filter: 'hue-rotate(150deg)' }, surface: SAND },
  { label: 'aplicar sobre fundo sem contraste (uva 500)', style: {}, surface: GRAPE_LIGHT },
  { label: 'girar ou inclinar', style: { transform: 'rotate(-12deg)' }, surface: SAND },
  {
    label: 'aplicar sombra, contorno, brilho ou degradê',
    style: { filter: `drop-shadow(0 3px 2px ${palette.brand[400].oklch})` },
    surface: SAND,
  },
];

function BrandPage() {
  return (
    <FoundationPage
      title="Marca"
      lead="A Purpler é o balcão digital do empreendedor: calorosa como a loja do bairro e organizada como uma loja que funciona."
    >
      <Section title="Conceito e personalidade">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Acolhedora</h3>
            <p className="text-muted-foreground">
              Trata por “você”, sem jargão. Quem abre a primeira loja nunca se sente perdido.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Prática</h3>
            <p className="text-muted-foreground">
              Cada frase leva a uma ação: o que aconteceu e o que fazer agora.
            </p>
          </Card>
          <Card>
            <h3 className="font-semibold">Animada</h3>
            <p className="text-muted-foreground">
              Comemora as conquistas do lojista, sem euforia: no máximo uma exclamação por tela.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        title="Símbolo"
        description="Um P cuja barriga é uma etiqueta de preço. O furo da etiqueta é o olho da letra, e a haste desce como o p minúsculo do nome."
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="rounded-lg p-6" style={SAND}>
            <img
              src={symbol}
              alt="Símbolo da Purpler: a letra P com a barriga em forma de etiqueta de preço"
              width={96}
              height={96}
            />
          </div>
          <div className="rounded-full p-4" style={GRAPE}>
            <img
              src={appleTouchIcon}
              alt="Ícone do aplicativo: símbolo branco sobre uva"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Logo"
        description="O nome é Bricolage Grotesque ExtraBold convertido em curvas. Use os arquivos, nunca digite o nome."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {LOGO_VERSIONS.map((version) => (
            <figure key={version.name} className="flex flex-col gap-2">
              <div
                className="flex h-32 items-center justify-center rounded-lg border border-border"
                style={version.surface}
              >
                <img
                  src={version.src}
                  alt={`Logo da Purpler, versão ${version.name.toLowerCase()}`}
                  height={40}
                  width={205}
                />
              </div>
              <figcaption className="text-small">
                <strong className="font-semibold">{version.name}.</strong> {version.use}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section
        title="Área de proteção e tamanho mínimo"
        description="x é a largura da haste do símbolo (cerca de 30% da altura do logo). Deixe no mínimo x livre em todos os lados."
      >
        <div className="flex flex-wrap items-center gap-6">
          <div className="rounded-lg p-6" style={SAND}>
            <div className="border border-dashed border-input p-3">
              <img
                src={logoLight}
                alt="Logo da Purpler com a área de proteção marcada em tracejado"
                height={40}
                width={205}
              />
            </div>
          </div>
        </div>
        <DataTable label="Tamanho mínimo do logo" head={['Peça', 'Tela', 'Impresso']}>
          <tr>
            <td className={cell}>Logo completo</td>
            <td className={cell}>20 px de altura (cerca de 102 px de largura)</td>
            <td className={cell}>6 mm de altura</td>
          </tr>
          <tr>
            <td className={cell}>Só o símbolo</td>
            <td className={cell}>16 px</td>
            <td className={cell}>4 mm</td>
          </tr>
        </DataTable>
        <p className="text-muted-foreground">
          Abaixo de 20 px de altura, use só o símbolo. No cabeçalho do site e do painel, o logo tem
          32 px.
        </p>
      </Section>

      <Section title="Usos corretos e incorretos">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <div className="flex h-24 items-center justify-center rounded-md" style={SAND}>
              <img src={logoLight} alt="Logo em cor sobre areia" height={32} width={164} />
            </div>
            <Verdict ok>versão em cor sobre areia ou branco.</Verdict>
          </Card>
          <Card>
            <div className="flex h-24 items-center justify-center rounded-md" style={PLUM}>
              <img
                src={logoDark}
                alt="Logo para fundo escuro sobre ameixa"
                height={32}
                width={164}
              />
            </div>
            <Verdict ok>versão para fundo escuro sobre ameixa 900 ou 950.</Verdict>
          </Card>
          <Card>
            <div className="flex h-24 items-center justify-center rounded-md" style={GRAPE}>
              <img src={logoWhite} alt="Logo branco sobre uva 600" height={32} width={164} />
            </div>
            <Verdict ok>versão branca sobre uva 600.</Verdict>
          </Card>
          {MISUSES.map((misuse) => (
            <Card key={misuse.label}>
              <div
                className="flex h-24 items-center justify-center overflow-hidden rounded-md"
                style={misuse.surface}
              >
                <img
                  src={logoLight}
                  alt={`Exemplo de uso incorreto: ${misuse.label}`}
                  height={32}
                  width={164}
                  style={misuse.style}
                />
              </div>
              <Verdict ok={false}>{misuse.label}.</Verdict>
            </Card>
          ))}
          <Card>
            <div className="flex h-24 items-center justify-center gap-2 rounded-md" style={SAND}>
              <img src={symbol} alt="" height={32} width={32} />
              <span
                className="text-title-3"
                style={{ color: palette.brand[950].oklch, fontFamily: fontStack('lora') }}
              >
                Purpler
              </span>
            </div>
            <Verdict ok={false}>digitar o nome em outra fonte.</Verdict>
          </Card>
        </div>
        <p className="text-muted-foreground">
          Evite uva 300–400 em áreas grandes (fundos, faixas, botões grandes): esses tons puxam para
          o rosa.
        </p>
      </Section>

      <Section
        title="Favicon e ícones"
        description="O favicon em SVG troca para uva 300 quando o sistema está no tema escuro."
      >
        <div className="flex flex-wrap items-end gap-6">
          <figure className="flex flex-col items-center gap-2">
            <img src={favicon} alt="Favicon em SVG" width={32} height={32} />
            <figcaption className="text-small text-muted-foreground">favicon.svg</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <img
              src={appleTouchIcon}
              alt="Ícone para iPhone, 180 px"
              width={60}
              height={60}
              className="rounded-xl"
            />
            <figcaption className="text-small text-muted-foreground">
              apple-touch-icon.png
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-2">
            <img
              src={icon512}
              alt="Ícone de 512 px para PWA"
              width={96}
              height={96}
              className="rounded-2xl"
            />
            <figcaption className="text-small text-muted-foreground">icon-512.png</figcaption>
          </figure>
        </div>
      </Section>
    </FoundationPage>
  );
}

const meta = {
  title: 'Fundamentos/Marca',
  id: 'fundamentos-marca',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;

export const Marca: StoryObj = { render: () => <BrandPage /> };
