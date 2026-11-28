import { ChevronDown, ChevronUp, FileIcon, FileUp, Trash2 } from 'lucide-react';
import { Progress } from 'radix-ui';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type DragEvent,
} from 'react';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import { Spinner } from '../../atoms/Spinner/Spinner';
import { cn } from '../../utils/cn';
import { formatFileSize, formatTypes, matchesAccept, moved, plural } from '../../utils/files';
import {
  fileUploaderDropzoneVariants,
  fileUploaderListVariants,
  fileUploaderProgressVariants,
  fileUploaderRowVariants,
  fileUploaderVariants,
} from './FileUploader.variants';

export type FileUploaderStatus = 'uploading' | 'processing' | 'ready' | 'error';

export type FileUploaderItem = {
  id: string;
  name: string;
  sizeBytes: number;
  status: FileUploaderStatus;
  /** Upload progress from 0 to 100; without it the bar is indeterminate. */
  progress?: number | undefined;
  error?: string | undefined;
  /** Shown while processing; defaults to "Verificando…". */
  processingLabel?: string | undefined;
  /** False hides "Tentar de novo" on an error that only a new file fixes; remove stays. */
  retryable?: boolean | undefined;
};

export type FileUploaderProps = Omit<ComponentProps<'div'>, 'children' | 'title'> & {
  /** In display order. */
  items: readonly FileUploaderItem[];
  /** Only the files that passed `accept`, `maxSize` and `maxFiles`. */
  onFilesSelected: (files: File[]) => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  /** All the ids in the new order; the move controls show only when it is given. */
  onReorder?: ((ids: string[]) => void) | undefined;
  /** Same syntax as the input: `.zip,.rar`, `video/mp4` or `video/*`. */
  accept: string;
  /** Largest file in bytes. */
  maxSize: number;
  maxFiles: number;
  title?: string | undefined;
  description?: string | undefined;
  /** Shown while the list is empty. */
  emptyHint?: string | undefined;
};

type PendingFocus = { id: string; move: 'up' | 'down' } | 'dropzone' | null;

function statusMessage(item: FileUploaderItem): string {
  if (item.status === 'processing')
    return item.processingLabel === undefined
      ? `Verificando ${item.name}…`
      : `${item.name}: ${item.processingLabel}`;
  if (item.status === 'ready') return `${item.name} enviado.`;
  if (item.status === 'error') return `${item.name}: ${item.error ?? 'não foi possível enviar.'}`;
  return '';
}

// Only status changes are announced: progress ticks would flood the screen reader.
function describeChanges(before: readonly FileUploaderItem[], after: readonly FileUploaderItem[]) {
  return after
    .filter((item) => {
      const old = before.find((previous) => previous.id === item.id);
      return old !== undefined && old.status !== item.status;
    })
    .map(statusMessage)
    .filter(Boolean)
    .join(' ');
}

