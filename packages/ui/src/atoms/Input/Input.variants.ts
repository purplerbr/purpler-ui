import { cva } from 'class-variance-authority';

// The box: border, fill and focus. Without addons it is the input; with them, the wrapper.
const box = [
  'flex h-10 w-full min-w-0 items-center rounded-md border border-input bg-background',
  'font-sans text-body text-foreground transition-colors',
];

export const inputVariants = cva([
  ...box,
  'px-3 placeholder:text-muted-foreground',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-destructive aria-invalid:focus-visible:outline-destructive',
]);

export const inputGroupVariants = cva([
  ...box,
  'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2',
  'has-[input:focus-visible]:outline-ring',
  // Disabled fades only the value: the addon stays readable, muted × muted-foreground is AA.
  'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-muted',
  'has-[input[aria-invalid=true]]:border-destructive',
  'has-[input[aria-invalid=true]:focus-visible]:outline-destructive',
]);

export const inputGroupControlVariants = cva([
  'h-full w-full min-w-0 flex-1 bg-transparent px-3 outline-none',
  'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
]);

export const inputAddonVariants = cva(
  'flex h-full shrink-0 items-center text-muted-foreground select-none [&>svg]:size-4',
  {
    variants: { side: { prefix: 'ps-3', suffix: 'pe-3' } },
  }
);
