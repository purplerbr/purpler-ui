import { cva } from 'class-variance-authority';

export const singleImageUploaderVariants = cva(
  'flex w-full flex-col gap-4 font-sans text-foreground'
);

export const singleImageUploaderPreviewVariants = cva([
  'flex min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground',
  'group-data-[dragging=true]:border-primary',
]);

// object-contain on a neutral box: wide logos are not cropped and transparent PNGs stay visible.
export const singleImageUploaderImageVariants = cva(
  'h-32 w-full rounded-md bg-muted object-contain p-2'
);
