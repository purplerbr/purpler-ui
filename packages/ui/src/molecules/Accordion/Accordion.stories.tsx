import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionProps,
} from './Accordion';

const FAQ = [
  {
    question: 'Preciso ter CNPJ para abrir minha loja?',
    answer:
      'Não. Você pode começar com CPF e passar para CNPJ quando quiser. Os meios de pagamento pedem os seus dados direto, na conta que você conectar.',
  },
  {
    question: 'O dinheiro das vendas cai na minha conta?',
    answer:
      'Cai, sim. Cada venda é feita com a sua conta do Mercado Pago, PayPal ou Pagar.me, e o valor vai direto para ela. A Purpler cobra só a assinatura do plano.',
  },
  {
    question: 'Posso usar o domínio da minha marca?',
    answer:
      'Pode. Aponte o seu domínio, como www.minhaloja.com.br, e a loja passa a abrir nele. Até lá, ela fica no endereço padrão da Purpler.',
  },
] as const;

type FaqProps = AccordionProps & { name?: string; openFirst?: boolean };

function Faq({ name, openFirst = false, ...props }: FaqProps) {
  return (
    <Accordion {...props}>
      {FAQ.map(({ question, answer }, index) => (
        <AccordionItem key={question} name={name} open={openFirst && index === 0}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const meta = {
  title: 'Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: { className: 'max-w-2xl' },
  argTypes: {
    className: { control: 'text', description: 'Só layout (largura, margem)' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Perguntas e respostas que abrem e fecham. É feito com `<details>` e `<summary>` nativos: funciona sem JavaScript, então a página pré-renderizada continua legível e o conteúdo fechado continua no HTML para o SEO. `open` num item começa aberto; o mesmo `name` em vários itens deixa só um aberto por vez. Não coloque heading dentro do `AccordionTrigger`: o leitor de tela trata o resumo como botão e perde o heading.',
      },
    },
  },
  render: (args) => <Faq {...args} />,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FirstOpen: Story = {
  render: (args) => <Faq {...args} openFirst />,
};

/** Items sharing a `name` close the others when one opens (native exclusive accordion). */
export const OneAtATime: Story = {
  render: (args) => <Faq {...args} name="faq" />,
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid max-w-2xl gap-10">
      <Faq />
      <Faq openFirst />
    </div>
  ),
};
