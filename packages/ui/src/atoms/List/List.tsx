import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { listVariants, type ListVariants } from './List.variants';

export type ListProps = ComponentProps<'ul'> & ListVariants;

/** A bulleted (or unmarked) list of `ListItem`s, aligned to the start even inside centered blocks. */
export function List({ className, marker, ...props }: ListProps) {
  return (
    // Safari + VoiceOver drop list semantics under `list-style: none`; the explicit role keeps them.
    <ul
      role="list"
      data-slot="list"
      className={cn(listVariants({ marker }), className)}
      {...props}
    />
  );
}

export function ListItem(props: ComponentProps<'li'>) {
  return <li data-slot="list-item" {...props} />;
}
