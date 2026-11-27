import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ImageUploader, type ImageUploaderImage, type ImageUploaderProps } from './ImageUploader';

const MB = 1024 * 1024;
const IMAGES: ImageUploaderImage[] = [
  { id: 'a', src: 'a.webp', alt: 'Bolo de cenoura', status: 'ready' },
  { id: 'b', src: 'b.webp', status: 'uploading', progress: 40 },
  { id: 'c', src: 'c.webp', status: 'error', error: 'A conexão caiu. Tente de novo.' },
];

function file(name: string, type: string, size = 1024): File {
  const created = new File(['x'], name, { type });
  Object.defineProperty(created, 'size', { value: size });
  return created;
}

function setup(props: Partial<ImageUploaderProps> = {}) {
  const handlers = {
    onFilesSelected: vi.fn(),
    onRemove: vi.fn(),
    onRetry: vi.fn(),
    onReorder: vi.fn(),
  };
  const view = render(
    <main>
      <ImageUploader
        aria-label="Imagens do produto"
        images={IMAGES}
        accept="image/jpeg,image/png,image/webp"
        maxSize={5 * MB}
        maxFiles={5}
        {...handlers}
        {...props}
      />
    </main>
  );
  const input = view.container.querySelector<HTMLInputElement>('input[type="file"]');
  if (input === null) throw new Error('file input not rendered');
  return { ...handlers, ...view, input };
}

// Keeps the order in state, as the app would, so focus and announcements can be checked.
function Reorderable({ onRemove }: { onRemove?: () => void }) {
  const [images, setImages] = useState(IMAGES);
  return (
    <ImageUploader
      images={images}
      accept="image/webp"
      maxSize={MB}
      maxFiles={5}
      onFilesSelected={vi.fn()}
      onRetry={vi.fn()}
      onRemove={(id) => {
        onRemove?.();
        setImages((list) => list.filter((image) => image.id !== id));
      }}
      onReorder={(ids) => {
        setImages(ids.flatMap((id) => images.filter((image) => image.id === id)));
      }}
    />
  );
}

const tiles = () => within(screen.getByRole('list')).getAllByRole('listitem');

