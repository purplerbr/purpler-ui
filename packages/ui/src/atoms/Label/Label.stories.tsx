import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../Input/Input';
import { Label } from './Label';

const meta = {
  title: 'Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  args: { children: 'Nome da loja', htmlFor: 'label-story-input' },
  argTypes: {
    children: { control: 'text', description: 'Texto visível que dá nome ao campo' },
    htmlFor: { control: 'text', description: 'O `id` do campo que este rótulo nomeia' },
    asChild: { table: { disable: true } },
  },
  render: (args) => (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label {...args} />
      <Input id="label-story-input" />
    </div>
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Label has no variants; it takes the brand text style in both themes and store presets.
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="label-name">Nome da loja</Label>
        <Input id="label-name" placeholder="Doces da Ana" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="label-email">E-mail de contato (opcional)</Label>
        <Input id="label-email" type="email" placeholder="contato@docesdaana.com.br" />
      </div>
    </div>
  ),
};