/** File list with drop zone, progress, retry and optional reorder; the app does the upload. */
export function FileUploader({
  className,
  items,
  onFilesSelected,
  onRemove,
  onRetry,
  onReorder,
  accept,
  maxSize,
  maxFiles,
  title = 'Adicionar arquivos',
  description = 'Arraste para cá ou clique para escolher',
  emptyHint = 'Nenhum arquivo adicionado ainda.',
  ...props
}: FileUploaderProps) {
  const hintId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLButtonElement>(null);
  const draggedId = useRef<string | null>(null);
  const pendingFocus = useRef<PendingFocus>(null);
  const [fileDragging, setFileDragging] = useState(false);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [rejections, setRejections] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [seen, setSeen] = useState(items);

  if (seen !== items) {
    setSeen(items);
    const changes = describeChanges(seen, items);
    if (changes) setAnnouncement(changes);
  }

  const types = formatTypes(accept);
  const size = formatFileSize(maxSize);
  const full = items.length >= maxFiles;
  const reorderable = onReorder !== undefined;

  // React moves reordered nodes, which drops their focus; put it back on the control that was used.
  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target === 'dropzone') dropzoneRef.current?.focus();
    if (target === null || target === 'dropzone') return;
    const row = [...(rootRef.current?.querySelectorAll('li') ?? [])].find(
      (item) => item.dataset.itemId === target.id
    );
    const buttons = [...(row?.querySelectorAll<HTMLButtonElement>('[data-move]') ?? [])];
    const button =
      buttons.find((item) => item.dataset.move === target.move && !item.disabled) ??
      buttons.find((item) => !item.disabled);
    button?.focus();
  }, [items]);

  function addFiles(files: File[]) {
    const accepted: File[] = [];
    const rejected: string[] = [];
    for (const file of files) {
      if (!matchesAccept(file, accept))
        rejected.push(`${file.name}: tipo não aceito. Envie ${types}.`);
      else if (file.size > maxSize) rejected.push(`${file.name}: maior que ${size}.`);
      else if (items.length + accepted.length >= maxFiles)
        rejected.push(`${file.name}: o limite é de ${plural(maxFiles, 'arquivo', 'arquivos')}.`);
      else accepted.push(file);
    }
    setRejections(rejected);
    if (accepted.length === 0) return;
    setAnnouncement(`${plural(accepted.length, 'arquivo adicionado', 'arquivos adicionados')}.`);
    onFilesSelected(accepted);
  }

  function reorder(from: number, to: number, focus?: PendingFocus) {
    const item = items[from];
    if (item === undefined || to < 0 || to >= items.length || from === to) return;
    pendingFocus.current = focus ?? null;
    setAnnouncement(
      `Arquivo ${item.name} movido para a posição ${String(to + 1)} de ${String(items.length)}.`
    );
    onReorder?.(moved(items, from, to).map((entry) => entry.id));
  }

  function remove(item: FileUploaderItem) {
    pendingFocus.current = 'dropzone';
    setAnnouncement(`Arquivo ${item.name} removido.`);
    onRemove(item.id);
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles([...(event.target.files ?? [])]);
    // Lets the same file be picked again after it was refused or removed.
    event.target.value = '';
  }

  function isFileDrag(event: DragEvent) {
    return draggedId.current === null && event.dataTransfer.types.includes('Files');
  }

  function onRootDragOver(event: DragEvent<HTMLDivElement>) {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    setFileDragging(true);
  }

  function onRootDragLeave(event: DragEvent<HTMLDivElement>) {
    const to = event.relatedTarget;
    if (!(to instanceof Node && event.currentTarget.contains(to))) setFileDragging(false);
  }

  // The whole uploader takes the drop, so a near miss does not open the file in the tab.
  function onRootDrop(event: DragEvent<HTMLDivElement>) {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    setFileDragging(false);
    addFiles([...event.dataTransfer.files]);
  }

  function onRowDrop(event: DragEvent<HTMLLIElement>, index: number) {
    const from = items.findIndex((item) => item.id === draggedId.current);
    if (from === -1) return;
    event.preventDefault();
    event.stopPropagation();
    setDropTarget(null);
    reorder(from, index);
  }

  return (
    // Drag and drop is for pointers only; the dropzone button and the move buttons are the keyboard path.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={rootRef}
      role="group"
      data-slot="file-uploader"
      data-dragging={fileDragging}
      className={cn('group', fileUploaderVariants(), className)}
      onDragOver={onRootDragOver}
      onDragLeave={onRootDragLeave}
      onDrop={onRootDrop}
      {...props}
    >
      <button
        ref={dropzoneRef}
        type="button"
        data-slot="file-uploader-dropzone"
        aria-describedby={hintId}
        disabled={full}
        className={fileUploaderDropzoneVariants()}
        onClick={() => inputRef.current?.click()}
      >
        <FileUp aria-hidden="true" className="size-8 text-muted-foreground" />
        <span className="text-body font-semibold">{title}</span>{' '}
        {!full && <span className="text-small text-muted-foreground">{description}</span>}
      </button>
      <p id={hintId} className="-mt-2 text-small text-muted-foreground">
        {full
          ? `Limite de ${plural(maxFiles, 'arquivo atingido', 'arquivos atingido')}.`
          : `${types}, até ${size} cada.`}{' '}
        {`${String(items.length)} de ${plural(maxFiles, 'arquivo', 'arquivos')}.`}
      </p>
      <input
        ref={inputRef}
        data-slot="file-uploader-input"
        type="file"
        accept={accept}
        multiple
        hidden
        tabIndex={-1}
        onChange={onInputChange}
      />
      {rejections.length > 0 && (
        <div role="alert">
          <ul className="flex flex-col gap-1 text-small font-semibold text-destructive wrap-anywhere">
            {rejections.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      {items.length === 0 ? (
        <p className="text-small text-muted-foreground">{emptyHint}</p>
      ) : (
        <ul data-slot="file-uploader-list" className={fileUploaderListVariants()}>
          {items.map((item, index) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- see the root
            <li
              key={item.id}
              data-item-id={item.id}
              data-drop-target={dropTarget === item.id}
              draggable={reorderable}
              className={fileUploaderRowVariants()}
              onDragStart={(event) => {
                draggedId.current = item.id;
                // Firefox starts a drag only when it carries data.
                event.dataTransfer.setData('text/plain', item.id);
                event.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(event) => {
                if (draggedId.current === null) return;
                event.preventDefault();
                setDropTarget(item.id);
              }}
              onDragLeave={() => {
                setDropTarget(null);
              }}
              onDrop={(event) => {
                onRowDrop(event, index);
              }}
              onDragEnd={() => {
                draggedId.current = null;
                setDropTarget(null);
              }}
            >
              <div className="flex items-start gap-3">
                <FileIcon
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-body font-semibold wrap-anywhere">{item.name}</span>
                  <span className="text-small text-muted-foreground">
                    {formatFileSize(item.sizeBytes)}
                  </span>
                </div>
                <div className="flex shrink-0">
                  {reorderable && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        data-move="up"
                        aria-label={`Mover ${item.name} para cima`}
                        disabled={index === 0}
                        onClick={() => {
                          reorder(index, index - 1, { id: item.id, move: 'up' });
                        }}
                      >
                        <ChevronUp aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        data-move="down"
                        aria-label={`Mover ${item.name} para baixo`}
                        disabled={index === items.length - 1}
                        onClick={() => {
                          reorder(index, index + 1, { id: item.id, move: 'down' });
                        }}
                      >
                        <ChevronDown aria-hidden="true" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover ${item.name}`}
                    onClick={() => {
                      remove(item);
                    }}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <ItemStatus item={item} onRetry={onRetry} />
            </li>
          ))}
        </ul>
      )}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

type ItemStatusProps = {
  item: FileUploaderItem;
  onRetry: (id: string) => void;
};

function ItemStatus({ item, onRetry }: ItemStatusProps) {
  if (item.status === 'uploading') {
    const value =
      item.progress === undefined ? null : Math.min(100, Math.max(0, Math.round(item.progress)));
    return (
      <div className="flex flex-col gap-1">
        <Progress.Root
          value={value}
          aria-label={`Enviando ${item.name}`}
          className={fileUploaderProgressVariants()}
        >
          <Progress.Indicator
            className="h-full w-full bg-primary motion-safe:transition-transform"
            // The only runtime value: how much of the bar is filled.
            style={{ transform: `translateX(-${String(100 - (value ?? 0))}%)` }}
          />
        </Progress.Root>
        <span aria-hidden="true" className="text-small text-muted-foreground">
          {value === null ? 'Enviando…' : `Enviando… ${String(value)}%`}
        </span>
      </div>
    );
  }
  if (item.status === 'processing')
    return (
      <Spinner
        size="sm"
        label={item.processingLabel ?? 'Verificando…'}
        showLabel
        className="text-muted-foreground"
      />
    );
  if (item.status === 'error')
    return (
      // No role="alert" here: the polite live region of the uploader already announces it.
      <div className="flex flex-col items-start gap-2">
        <p className="text-small font-semibold text-destructive">
          {item.error ?? 'Não foi possível enviar.'}
        </p>
        {item.retryable !== false && (
          <Button
            variant="outline"
            size="sm"
            aria-label={`Tentar de novo: ${item.name}`}
            onClick={() => {
              onRetry(item.id);
            }}
          >
            Tentar de novo
          </Button>
        )}
      </div>
    );
  return (
    <Badge variant="success" className="self-start">
      Enviado
    </Badge>
  );
}