describe('ImageUploader', () => {
  it('describes the drop zone with the accepted types, the size and the count', () => {
    setup();

    expect(
      screen.getByRole('button', {
        name: 'Adicionar imagens Arraste para cá ou clique para escolher',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Adicionar imagens/ })).toHaveAccessibleDescription(
      'JPEG, PNG ou WEBP, até 5 MB cada. 3 de 5 imagens.'
    );
  });

  it('opens the file picker on click and with the keyboard', async () => {
    const user = userEvent.setup();
    const { input } = setup();
    const click = vi.spyOn(input, 'click');

    await user.click(screen.getByRole('button', { name: /^Adicionar imagens/ }));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(click).toHaveBeenCalledTimes(3);
  });

  it('sends only the valid files and lists why the others were refused', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const { input, onFilesSelected } = setup({ images: IMAGES.slice(0, 2), maxFiles: 4 });
    const good = file('bolo.png', 'image/png');
    const fits = file('torta.jpg', 'image/jpeg');

    await user.upload(input, [
      good,
      file('logo.svg', 'image/svg+xml'),
      file('grande.webp', 'image/webp', 6 * MB),
      fits,
      file('extra.webp', 'image/webp'),
    ]);

    expect(onFilesSelected).toHaveBeenCalledWith([good, fits]);
    const alert = screen.getByRole('alert');
    expect(
      within(alert)
        .getAllByRole('listitem')
        .map((item) => item.textContent)
    ).toEqual([
      'logo.svg: tipo não aceito. Envie JPEG, PNG ou WEBP.',
      'grande.webp: maior que 5 MB.',
      'extra.webp: o limite é de 4 imagens.',
    ]);
    expect(screen.getByText('2 imagens adicionadas.')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('accepts files dropped anywhere on it and marks the drag over', () => {
    const { onFilesSelected } = setup({ accept: 'image/*,.heic' });
    const group = screen.getByRole('group', { name: 'Imagens do produto' });
    const photo = file('foto.heic', '');

    fireEvent.dragOver(group, { dataTransfer: { types: ['Files'] } });
    expect(group).toHaveAttribute('data-dragging', 'true');
    fireEvent.dragLeave(group, { relatedTarget: document.body });
    expect(group).toHaveAttribute('data-dragging', 'false');

    fireEvent.drop(group, { dataTransfer: { types: ['Files'], files: [photo] } });

    expect(onFilesSelected).toHaveBeenCalledWith([photo]);
  });

  it('ignores drops that carry no files', () => {
    const { onFilesSelected } = setup();

    fireEvent.drop(screen.getByRole('group'), { dataTransfer: { types: ['text/plain'] } });

    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it('disables the drop zone once the limit is reached', async () => {
    const user = userEvent.setup();
    const { input, onFilesSelected } = setup({ images: IMAGES.slice(0, 2), maxFiles: 2 });
    const dropzone = screen.getByRole('button', { name: /^Adicionar imagens/ });

    expect(dropzone).toBeDisabled();
    expect(dropzone).toHaveAccessibleDescription('Limite de 2 imagens atingido. 2 de 2 imagens.');

    await user.upload(input, file('mais.webp', 'image/webp'));
    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('mais.webp: o limite é de 2 imagens.');
  });

  it('shows the cover, the progress, the processing state and the error with retry', async () => {
    const user = userEvent.setup();
    const { onRetry } = setup({
      images: [...IMAGES, { id: 'd', src: 'd.webp', status: 'processing' }],
    });

    expect(within(tiles()[0] ?? document.body).getByText('Capa')).toBeInTheDocument();
    expect(screen.getAllByText('Capa')).toHaveLength(1);
    expect(screen.getByRole('img', { name: 'Bolo de cenoura' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Imagem 2' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Enviando imagem 2' })).toHaveAttribute(
      'aria-valuenow',
      '40'
    );
    expect(screen.getByRole('status', { name: 'Processando…' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('A conexão caiu. Tente de novo.');

    await user.click(screen.getByRole('button', { name: 'Tentar de novo: imagem 3' }));
    expect(onRetry).toHaveBeenCalledWith('c');
  });

  it('shows an indeterminate bar without progress and clamps the value', () => {
    setup({
      images: [
        { id: 'a', src: 'a.webp', status: 'uploading' },
        { id: 'b', src: 'b.webp', status: 'uploading', progress: 140 },
        { id: 'c', src: 'c.webp', status: 'error' },
      ],
    });

    expect(screen.getByRole('progressbar', { name: 'Enviando imagem 1' })).not.toHaveAttribute(
      'aria-valuenow'
    );
    expect(screen.getByRole('progressbar', { name: 'Enviando imagem 2' })).toHaveAttribute(
      'aria-valuenow',
      '100'
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível enviar.');
  });

  it('moves with the buttons, announces it and keeps the focus on the moved image', async () => {
    const user = userEvent.setup();
    render(<Reorderable />);

    expect(screen.getByRole('button', { name: 'Mover imagem 1 para a esquerda' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Mover imagem 3 para a direita' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Mover imagem 1 para a direita' }));

    expect(tiles().map((tile) => tile.dataset.imageId)).toEqual(['b', 'a', 'c']);
    expect(screen.getByText('Imagem 1 movida para a posição 2 de 3.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mover imagem 2 para a direita' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Mover imagem 2 para a direita' }));

    // At the end the right button is disabled, so the focus falls back to the left one.
    expect(tiles().map((tile) => tile.dataset.imageId)).toEqual(['b', 'c', 'a']);
    expect(screen.getByRole('button', { name: 'Mover imagem 3 para a esquerda' })).toHaveFocus();
  });

  it('moves left with the keyboard and keeps the focus on the left button', async () => {
    const user = userEvent.setup();
    render(<Reorderable />);

    screen.getByRole('button', { name: 'Mover imagem 3 para a esquerda' }).focus();
    await user.keyboard('{Enter}');

    expect(tiles().map((tile) => tile.dataset.imageId)).toEqual(['a', 'c', 'b']);
    expect(screen.getByText('Imagem 3 movida para a posição 2 de 3.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mover imagem 2 para a esquerda' })).toHaveFocus();
  });

  it('removes an image, announces it and moves the focus to the drop zone', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Reorderable onRemove={onRemove} />);

    await user.click(screen.getByRole('button', { name: 'Remover imagem 2' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(tiles()).toHaveLength(2);
    expect(screen.getByText('Imagem 2 removida.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Adicionar imagens/ })).toHaveFocus();
  });

  it('reorders by dragging a tile onto another', () => {
    const { onReorder, onFilesSelected } = setup();
    const [first, , third] = tiles();
    if (first === undefined || third === undefined) throw new Error('tiles not rendered');
    const dataTransfer = { setData: vi.fn(), types: ['text/plain'], effectAllowed: 'all' };

    fireEvent.dragStart(third, { dataTransfer });
    fireEvent.dragOver(first, { dataTransfer });
    expect(first).toHaveAttribute('data-drop-target', 'true');
    fireEvent.dragLeave(first, { dataTransfer });
    expect(first).toHaveAttribute('data-drop-target', 'false');
    fireEvent.drop(first, { dataTransfer });
    fireEvent.dragEnd(third, { dataTransfer });

    expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'c');
    expect(onReorder).toHaveBeenCalledWith(['c', 'a', 'b']);
    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(screen.getByText('Imagem 3 movida para a posição 1 de 3.')).toBeInTheDocument();
  });

  it('ignores a tile drag over or drop that did not start on a tile', () => {
    const { onReorder } = setup();
    const [first] = tiles();
    if (first === undefined) throw new Error('tiles not rendered');

    fireEvent.dragOver(first, { dataTransfer: { types: ['text/plain'] } });
    fireEvent.drop(first, { dataTransfer: { types: ['text/plain'] } });

    expect(first).toHaveAttribute('data-drop-target', 'false');
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('takes files dropped on a tile, since the drop zone is the whole uploader', () => {
    const { onFilesSelected, onReorder } = setup();
    const [first] = tiles();
    if (first === undefined) throw new Error('tiles not rendered');
    const photo = file('bolo.webp', 'image/webp');

    fireEvent.dragOver(first, { dataTransfer: { types: ['Files'] } });
    fireEvent.drop(first, { dataTransfer: { types: ['Files'], files: [photo] } });

    expect(first).toHaveAttribute('data-drop-target', 'false');
    expect(onFilesSelected).toHaveBeenCalledWith([photo]);
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('does nothing when a tile is dropped back on itself', () => {
    const { onReorder } = setup();
    const [first] = tiles();
    if (first === undefined) throw new Error('tiles not rendered');
    const dataTransfer = { setData: vi.fn(), types: ['text/plain'], effectAllowed: 'all' };

    fireEvent.dragStart(first, { dataTransfer });
    fireEvent.drop(first, { dataTransfer });

    expect(onReorder).not.toHaveBeenCalled();
    expect(screen.queryByText(/movida para a posição/)).not.toBeInTheDocument();
  });

  it('has no accessibility violations, empty and with every status', async () => {
    const { container, rerender } = render(
      <main>
        <ImageUploader
          aria-label="Imagens do produto"
          images={[]}
          accept="image/webp"
          maxSize={MB}
          maxFiles={1}
          onFilesSelected={vi.fn()}
          onRemove={vi.fn()}
          onRetry={vi.fn()}
          onReorder={vi.fn()}
        />
      </main>
    );
    expect(screen.getByRole('button', { name: /^Adicionar imagens/ })).toHaveAccessibleDescription(
      'WEBP, até 1 MB cada. 0 de 1 imagem.'
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <main>
        <ImageUploader
          aria-label="Imagens do produto"
          images={[...IMAGES, { id: 'd', src: 'd.webp', status: 'processing' }]}
          accept="image/webp"
          maxSize={MB}
          maxFiles={4}
          onFilesSelected={vi.fn()}
          onRemove={vi.fn()}
          onRetry={vi.fn()}
          onReorder={vi.fn()}
        />
      </main>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
