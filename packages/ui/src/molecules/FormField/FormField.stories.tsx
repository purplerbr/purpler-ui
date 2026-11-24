import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState, type SyntheticEvent } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { RadioGroup, RadioGroupItem } from '../../atoms/RadioGroup/RadioGroup';
import { FormField } from './FormField';

const SLUG_HELP = 'Só letras minúsculas, números e hífen. Dá para trocar depois.';

const meta = {
  title: 'Molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
  args: {
    label: 'Endereço da loja',
    description: SLUG_HELP,
    error: '',
    children: <Input placeholder="docesdaana" suffix=".purpler.com.br" />,
  },
  argTypes: {
    label: { control: 'text', description: 'Nome visível do campo' },
    description: { control: 'text', description: 'Ajuda abaixo do campo, lida depois do nome' },
    error: {
      control: 'text',
      description: 'Mensagem de erro; marca o campo com `aria-invalid` e é anunciada ao aparecer',
    },
    children: { control: false, description: 'Um único controle (`Input`, `RadioGroup`…)' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = { args: { error: 'Esse endereço já está em uso. Tente outro.' } };

export const WithRadioGroup: Story = {
  args: {
    label: 'Plano',
    description: 'Você pode mudar de plano quando quiser.',
    children: (
      <RadioGroup variant="card" defaultValue="basic">
        <RadioGroupItem value="basic" label="Básico" description="Grátis · até 30 produtos" />
        <RadioGroupItem
          value="enterprise"
          label="Enterprise"
          description="R$ 149,99/mês · até 150 produtos"
          badge="Em breve"
          disabled
        />
      </RadioGroup>
    ),
  },
};

// Mimics react-hook-form: validate on submit, then focus the first invalid field.
function CreateStoreForm() {
  const [errors, setErrors] = useState<{ name?: string | undefined; slug?: string | undefined }>(
    {}
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  function onSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = nameRef.current?.value.trim() ?? '';
    const slug = slugRef.current?.value ?? '';
    const next = {
      name: name ? undefined : 'Informe o nome da loja.',
      slug: /^[a-z0-9-]{3,}$/.test(slug)
        ? undefined
        : 'Use ao menos 3 letras minúsculas, números ou hífen.',
    };
    setErrors(next);
    if (next.name) nameRef.current?.focus();
    else if (next.slug) slugRef.current?.focus();
  }

  return (
    <form aria-label="Criar loja" noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormField label="Nome da loja" error={errors.name}>
        <Input ref={nameRef} name="name" autoComplete="organization" />
      </FormField>
      <FormField label="Endereço da loja" description={SLUG_HELP} error={errors.slug}>
        <Input ref={slugRef} name="slug" suffix=".purpler.com.br" autoCapitalize="none" />
      </FormField>
      <Button type="submit" className="self-start">
        Criar loja
      </Button>
    </form>
  );
}

export const ValidationFlow: Story = {
  parameters: { controls: { disable: true } },
  render: () => <CreateStoreForm />,
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <FormField label="Nome da loja">
        <Input placeholder="Doces da Ana" />
      </FormField>
      <FormField label="Endereço da loja" description={SLUG_HELP}>
        <Input placeholder="docesdaana" suffix=".purpler.com.br" />
      </FormField>
      <FormField
        label="Endereço com erro"
        description={SLUG_HELP}
        error="Esse endereço já está em uso. Tente outro."
      >
        <Input defaultValue="docesdaana" suffix=".purpler.com.br" />
      </FormField>
      <FormField label="Preço" error="Informe um valor maior que zero.">
        <Input defaultValue="0,00" prefix="R$" inputMode="decimal" />
      </FormField>
      <FormField label="E-mail da conta" description="Vem da sua conta Google.">
        <Input type="email" defaultValue="ana@docesdaana.com.br" disabled />
      </FormField>
      <FormField label="Plano" error="Escolha um plano para continuar.">
        <RadioGroup variant="card">
          <RadioGroupItem value="basic" label="Básico" description="Grátis · até 30 produtos" />
          <RadioGroupItem
            value="professional"
            label="Profissional"
            description="R$ 79,99/mês · até 100 produtos"
          />
        </RadioGroup>
      </FormField>
    </div>
  ),
};
