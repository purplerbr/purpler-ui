import { ChevronLeft, ChevronRight, ImageUp, Trash2 } from 'lucide-react';
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
  imageUploaderDropzoneVariants,
  imageUploaderListVariants,
  imageUploaderProgressVariants,
  imageUploaderTileVariants,
  imageUploaderVariants,
} from './ImageUploader.variants';

export type ImageUploaderStatus = 'uploading' | 'processing' | 'ready' | 'error';

export type ImageUploaderImage = {
  id: string;
  src: string;
  alt?: string | undefined;
  status: ImageUploaderStatus;
  /** Upload progress from 0 to 100; without it the bar is indeterminate. */
  progress?: number | undefined;
  error?: string | undefined;
};

export type ImageUploaderProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** In display order: the first one is the cover. */
  images: readonly ImageUploaderImage[];
  /** Only the files that passed `accept`, `maxSize` and `maxFiles`. */
  onFilesSelected: (files: File[]) => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  /** All the ids in the new order. */
  onReorder: (ids: string[]) => void;
  /** Same syntax as the input: `image/png,image/webp`, `image/*` or `.jpg`. */
  accept: string;
  /** Largest file in bytes. */
  maxSize: number;
  maxFiles: number;
};

type PendingFocus = { id: string; move: 'left' | 'right' } | 'dropzone' | null;

