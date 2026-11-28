import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { fn } from 'storybook/test';
import { FileUploader, type FileUploaderItem, type FileUploaderProps } from './FileUploader';

const MB = 1024 * 1024;

const DIGITAL: FileUploaderItem[] = [
  { id: 'a', name: 'receitas-de-bolo.zip', sizeBytes: 12.6 * MB, status: 'ready' },
  {
    id: 'b',
    name: 'planilhas-de-custos.rar',
    sizeBytes: 312.4 * MB,
    status: 'uploading',
    progress: 45,
  },
  { id: 'c', name: 'bonus-embalagens.zip', sizeBytes: 48 * MB, status: 'processing' },
  {
    id: 'd',
    name: 'apostila-completa-de-confeitaria-artesanal-para-iniciantes-versao-final.zip',
    sizeBytes: 220 * MB,
    status: 'error',
    error: 'A conexão caiu durante o envio.',
  },
];

const VIDEOS: FileUploaderItem[] = [
  { id: 'v1', name: 'aula-01-boas-vindas.mp4', sizeBytes: 86.2 * MB, status: 'ready' },
  {
    id: 'v2',
    name: 'aula-02-massa-basica.mp4',
    sizeBytes: 410 * MB,
    status: 'uploading',
    progress: 72,
  },
  { id: 'v3', name: 'aula-03-recheios.mp4', sizeBytes: 380 * MB, status: 'uploading' },
  {
    id: 'v4',
    name: 'aula-04-cobertura.mp4',
    sizeBytes: 295 * MB,
    status: 'error',
    error: 'Não conseguimos verificar o vídeo. Envie de novo.',
  },
  {
    id: 'v5',
    name: 'aula-05-decoracao.mp4',
    sizeBytes: 240 * MB,
    status: 'processing',
    processingLabel: 'Convertendo…',
  },
  {
    id: 'v6',
    name: 'aula-06-embalagem.mp4',
    sizeBytes: 198 * MB,
    status: 'error',
    error: 'A conversão deste vídeo falhou. Remova e envie o arquivo de novo.',
    retryable: false,
  },
];

const meta = {
  title: 'Organisms/FileUploader',
  component: FileUploader,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Arquivos do produto',
    items: DIGITAL,
    accept: '.zip,.rar',
    maxSize: 500 * MB,
    maxFiles: 10,
    title: 'Adicionar arquivos',
    description: 'Arraste para cá ou clique para escolher',
    emptyHint: 'Nenhum arquivo adicionado ainda.',
    onFilesSelected: fn(),
    onRemove: fn(),
    onRetry: fn(),
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'Arquivos na ordem de exibição; por item, `processingLabel` troca o “Verificando…” e `retryable: false` esconde o “Tentar de novo”',
    },
    accept: { control: 'text', description: 'Tipos aceitos, na sintaxe do `<input accept>`' },
    maxSize: { control: 'number', description: 'Tamanho máximo de cada arquivo, em bytes' },
    maxFiles: { control: 'number', description: 'Quantidade máxima de arquivos' },
    title: { control: 'text', description: 'Texto principal da área de envio' },
    description: { control: 'text', description: 'Texto de apoio da área de envio' },
    emptyHint: { control: 'text', description: 'Mostrado enquanto a lista está vazia' },
    onFilesSelected: { description: 'Recebe só os arquivos que passaram nas regras' },
    onRemove: { description: 'Recebe o `id` do arquivo' },
    onRetry: { description: 'Recebe o `id` do arquivo com erro' },
    onReorder: {
      description: 'Recebe todos os `id`s na nova ordem; sem ele, a lista não é reordenável',
    },
  },
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { items: [] } };

export const Videos: Story = {
  args: {
    'aria-label': 'Vídeos do curso',
    items: VIDEOS,
    accept: '.mp4',
    title: 'Adicionar vídeos',
    emptyHint: 'Nenhum vídeo adicionado ainda.',
    onReorder: fn(),
  },
};

export const Full: Story = { args: { items: DIGITAL.slice(0, 2), maxFiles: 2 } };

// Fakes the app: progress every 300 ms, then “Verificando…”, and every file named with “erro” fails.
function SimulatedUploader(props: FileUploaderProps) {
  const [items, setItems] = useState<FileUploaderItem[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setItems((list) =>
        list.map((item) => {
          if (item.status === 'processing') return { ...item, status: 'ready' };
          if (item.status !== 'uploading') return item;
          const progress = (item.progress ?? 0) + 20;
          if (progress < 100) return { ...item, progress };
          return item.name.includes('erro') && item.error === undefined
            ? { ...item, status: 'error', error: 'Não conseguimos enviar. Tente de novo.' }
            : { ...item, status: 'processing' };
        })
      );
    }, 300);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <FileUploader
      {...props}
      items={items}
      onFilesSelected={(files) => {
        props.onFilesSelected(files);
        const added = files.map((file, index) => ({
          id: `${file.name}-${String(Date.now())}-${String(index)}`,
          name: file.name,
          sizeBytes: file.size,
          status: 'uploading' as const,
          progress: 0,
        }));
        setItems((list) => [...list, ...added]);
      }}
      onRemove={(id) => {
        props.onRemove(id);
        setItems((list) => list.filter((item) => item.id !== id));
      }}
      onRetry={(id) => {
        props.onRetry(id);
        // Keeps the error text as a marker, so the retry succeeds.
        setItems((list) =>
          list.map((item) =>
            item.id === id ? { ...item, status: 'uploading', progress: 0 } : item
          )
        );
      }}
      onReorder={(ids) => {
        props.onReorder?.(ids);
        setItems((list) => ids.flatMap((id) => list.filter((item) => item.id === id)));
      }}
    />
  );
}

export const SimulatedUpload: Story = {
  args: {
    'aria-label': 'Vídeos do curso',
    items: [],
    accept: '.mp4',
    title: 'Adicionar vídeos',
    onReorder: fn(),
  },
  render: (args) => <SimulatedUploader {...args} />,
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="grid gap-8">
      <FileUploader {...args} aria-label="Sem arquivos" items={[]} />
      <FileUploader {...args} aria-label="Produto digital, todos os estados" items={DIGITAL} />
      <FileUploader
        {...args}
        aria-label="Vídeos do curso, reordenáveis"
        items={VIDEOS}
        accept=".mp4"
        title="Adicionar vídeos"
        onReorder={fn()}
      />
      <FileUploader
        {...args}
        aria-label="Limite atingido"
        items={DIGITAL.slice(0, 2)}
        maxFiles={2}
      />
    </div>
  ),
};
