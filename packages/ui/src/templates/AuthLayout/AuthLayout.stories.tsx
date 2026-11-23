import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/Button/Button';
import { Text } from '../../atoms/Text/Text';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../molecules/Card/Card';
import { AuthLayout } from './AuthLayout';

const legal = (
  <Text as="span" size="small">
    Ao continuar, você aceita os <a href="#termos">Termos de uso</a> e a{' '}
    <a href="#privacidade">Política de privacidade</a> da Purpler.
  </Text>
);

const signIn = (
  <Card>
    <CardHeader>
      <CardTitle level={1} size="title-2">
        Entrar na Purpler
      </CardTitle>
      <CardDescription>Use sua conta Google para acessar o painel da sua loja.</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button className="w-full">Continuar com Google</Button>
    </CardFooter>
  </Card>
);

const callback = (
  <Card>
    <CardHeader>
      <CardTitle level={1} size="title-2">
        Quase lá
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Text tone="muted" aria-live="polite">
        Estamos confirmando seu acesso. Isso leva só um instante.
      </Text>
    </CardContent>
  </Card>
);

const meta = {
  title: 'Templates/AuthLayout',
  component: AuthLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { children: signIn, footer: legal },
  argTypes: {
    children: { control: false, description: 'Conteúdo da página, em geral um `Card` com o `h1`' },
    footer: { control: false, description: 'Texto curto com os links de termos e privacidade' },
  },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Callback: Story = { args: { children: callback } };

export const WithoutFooter: Story = { args: { footer: undefined } };

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => <AuthLayout footer={legal}>{signIn}</AuthLayout>,
};
