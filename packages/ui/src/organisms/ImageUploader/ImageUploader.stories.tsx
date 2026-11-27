import { palette } from '@purplerbr/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { fn } from 'storybook/test';
import { ImageUploader, type ImageUploaderImage, type ImageUploaderProps } from './ImageUploader';

const MB = 1024 * 1024;

// Stand-in product photos drawn from the palette, so the stories need no image files.
function sample(from: string, to: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="4" height="4" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SOURCES = [
  sample(palette.brand[300].hex, palette.brand[700].hex),
  sample(palette.accent[200].hex, palette.accent[600].hex),
  sample(palette.success[200].hex, palette.success[700].hex),
  sample(palette.info[200].hex, palette.info[700].hex),
  sample(palette.neutral[200].hex, palette.neutral[600].hex),
];
const src = (index: number) => SOURCES[index % SOURCES.length] ?? '';

const ALL_STATUSES: ImageUploaderImage[] = [
  { id: 'a', src: src(0), alt: 'Bolo de cenoura com cobertura', status: 'ready' },
  { id: 'b', src: src(1), status: 'uploading', progress: 45 },
  { id: 'c', src: src(2), status: 'processing' },
  { id: 'd', src: src(3), status: 'error', error: 'A conexão caiu durante o envio.' },
  { id: 'e', src: src(4), status: 'uploading' },
];

const meta = {
  title: 'Organisms/ImageUploader',
  component: ImageUploader,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Imagens do produto',
    images: ALL_STATUSES,
    accept: 'image/jpeg,image/png,image/webp',
    maxSize: 5 * MB,
    maxFiles: 10,
    onFilesSelected: fn(),
    onRemove: fn(),
    onRetry: fn(),
    onReorder: fn(),
  },
  argTypes: {
    images: {
      control: 'object',
      description: 'Imagens na ordem de exibição; a primeira é a capa',
    },
    accept: { control: 'text', description: 'Tipos aceitos, na sintaxe do `<input accept>`' },
    maxSize: { control: 'number', description: 'Tamanho máximo de cada arquivo, em bytes' },
    maxFiles: { control: 'number', description: 'Quantidade máxima de imagens' },
    onFilesSelected: { description: 'Recebe só os arquivos que passaram nas regras' },
    onRemove: { description: 'Recebe o `id` da imagem' },
    onRetry: { description: 'Recebe o `id` da imagem com erro' },
    onReorder: { description: 'Recebe todos os `id`s na nova ordem' },
  },
} satisfies Meta<typeof ImageUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { images: [] } };

export const Full: Story = { args: { images: ALL_STATUSES.slice(0, 1), maxFiles: 1 } };

type Upload = ImageUploaderImage & { file?: File | undefined };

// Fakes the app: progress every 300 ms, then “processing”, and every file named with “erro” fails.
function SimulatedUploader(props: ImageUploaderProps) {
  const [images, setImages] = useState<Upload[]>([]);
  const urls = useRef<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setImages((list) =>
        list.map((image) => {
          if (image.status === 'processing') return { ...image, status: 'ready' };
          if (image.status !== 'uploading') return image;
          const progress = (image.progress ?? 0) + 20;
          if (progress < 100) return { ...image, progress };
          return image.file?.name.includes('erro')
            ? { ...image, status: 'error', error: 'Não conseguimos enviar. Tente de novo.' }
            : { ...image, status: 'processing' };
        })
      );
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
    <ImageUploader
      {...props}
      images={images}
      onFilesSelected={(files) => {
        props.onFilesSelected(files);
        const added = files.map((file) => {
          const url = URL.createObjectURL(file);
          urls.current.push(url);
          return { id: url, src: url, file, status: 'uploading' as const, progress: 0 };
        });
        setImages((list) => [...list, ...added]);
      }}
      onRemove={(id) => {
        props.onRemove(id);
        setImages((list) => list.filter((image) => image.id !== id));
      }}
      onRetry={(id) => {
        props.onRetry(id);
        setImages((list) =>
          list.map((image) =>
            image.id === id
              ? { ...image, status: 'uploading', progress: 0, file: undefined }
              : image
          )
        );
      }}
      onReorder={(ids) => {
        props.onReorder(ids);
        setImages((list) => ids.flatMap((id) => list.filter((image) => image.id === id)));
      }}
    />
  );
}

export const SimulatedUpload: Story = {
  args: { images: [], maxFiles: 6 },
  render: (args) => <SimulatedUploader {...args} />,
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="grid gap-8">
      <ImageUploader {...args} aria-label="Sem imagens" images={[]} />
      <ImageUploader {...args} aria-label="Todos os estados" images={ALL_STATUSES} />
      <ImageUploader
        {...args}
        aria-label="Limite atingido"
        images={ALL_STATUSES.slice(0, 2)}
        maxFiles={2}
      />
    </div>
  ),
};