/** Image list with drop zone, progress, retry and reorder; the app does the upload. */
export function ImageUploader({
  className,
  images,
  onFilesSelected,
  onRemove,
  onRetry,
  onReorder,
  accept,
  maxSize,
  maxFiles,
  ...props
}: ImageUploaderProps) {
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

  const types = formatTypes(accept);
  const size = formatFileSize(maxSize);
  const full = images.length >= maxFiles;

  // React moves reordered nodes, which drops their focus; put it back on the control that was used.
  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;
    if (target === 'dropzone') dropzoneRef.current?.focus();
    if (target === null || target === 'dropzone') return;
    const tile = [...(rootRef.current?.querySelectorAll('li') ?? [])].find(
      (item) => item.dataset.imageId === target.id
    );
    const buttons = [...(tile?.querySelectorAll<HTMLButtonElement>('[data-move]') ?? [])];
    const button =
      buttons.find((item) => item.dataset.move === target.move && !item.disabled) ??
      buttons.find((item) => !item.disabled);
    button?.focus();
  }, [images]);

  function addFiles(files: File[]) {
    const accepted: File[] = [];
    const rejected: string[] = [];
    for (const file of files) {
      if (!matchesAccept(file, accept))
        rejected.push(`${file.name}: tipo não aceito. Envie ${types}.`);
      else if (file.size > maxSize) rejected.push(`${file.name}: maior que ${size}.`);
      else if (images.length + accepted.length >= maxFiles)
        rejected.push(`${file.name}: o limite é de ${plural(maxFiles, 'imagem', 'imagens')}.`);
      else accepted.push(file);
    }
    setRejections(rejected);
    if (accepted.length === 0) return;
    setAnnouncement(`${plural(accepted.length, 'imagem adicionada', 'imagens adicionadas')}.`);
    onFilesSelected(accepted);
  }

  function reorder(from: number, to: number, focus?: PendingFocus) {
    const image = images[from];
    if (image === undefined || to < 0 || to >= images.length || from === to) return;
    pendingFocus.current = focus ?? null;
    setAnnouncement(
      `Imagem ${String(from + 1)} movida para a posição ${String(to + 1)} de ${String(images.length)}.`
    );
    onReorder(moved(images, from, to).map((item) => item.id));
  }

  function remove(id: string, index: number) {
    pendingFocus.current = 'dropzone';
    setAnnouncement(`Imagem ${String(index + 1)} removida.`);
    onRemove(id);
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

  function onTileDrop(event: DragEvent<HTMLLIElement>, index: number) {
    const from = images.findIndex((item) => item.id === draggedId.current);
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
      data-slot="image-uploader"
      data-dragging={fileDragging}
      className={cn('group', imageUploaderVariants(), className)}
      onDragOver={onRootDragOver}
      onDragLeave={onRootDragLeave}
      onDrop={onRootDrop}
      {...props}
    >
      <button
        ref={dropzoneRef}
        type="button"
        data-slot="image-uploader-dropzone"
        aria-describedby={hintId}
        disabled={full}
        className={imageUploaderDropzoneVariants()}
        onClick={() => inputRef.current?.click()}
      >
        <ImageUp aria-hidden="true" className="size-8 text-muted-foreground" />
        <span className="text-body font-semibold">Adicionar imagens</span>{' '}
        {!full && (
          <span className="text-small text-muted-foreground">
            Arraste para cá ou clique para escolher
          </span>
        )}
      </button>
      <p id={hintId} className="-mt-2 text-small text-muted-foreground">
        {full
          ? `Limite de ${plural(maxFiles, 'imagem atingido', 'imagens atingido')}.`
          : `${types}, até ${size} cada.`}{' '}
        {`${String(images.length)} de ${plural(maxFiles, 'imagem', 'imagens')}.`}
      </p>
      <input
        ref={inputRef}
        data-slot="image-uploader-input"
        type="file"
        accept={accept}
        multiple
        hidden
        tabIndex={-1}
        onChange={onInputChange}
      />
      {rejections.length > 0 && (
        <div role="alert">
          <ul className="flex flex-col gap-1 text-small font-semibold text-destructive">
            {rejections.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}
      {images.length > 0 && (
        <ul data-slot="image-uploader-list" className={imageUploaderListVariants()}>
          {images.map((image, index) => {
            const name = `imagem ${String(index + 1)}`;
            return (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- see the root
              <li
                key={image.id}
                data-image-id={image.id}
                data-drop-target={dropTarget === image.id}
                draggable
                className={imageUploaderTileVariants()}
                onDragStart={(event) => {
                  draggedId.current = image.id;
                  // Firefox starts a drag only when it carries data.
                  event.dataTransfer.setData('text/plain', image.id);
                  event.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(event) => {
                  if (draggedId.current === null) return;
                  event.preventDefault();
                  setDropTarget(image.id);
                }}
                onDragLeave={() => {
                  setDropTarget(null);
                }}
                onDrop={(event) => {
                  onTileDrop(event, index);
                }}
                onDragEnd={() => {
                  draggedId.current = null;
                  setDropTarget(null);
                }}
              >
                <div className="relative">
                  <img
                    src={image.src}
                    alt={image.alt || `Imagem ${String(index + 1)}`}
                    draggable={false}
                    className="aspect-square w-full rounded-md bg-muted object-cover"
                  />
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2" variant="primary">
                      Capa
                    </Badge>
                  )}
                </div>
                <ImageStatus image={image} name={name} onRetry={onRetry} />
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      data-move="left"
                      aria-label={`Mover ${name} para a esquerda`}
                      disabled={index === 0}
                      onClick={() => {
                        reorder(index, index - 1, { id: image.id, move: 'left' });
                      }}
                    >
                      <ChevronLeft aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-move="right"
                      aria-label={`Mover ${name} para a direita`}
                      disabled={index === images.length - 1}
                      onClick={() => {
                        reorder(index, index + 1, { id: image.id, move: 'right' });
                      }}
                    >
                      <ChevronRight aria-hidden="true" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover ${name}`}
                    onClick={() => {
                      remove(image.id, index);
                    }}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

type ImageStatusProps = {
  image: ImageUploaderImage;
  name: string;
  onRetry: (id: string) => void;
};

export function ImageStatus({ image, name, onRetry }: ImageStatusProps) {
  if (image.status === 'uploading') {
    const value =
      image.progress === undefined ? null : Math.min(100, Math.max(0, Math.round(image.progress)));
    return (
      <div className="flex flex-col gap-1">
        <Progress.Root
          value={value}
          aria-label={`Enviando ${name}`}
          className={imageUploaderProgressVariants()}
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
  if (image.status === 'processing')
    return <Spinner size="sm" label="Processando…" showLabel className="text-muted-foreground" />;
  if (image.status === 'error')
    return (
      <div className="flex flex-col items-start gap-2">
        <p role="alert" className="text-small font-semibold text-destructive">
          {image.error ?? 'Não foi possível enviar.'}
        </p>
        <Button
          variant="outline"
          size="sm"
          aria-label={`Tentar de novo: ${name}`}
          onClick={() => {
            onRetry(image.id);
          }}
        >
          Tentar de novo
        </Button>
      </div>
    );
  return null;
}
