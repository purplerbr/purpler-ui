import { palette } from '@purplerbr/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { fn } from 'storybook/test';
import type { ImageUploaderImage } from '../ImageUploader/ImageUploader';
import { SingleImageUploader, type SingleImageUploaderProps } from './SingleImageUploader';

const MB = 1024 * 1024;

// A wide stand-in logo with a transparent background, drawn from the palette.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><circle cx="20" cy="20" r="16" fill="${palette.brand[600].hex}"/><rect x="44" y="12" width="68" height="16" rx="8" fill="${palette.accent[500].hex}"/></svg>`;
const LOGO = `data:image/svg+xml,${encodeURIComponent(svg)}`;

const READY: ImageUploaderImage = {
  id: 'logo',
  src: LOGO,
  alt: 'Logo da Doces da Ana',
  status: 'ready',
};

const meta = {
  title: 'Organisms/SingleImageUploader',
  component: SingleImageUploader,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Logo da loja',
    image: READY,
    accept: 'image/jpeg,image/png,image/webp',
    maxSize: 2 * MB,
    onFileSelected: fn(),
    onRemove: fn(),
    onRetry: fn(),
  },
  argTypes: {
    image: { control: 'object', description: 'A imagem atual; sem ela, aparece a área de envio' },
    accept: { control: 'text', description: 'Tipos aceitos, na sintaxe do `<input accept>`' },
    maxSize: { control: 'number', description: 'Tamanho máximo do arquivo, em bytes' },
    onFileSelected: {
      description: 'Recebe o arquivo que passou nas regras; com imagem, é a troca',
    },
    onRemove: { description: 'Remove a imagem atual' },
    onRetry: { description: 'Tenta de novo o envio que falhou' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SingleImageUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { image: undefined } };

export const Uploading: Story = {
  args: { image: { ...READY, status: 'uploading', progress: 60 } },
};

export const WithError: Story = {
  args: { image: { ...READY, status: 'error', error: 'A conexão caiu durante o envio.' } },
};

type Upload = ImageUploaderImage & { file?: File | undefined };

// Fakes the app: progress every 300 ms, then “processing”, and a file named with “erro” fails.
function SimulatedUploader(props: SingleImageUploaderProps) {
  const [image, setImage] = useState<Upload | undefined>(undefined);
  const urls = useRef<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setImage((current) => {
        if (current?.status === 'processing') return { ...current, status: 'ready' };
        if (current?.status !== 'uploading') return current;
        const progress = (current.progress ?? 0) + 20;
        if (progress < 100) return { ...current, progress };
        return current.file?.name.includes('erro')
          ? { ...current, status: 'error', error: 'Não conseguimos enviar. Tente de novo.' }
          : { ...current, status: 'processing' };
      });
    }, 300);
    const created = urls.current;
    return () => {
      clearInterval(timer);
      created.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  return (
    <SingleImageUploader
      {...props}
      image={image}
      onFileSelected={(file) => {
        props.onFileSelected(file);
        const url = URL.createObjectURL(file);
        urls.current.push(url);
        setImage({ id: url, src: url, file, status: 'uploading', progress: 0 });
      }}
      onRemove={() => {
        props.onRemove();
        setImage(undefined);
      }}
      onRetry={() => {
        props.onRetry();
        setImage(
          (current) => current && { ...current, status: 'uploading', progress: 0, file: undefined }
        );
      }}
    />
  );
}

export const SimulatedUpload: Story = {
  args: { image: undefined },
  render: (args) => <SimulatedUploader {...args} />,
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="grid gap-8">
      <SingleImageUploader {...args} aria-label="Sem logo" image={undefined} />
      <SingleImageUploader {...args} aria-label="Logo pronto" image={READY} />
      <SingleImageUploader
        {...args}
        aria-label="Logo enviando"
        image={{ ...READY, status: 'uploading', progress: 45 }}
      />
      <SingleImageUploader
        {...args}
        aria-label="Logo processando"
        image={{ ...READY, status: 'processing' }}
      />
      <SingleImageUploader
        {...args}
        aria-label="Logo com erro"
        image={{ ...READY, status: 'error', error: 'A conexão caiu durante o envio.' }}
      />
    </div>
  ),
};
