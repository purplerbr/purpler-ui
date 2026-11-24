import { ChevronDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import {
  accordionContentVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionVariants,
} from './Accordion.variants';

export type AccordionProps = ComponentProps<'div'>;
/** Native `<details>`: `open` starts it expanded, `name` makes items of a group exclusive. */
export type AccordionItemProps = ComponentProps<'details'>;
export type AccordionTriggerProps = ComponentProps<'summary'>;
export type AccordionContentProps = ComponentProps<'div'>;

/** Disclosure list on `<details>`: it opens and closes without JS, so prerendered pages stay readable. */
export function Accordion({ className, ...props }: AccordionProps) {
  return <div data-slot="accordion" className={cn(accordionVariants(), className)} {...props} />;
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <details
      data-slot="accordion-item"
      className={cn(accordionItemVariants(), className)}
      {...props}
    />
  );
}

// No heading inside the summary: its button role hides heading semantics in some screen readers.
export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  return (
    <summary
      data-slot="accordion-trigger"
      className={cn(accordionTriggerVariants(), className)}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden="true"
        className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
      />
    </summary>
  );
}

export function AccordionContent({ className, ...props }: AccordionContentProps) {
  return (
    <div
      data-slot="accordion-content"
      className={cn(accordionContentVariants(), className)}
      {...props}
    />
  );
}
