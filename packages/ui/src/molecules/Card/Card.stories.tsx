import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/Button/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const header = (
  <CardHeader>
    <CardTitle level={2}>Entrar</CardTitle>
    <CardDescription>Use sua conta Google para acessar o painel da sua loja.</CardDescription>
  </CardHeader>
);

const content = (
  <CardContent>
    <p className="text-small">Ao continuar, você aceita os termos de uso da Purpler.</p>
  </CardContent>
);

const footer = (
  <CardFooter>
    <Button className="w-full">Continuar com Google</Button>
  </CardFooter>
);

const meta = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    className: 'max-w-sm',
    children: (
      <>
        {header}
        {content}
        {footer}
      </>
    ),
  },
  argTypes: {
    children: {
      control: false,
      description:
        '`CardHeader` (com `CardTitle` e `CardDescription`), `CardContent` e `CardFooter`; `CardTitle` aceita `level` de 1 a 6',
    },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HeaderOnly: Story = { args: { children: header } };

export const WithoutFooter: Story = {
  args: {
    children: (
      <>
        {header}
        {content}
      </>
    ),
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        {header}
        {content}
        {footer}
      </Card>
      <Card>
        {header}
        {content}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle level={2}>Pedidos de hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-small">Nenhum pedido novo por enquanto.</p>
        </CardContent>
      </Card>
    </div>
  ),
};
