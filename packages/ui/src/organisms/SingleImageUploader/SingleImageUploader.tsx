import { ImageUp, Trash2 } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type DragEvent,
} from 'react';
import { Button } from '../../atoms/Button/Button';
import { cn } from '../../utils/cn';
import { formatFileSize, formatTypes, matchesAccept } from '../../utils/files';
import { ImageStatus, type ImageUploaderImage } from '../ImageUploader/ImageUploader';
import { imageUploaderDropzoneVariants } from '../ImageUploader/ImageUploader.variants';
import {
  singleImageUploaderImageVariants,
  singleImageUploaderPreviewVariants,
  singleImageUploaderVariants,
} from './SingleImageUploader.variants';

export type SingleImageUploaderProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** The current image; without it the drop zone shows. */
  image?: ImageUploaderImage | undefined;
  /** One file that passed `accept` and `maxSize`; with an image present it replaces it. */
  onFileSelected: (file: File) => void;
  onRemove: () => void;
  onRetry: () => void;
  /** Same syntax as the input: `image/png,image/webp`, `image/*` or `.jpg`. */
  accept: string;
  /** Largest file in bytes. */
  maxSize: number;
};

/** One image (a logo, a favicon) with replace, remove, progress and retry; the app does the upload. */
export function SingleImageUploader({
  className,
  image,
  onFileSelected,
  onRemove,
  onRetry,
  accept,
  maxSize,
  ...props
}: SingleImageUploaderProps) {
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLButtonElement>(null);
  const focusDropzone = useRef(false);
  const [fileDragging, setFileDragging] = useState(false);
  const [rejection, setRejection] = useState('');
  const [announcement, setAnnouncement] = useState('');

  const types = formatTypes(accept);
  const size = formatFileSize(maxSize);

  // After a removal the buttons that had the focus are gone; the drop zone takes it.
  useEffect(() => {
    if (!focusDropzone.current) return;
    focusDropzone.current = false;
    dropzoneRef.current?.focus();
  }, [image]);

  function selectFiles(files: File[]) {
    const [file] = files;
    if (file === undefined) return;
    let message = '';
    if (files.length > 1) message = 'Envie só uma imagem.';
    else if (!matchesAccept(file, accept))
      message = `${file.name}: tipo não aceito. Envie ${types}.`;
    else if (file.size > maxSize) message = `${file.name}: maior que ${size}.`;
    setRejection(message);
    if (message) return;
    setAnnouncement(image === undefined ? '1 imagem adicionada.' : 'Imagem trocada.');
    onFileSelected(file);
  }

  function remove() {
    focusDropzone.current = true;
    setAnnouncement('Imagem removida.');
    onRemove();
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    selectFiles([...(event.target.files ?? [])]);
    // Lets the same file be picked again after it was refused or removed.
    event.target.value = '';
  }

  function onRootDragOver(event: DragEvent<HTMLDivElement>) {
    if (!event.dataTransfer.types.includes('Files')) return;
    event.preventDefault();
    setFileDragging(true);
  }

  function onRootDragLeave(event: DragEvent<HTMLDivElement>) {
    const to = event.relatedTarget;
    if (!(to instanceof Node && event.currentTarget.contains(to))) setFileDragging(false);
  }

  // The whole uploader takes the drop, with or without an image, so dropping also replaces.
  function onRootDrop(event: DragEvent<HTMLDivElement>) {
    if (!event.dataTransfer.types.includes('Files')) return;
    event.preventDefault();
    setFileDragging(false);
    selectFiles([...event.dataTransfer.files]);
  }

  const pick = () => inputRef.current?.click();

  return (
    // Drag and drop is for pointers only; the drop zone and "Trocar" are the keyboard path.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="group"
      data-slot="single-image-uploader"
      data-dragging={fileDragging}
      className={cn('group', singleImageUploaderVariants(), className)}
      onDragOver={onRootDragOver}
      onDragLeave={onRootDragLeave}
      onDrop={onRootDrop}
      {...props}
    >
      {image === undefined ? (
        <button
          ref={dropzoneRef}
          type="button"
          data-slot="single-image-uploader-dropzone"
          aria-describedby={hintId}
          className={imageUploaderDropzoneVariants()}
          onClick={pick}
        >
          <ImageUp aria-hidden="true" className="size-8 text-muted-foreground" />
          <span className="text-body font-semibold">Adicionar imagem</span>{' '}
          <span className="text-small text-muted-foreground">
            Arraste para cá ou clique para escolher
          </span>
        </button>
      ) : (
        <div
          data-slot="single-image-uploader-preview"
          className={singleImageUploaderPreviewVariants()}
        >
          <img
            src={image.src}
            alt={image.alt || 'Imagem atual'}
            className={singleImageUploaderImageVariants()}
          />
          <ImageStatus
            image={image}
            name="imagem"
            onRetry={() => {
              onRetry();
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" aria-describedby={hintId} onClick={pick}>
              <ImageUp aria-hidden="true" />
              Trocar
            </Button>
            <Button variant="ghost" onClick={remove}>
              <Trash2 aria-hidden="true" />
              Remover
            </Button>
          </div>
        </div>
      )}
      <p id={hintId} className="-mt-2 text-small text-muted-foreground">
        {`${types}, até ${size}.`}
      </p>
      <input
        ref={inputRef}
        data-slot="single-image-uploader-input"
        type="file"
        accept={accept}
        hidden
        tabIndex={-1}
        onChange={onInputChange}
      />
      {rejection && (
        <p role="alert" className="text-small font-semibold text-destructive">
          {rejection}
        </p>
      )}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
