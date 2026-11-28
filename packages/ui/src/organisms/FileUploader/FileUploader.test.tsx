import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { FileUploader, type FileUploaderItem, type FileUploaderProps } from './FileUploader';

const KB = 1024;
const MB = KB * KB;
const ITEMS: FileUploaderItem[] = [
  { id: 'a', name: 'aula-1.mp4', sizeBytes: 312.4 * MB, status: 'ready' },
  { id: 'b', name: 'aula-2.mp4', sizeBytes: 800 * KB, status: 'uploading', progress: 40 },
  {
    id: 'c',
    name: 'aula-3.mp4',
    sizeBytes: 2 * KB * MB,
    status: 'error',
    error: 'A conexão caiu.',
  },
];

function file(name: string, size = 1024): File {
  const created = new File(['x'], name);
  Object.defineProperty(created, 'size', { value: size });
  return created;
}

function setup(props: Partial<FileUploaderProps> = {}) {
  const handlers = { onFilesSelected: vi.fn(), onRemove: vi.fn(), onRetry: vi.fn() };
  const view = render(
    <main>
      <FileUploader
        aria-label="Vídeos do curso"
        items={ITEMS}
        accept=".mp4"
        maxSize={500 * MB}
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

// Keeps the list in state, as the app would, so focus and announcements can be checked.
function Stateful({
  initial = ITEMS,
  onRemove,
}: {
  initial?: FileUploaderItem[];
  onRemove?: () => void;
}) {
  const [items, setItems] = useState(initial);
  return (
    <>
      <FileUploader
        items={items}
        accept=".mp4"
        maxSize={MB}
        maxFiles={5}
        onFilesSelected={vi.fn()}
        onRetry={vi.fn()}
        onRemove={(id) => {
          onRemove?.();
          setItems((list) => list.filter((item) => item.id !== id));
        }}
        onReorder={(ids) => {
          setItems(ids.flatMap((id) => items.filter((item) => item.id === id)));
        }}
      />
      <button
        type="button"
        onClick={() => {
          setItems((list) =>
            list.map((item) => {
              if (item.id === 'a') return { ...item, status: 'processing' };
              if (item.id === 'b') return { ...item, status: 'ready', progress: 100 };
              return item;
            })
          );
        }}
      >
        advance
      </button>
      <button
        type="button"
        onClick={() => {
          setItems((list) =>
            list.map((item) =>
              item.id === 'a' ? { ...item, status: 'error', error: undefined } : item
            )
          );
        }}
      >
        fail
      </button>
    </>
  );
}

const rows = () => within(screen.getByRole('list')).getAllByRole('listitem');

describe('FileUploader', () => {
  it('describes the drop zone with the copy, the accepted types, the size and the count', () => {
    setup({ accept: '.zip,.rar', title: 'Adicionar arquivos digitais', description: 'Ou clique' });

    const dropzone = screen.getByRole('button', { name: 'Adicionar arquivos digitais Ou clique' });
    expect(dropzone).toHaveAccessibleDescription('ZIP ou RAR, até 500 MB cada. 3 de 5 arquivos.');
  });

  it('shows the name, the size in pt-BR and each status', () => {
    setup({
      items: [...ITEMS, { id: 'd', name: 'aula-4.mp4', sizeBytes: MB, status: 'processing' }],
    });

    expect(screen.getByText('312,4 MB')).toBeInTheDocument();
    expect(screen.getByText('800 KB')).toBeInTheDocument();
    expect(screen.getByText('2 GB')).toBeInTheDocument();
    expect(within(rows()[0] ?? document.body).getByText('Enviado')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Enviando aula-2.mp4' })).toHaveAttribute(
      'aria-valuenow',
      '40'
    );
    expect(screen.getByText('Enviando… 40%')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Verificando…' })).toBeInTheDocument();
    expect(screen.getByText('A conexão caiu.')).toBeInTheDocument();
  });

  it('shows the empty hint while there are no files', () => {
    setup({ items: [], emptyHint: 'Nenhum vídeo adicionado ainda.' });

    expect(screen.getByText('Nenhum vídeo adicionado ainda.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('opens the file picker on click and with the keyboard, and Esc does nothing', async () => {
    const user = userEvent.setup();
    const { input, onFilesSelected, onRemove } = setup();
    const click = vi.spyOn(input, 'click');

    await user.click(screen.getByRole('button', { name: /^Adicionar arquivos/ }));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    await user.keyboard('{Escape}');

    expect(click).toHaveBeenCalledTimes(3);
    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it('sends only the valid files and lists why the others were refused', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const { input, onFilesSelected } = setup({
      items: ITEMS.slice(0, 2),
      accept: '.zip,.rar',
      maxFiles: 4,
    });
    const good = file('receitas.ZIP');
    const fits = file('bonus.rar');

    await user.upload(input, [
      good,
      file('aula.mp4'),
      file('enorme.zip', 501 * MB),
      fits,
      file('extra.zip'),
    ]);

    expect(onFilesSelected).toHaveBeenCalledWith([good, fits]);
    const alert = screen.getByRole('alert');
    expect(
      within(alert)
        .getAllByRole('listitem')
        .map((item) => item.textContent)
    ).toEqual([
      'aula.mp4: tipo não aceito. Envie ZIP ou RAR.',
      'enorme.zip: maior que 500 MB.',
      'extra.zip: o limite é de 4 arquivos.',
    ]);
    expect(screen.getByText('2 arquivos adicionados.')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('accepts files dropped anywhere on it and marks the drag over', () => {
    const { onFilesSelected } = setup();
    const group = screen.getByRole('group', { name: 'Vídeos do curso' });
    const video = file('aula-5.mp4');

    fireEvent.dragOver(group, { dataTransfer: { types: ['Files'] } });
    expect(group).toHaveAttribute('data-dragging', 'true');
    fireEvent.dragLeave(group, { relatedTarget: document.body });
    expect(group).toHaveAttribute('data-dragging', 'false');

    fireEvent.drop(group, { dataTransfer: { types: ['Files'], files: [video] } });

    expect(onFilesSelected).toHaveBeenCalledWith([video]);
    expect(screen.getByText('1 arquivo adicionado.')).toBeInTheDocument();
  });

  it('ignores drops that carry no files', () => {
    const { onFilesSelected } = setup();

    fireEvent.drop(screen.getByRole('group'), { dataTransfer: { types: ['text/plain'] } });

    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it('disables the drop zone once the limit is reached', async () => {
    const user = userEvent.setup();
    const { input, onFilesSelected } = setup({ items: ITEMS.slice(0, 1), maxFiles: 1 });
    const dropzone = screen.getByRole('button', { name: /^Adicionar arquivos/ });

    expect(dropzone).toBeDisabled();
    expect(dropzone).toHaveAccessibleDescription('Limite de 1 arquivo atingido. 1 de 1 arquivo.');

    await user.upload(input, file('mais.mp4'));
    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('mais.mp4: o limite é de 1 arquivo.');
  });

  it('retries a failed file', async () => {
    const user = userEvent.setup();
    const { onRetry } = setup();

    await user.click(screen.getByRole('button', { name: 'Tentar de novo: aula-3.mp4' }));

    expect(onRetry).toHaveBeenCalledWith('c');
  });

  it('shows an indeterminate bar without progress, clamps the value and has a default error', () => {
    setup({
      items: [
        { id: 'a', name: 'a.mp4', sizeBytes: MB, status: 'uploading' },
        { id: 'b', name: 'b.mp4', sizeBytes: MB, status: 'uploading', progress: 140 },
        { id: 'c', name: 'c.mp4', sizeBytes: MB, status: 'error' },
      ],
    });

    expect(screen.getByRole('progressbar', { name: 'Enviando a.mp4' })).not.toHaveAttribute(
      'aria-valuenow'
    );
    expect(screen.getByText('Enviando…')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Enviando b.mp4' })).toHaveAttribute(
      'aria-valuenow',
      '100'
    );
    expect(screen.getByText('Não foi possível enviar.')).toBeInTheDocument();
  });

  it('announces status changes politely, without the progress ticks', async () => {
    const user = userEvent.setup();
    render(<Stateful />);

    await user.click(screen.getByRole('button', { name: 'advance' }));
    expect(screen.getByText('Verificando aula-1.mp4… aula-2.mp4 enviado.')).toHaveAttribute(
      'aria-live',
      'polite'
    );

    await user.click(screen.getByRole('button', { name: 'fail' }));
    expect(screen.getByText('aula-1.mp4: não foi possível enviar.')).toBeInTheDocument();
  });

  it('does not announce a retry going back to uploading', () => {
    const failed: FileUploaderItem = { id: 'c', name: 'c.mp4', sizeBytes: MB, status: 'error' };
    const { rerender } = setup({ items: [{ ...failed, status: 'uploading' }] });
    const show = (items: FileUploaderItem[]) => {
      rerender(
        <main>
          <FileUploader
            items={items}
            accept=".mp4"
            maxSize={MB}
            maxFiles={5}
            onFilesSelected={vi.fn()}
            onRemove={vi.fn()}
            onRetry={vi.fn()}
          />
        </main>
      );
    };

    show([failed]);
    expect(screen.getByText('c.mp4: não foi possível enviar.')).toHaveAttribute(
      'aria-live',
      'polite'
    );

    show([{ ...failed, status: 'uploading', progress: 10 }]);
    expect(screen.getByText('c.mp4: não foi possível enviar.')).toHaveAttribute(
      'aria-live',
      'polite'
    );
  });

  it('hides the move controls when onReorder is not given', () => {
    setup();

    expect(screen.queryByRole('button', { name: /^Mover/ })).not.toBeInTheDocument();
    expect(rows()[0]).toHaveAttribute('draggable', 'false');
  });

  it('moves with the buttons, announces it and keeps the focus on the moved file', async () => {
    const user = userEvent.setup();
    render(<Stateful />);

    expect(screen.getByRole('button', { name: 'Mover aula-1.mp4 para cima' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Mover aula-3.mp4 para baixo' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Mover aula-1.mp4 para baixo' }));

    expect(rows().map((row) => row.dataset.itemId)).toEqual(['b', 'a', 'c']);
    expect(
      screen.getByText('Arquivo aula-1.mp4 movido para a posição 2 de 3.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mover aula-1.mp4 para baixo' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Mover aula-1.mp4 para baixo' }));

    // At the end the down button is disabled, so the focus falls back to the up one.
    expect(rows().map((row) => row.dataset.itemId)).toEqual(['b', 'c', 'a']);
    expect(screen.getByRole('button', { name: 'Mover aula-1.mp4 para cima' })).toHaveFocus();
  });

  it('moves up with the keyboard and keeps the focus on the up button', async () => {
    const user = userEvent.setup();
    render(<Stateful />);

    screen.getByRole('button', { name: 'Mover aula-3.mp4 para cima' }).focus();
    await user.keyboard('{Enter}');

    expect(rows().map((row) => row.dataset.itemId)).toEqual(['a', 'c', 'b']);
    expect(screen.getByRole('button', { name: 'Mover aula-3.mp4 para cima' })).toHaveFocus();
  });

  it('removes a file, announces it and moves the focus to the drop zone', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Stateful onRemove={onRemove} />);

    await user.click(screen.getByRole('button', { name: 'Remover aula-2.mp4' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(rows()).toHaveLength(2);
    expect(screen.getByText('Arquivo aula-2.mp4 removido.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Adicionar arquivos/ })).toHaveFocus();
  });

  it('reorders by dragging a row onto another', () => {
    const onReorder = vi.fn();
    const { onFilesSelected } = setup({ onReorder });
    const [first, , third] = rows();
    if (first === undefined || third === undefined) throw new Error('rows not rendered');
    const dataTransfer = { setData: vi.fn(), types: ['text/plain'], effectAllowed: 'all' };

    expect(first).toHaveAttribute('draggable', 'true');
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
  });

  it('ignores a row drag over or drop that did not start on a row', () => {
    const onReorder = vi.fn();
    setup({ onReorder });
    const [first] = rows();
    if (first === undefined) throw new Error('rows not rendered');

    fireEvent.dragOver(first, { dataTransfer: { types: ['text/plain'] } });
    fireEvent.drop(first, { dataTransfer: { types: ['text/plain'] } });

    expect(first).toHaveAttribute('data-drop-target', 'false');
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('does nothing when a row is dropped back on itself', () => {
    const onReorder = vi.fn();
    setup({ onReorder });
    const [first] = rows();
    if (first === undefined) throw new Error('rows not rendered');
    const dataTransfer = { setData: vi.fn(), types: ['text/plain'], effectAllowed: 'all' };

    fireEvent.dragStart(first, { dataTransfer });
    fireEvent.drop(first, { dataTransfer });

    expect(onReorder).not.toHaveBeenCalled();
    expect(screen.queryByText(/movido para a posição/)).not.toBeInTheDocument();
  });

  it('has no accessibility violations, empty and with every status', async () => {
    const { container, rerender } = render(
      <main>
        <FileUploader
          aria-label="Arquivos do produto"
          items={[]}
          accept=".zip,.rar"
          maxSize={500 * MB}
          maxFiles={10}
          onFilesSelected={vi.fn()}
          onRemove={vi.fn()}
          onRetry={vi.fn()}
        />
      </main>
    );
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <main>
        <FileUploader
          aria-label="Vídeos do curso"
          items={[...ITEMS, { id: 'd', name: 'aula-4.mp4', sizeBytes: MB, status: 'processing' }]}
          accept=".mp4"
          maxSize={500 * MB}
          maxFiles={10}
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
