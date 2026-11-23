import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, DataTable, FoundationPage, Section, cell } from './FoundationPage';

const TRAITS = [
  {
    trait: 'Acolhedora',
    how: 'Trata por “você”, sem jargão. Quem abre a primeira loja nunca se sente burro por não saber algo.',
  },
  { trait: 'Prática', how: 'Cada frase leva a uma ação. Diz o que aconteceu e o que fazer agora.' },
  {
    trait: 'Animada',
    how: 'Comemora as conquistas do lojista, como a primeira venda, sem euforia.',
  },
] as const;

const TONE = [
  { we: 'Próximos', not: 'Íntimos ou cheios de gíria' },
  { we: 'Claros', not: 'Técnicos ou burocráticos' },
  { we: 'Confiantes', not: 'Arrogantes ou cheios de promessas' },
  { we: 'Animados', not: 'Eufóricos ou infantis' },
] as const;

const EXAMPLES = [
  { context: 'Botão (CTA)', write: 'Cadastrar meu primeiro produto', avoid: 'Clique aqui' },
  {
    context: 'Erro',
    write:
      'Não deu para salvar o produto. Confira sua conexão e tente de novo; o que você digitou continua aqui.',
    avoid: 'Erro 500: falha na requisição.',
  },
  {
    context: 'Estado vazio',
    write: 'Sua vitrine ainda está vazia. Cadastre o primeiro produto e ela ganha vida.',
    avoid: 'Nenhum registro encontrado.',
  },
  {
    context: 'Sucesso',
    write: 'Produto salvo. Ele já aparece na sua vitrine.',
    avoid: 'Operação realizada com sucesso!!!',
  },
  {
    context: 'Limite do plano',
    write:
      'Você chegou a 30 produtos, o limite do plano Básico. Arquive um produto ou passe para o Profissional para ter até 100.',
    avoid: 'Limite excedido.',
  },
  {
    context: 'Primeira venda',
    write: 'Primeira venda feita! O pedido #1001 já está em Pedidos.',
    avoid: 'Parabéns!!! Você é demais!!!',
  },
] as const;

function VoicePage() {
  return (
    <FoundationPage
      title="Voz"
      lead="Falamos como quem atende no balcão: perto, direto e de bom humor. O texto sempre leva o lojista e o comprador à próxima ação."
    >
      <Section title="Personalidade">
        <div className="grid gap-4 md:grid-cols-3">
          {TRAITS.map(({ trait, how }) => (
            <Card key={trait}>
              <h3 className="font-semibold">{trait}</h3>
              <p className="text-muted-foreground">{how}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Tom">
        <DataTable head={['Somos', 'Sem ser']}>
          {TONE.map(({ we, not }) => (
            <tr key={we}>
              <td className={`${cell} font-semibold`}>{we}</td>
              <td className={cell}>{not}</td>
            </tr>
          ))}
        </DataTable>
      </Section>

      <Section title="Regras de escrita">
        <ul className="flex max-w-prose list-disc flex-col gap-2 pl-5">
          <li>Voz ativa e “você”.</li>
          <li>Botão começa com verbo e diz o resultado: “Publicar loja”.</li>
          <li>Erro diz o que aconteceu e como resolver, sem culpar e sem “Ops!”.</li>
          <li>Dinheiro, datas e números no formato brasileiro: R$ 79,99 · 23/11/2026 · 1.248.</li>
          <li>Termos que o lojista reconhece: “endereço da loja”, não “slug”.</li>
          <li>No máximo uma exclamação por tela e nenhuma em erro. Sem emoji na interface.</li>
        </ul>
      </Section>

      <Section title="Exemplos de microcopy">
        <DataTable head={['Contexto', 'Escreva assim', 'Evite']}>
          {EXAMPLES.map(({ context, write, avoid }) => (
            <tr key={context}>
              <td className={`${cell} font-semibold`}>{context}</td>
              <td className={cell}>{write}</td>
              <td className={`${cell} text-muted-foreground`}>{avoid}</td>
            </tr>
          ))}
        </DataTable>
      </Section>
    </FoundationPage>
  );
}

const meta = {
  title: 'Fundamentos/Voz',
  id: 'fundamentos-voz',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;

export const Voz: StoryObj = { render: () => <VoicePage /> };
