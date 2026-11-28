import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import type { ImageUploaderImage } from '../ImageUploader/ImageUploader';
import { SingleImageUploader, type SingleImageUploaderProps } from './SingleImageUploader';

const MB = 1024 * 1024;
const LOGO: ImageUploaderImage = {
  id: 'logo',
  src: 'logo.png',
  alt: 'Logo da Doces da Ana',
  status: 'ready',
};

function file(name: string, type: string, size = 1024): File {
  const created = new File(['x'], name, { type });
  Object.defineProperty(created, 'size', { value: size });
  return created;
}

function setup(props: Partial<SingleImageUploaderProps> = {}) {
  const handlers = { onFileSelected: vi.fn(), onRemove: vi.fn(), onRetry: vi.fn() };
  const view = render(
    <main>
      <SingleImageUploader
        aria-label="Logo da loja"
        image={LOGO}
        accept="image/jpeg,image/png,image/webp"
        maxSize={2 * MB}
        {...handlers}
        {...props}
      />
    </main>
  );
  const input = view.container.querySelector<HTMLInputElement>('input[type="file"]');
  if (input === null) throw new Error('file input not rendered');
  return { ...handlers, ...view, input };
}

// Keeps the image in state, as the app would, so focus and announcements can be checked.
function Stateful() {
  const [image, setImage] = useState<ImageUploaderImage | undefined>(LOGO);
  return (
    <SingleImageUploader
      aria-label="Logo da loja"
      image={image}
      accept="image/png"
      maxSize={MB}
      onFileSelected={(picked) => {
        setImage({ id: picked.name, src: picked.name, status: 'uploading' });
      }}
      onRemove={() => {
        setImage(undefined);
      }}
      onRetry={vi.fn()}
    />
  );
}

describe('SingleImageUploader', () => {
  it('without an image, shows one drop zone for a single file with the types and size', async () => {
    const user = userEvent.setup();
    const { input } = setup({ image: undefined });
    const click = vi.spyOn(input, 'click');
    const dropzone = screen.getByRole('button', {
      name: 'Adicionar imagem Arraste para cá ou clique para escolher',
    });

    await user.click(dropzone);
    await user.keyboard('{Enter}');

    expect(click).toHaveBeenCalledTimes(2);
    expect(dropzone).toHaveAccessibleDescription('JPEG, PNG ou WEBP, até 2 MB.');
    expect(input).not.toHaveAttribute('multiple');
    expect(screen.queryByRole('button', { name: 'Remover' })).not.toBeInTheDocument();
  });

  it('shows the whole image with Trocar and Remover, and no cover or reorder', async () => {
    const user = userEvent.setup();
    const { input, onRemove } = setup();
    const click = vi.spyOn(input, 'click');

    expect(screen.getByRole('img', { name: 'Logo da Doces da Ana' })).toBeInTheDocument();
    expect(screen.queryByText('Capa')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Mover/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trocar' })).toHaveAccessibleDescription(
      'JPEG, PNG ou WEBP, até 2 MB.'
    );

    await user.click(screen.getByRole('button', { name: 'Trocar' }));
    await user.click(screen.getByRole('button', { name: 'Remover' }));

    expect(click).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('sends a valid file, announces the replacement and clears the input', async () => {
    const user = userEvent.setup();
    const { input, onFileSelected } = setup();
    const logo = file('logo-novo.webp', 'image/webp');

    await user.upload(input, logo);

    expect(onFileSelected).toHaveBeenCalledWith(logo);
    expect(screen.getByText('Imagem trocada.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('announces an added image when there was none', async () => {
    const user = userEvent.setup();
    const { input } = setup({ image: undefined });

    await user.upload(input, file('logo.png', 'image/png'));

    expect(screen.getByText('1 imagem adicionada.')).toBeInTheDocument();
  });

  it('refuses a wrong type, a large file and several files in pt-BR', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const { input, onFileSelected } = setup();
    const group = screen.getByRole('group', { name: 'Logo da loja' });

    await user.upload(input, file('logo.svg', 'image/svg+xml'));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'logo.svg: tipo não aceito. Envie JPEG, PNG ou WEBP.'
    );

    await user.upload(input, file('grande.png', 'image/png', 3 * MB));
    expect(screen.getByRole('alert')).toHaveTextContent('grande.png: maior que 2 MB.');

    fireEvent.drop(group, {
      dataTransfer: {
        types: ['Files'],
        files: [file('a.png', 'image/png'), file('b.png', 'image/png')],
      },
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Envie só uma imagem.');
    expect(onFileSelected).not.toHaveBeenCalled();
  });

  it('replaces the image with a file dropped on it and marks the drag over', () => {
    const { onFileSelected } = setup();
    const group = screen.getByRole('group', { name: 'Logo da loja' });
    const logo = file('logo.png', 'image/png');

    fireEvent.dragOver(group, { dataTransfer: { types: ['Files'] } });
    expect(group).toHaveAttribute('data-dragging', 'true');
    fireEvent.dragLeave(group, { relatedTarget: document.body });
    expect(group).toHaveAttribute('data-dragging', 'false');
    fireEvent.drop(group, { dataTransfer: { types: ['text/plain'], files: [] } });
    fireEvent.drop(group, { dataTransfer: { types: ['Files'], files: [logo] } });

    expect(onFileSelected).toHaveBeenCalledTimes(1);
    expect(onFileSelected).toHaveBeenCalledWith(logo);
  });

  it('shows the progress, the processing state and the error with retry', async () => {
    const user = userEvent.setup();
    const { rerender, onRetry } = setup({ image: { ...LOGO, status: 'uploading', progress: 40 } });

    expect(screen.getByRole('progressbar', { name: 'Enviando imagem' })).toHaveAttribute(
      'aria-valuenow',
      '40'
    );

    rerender(
      <SingleImageUploader
        image={{ ...LOGO, status: 'processing' }}
        accept="image/png"
        maxSize={MB}
        onFileSelected={vi.fn()}
        onRemove={vi.fn()}
        onRetry={onRetry}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent('Processando…');

    rerender(
      <SingleImageUploader
        image={{ ...LOGO, status: 'error', error: 'A conexão caiu.' }}
        accept="image/png"
        maxSize={MB}
        onFileSelected={vi.fn()}
        onRemove={vi.fn()}
        onRetry={onRetry}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('A conexão caiu.');
    await user.click(screen.getByRole('button', { name: 'Tentar de novo: imagem' }));
    expect(onRetry).toHaveBeenCalledWith();
  });

  it('after a removal announces it and moves the focus to the drop zone', async () => {
    const user = userEvent.setup();
    render(<Stateful />);

    await user.click(screen.getByRole('button', { name: 'Remover' }));

    expect(screen.getByRole('button', { name: /^Adicionar imagem/ })).toHaveFocus();
    expect(screen.getByText('Imagem removida.')).toBeInTheDocument();
  });

  it('has no accessibility violations, empty and with every status', async () => {
    const { container } = render(
      <main>
        {[
          undefined,
          LOGO,
          { ...LOGO, status: 'uploading' as const },
          { ...LOGO, status: 'processing' as const },
          { ...LOGO, status: 'error' as const },
        ].map((image, index) => (
          <SingleImageUploader
            key={String(index)}
            aria-label={`Logo ${String(index + 1)}`}
            image={image}
            accept="image/png"
            maxSize={MB}
            onFileSelected={vi.fn()}
            onRemove={vi.fn()}
            onRetry={vi.fn()}
          />
        ))}
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
