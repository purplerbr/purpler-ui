import { cva } from 'class-variance-authority';

export const fileUploaderVariants = cva('flex w-full flex-col gap-4 font-sans text-foreground');

export const fileUploaderDropzoneVariants = cva([
  'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input',
  'bg-background px-4 py-8 text-center transition-colors hover:bg-muted',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background',
  'group-data-[dragging=true]:border-primary group-data-[dragging=true]:bg-muted',
]);

export const fileUploaderListVariants = cva('flex flex-col gap-2');

export const fileUploaderRowVariants = cva([
  'flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-card p-3 text-card-foreground',
  'data-[drop-target=true]:border-primary',
]);

export const fileUploaderProgressVariants = cva(
  'relative h-2 w-full overflow-hidden rounded-full bg-muted'
);
