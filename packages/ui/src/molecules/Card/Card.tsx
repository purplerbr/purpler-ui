import type { ComponentProps } from 'react';
import { Heading, type HeadingProps } from '../../atoms/Heading/Heading';
import { cn } from '../../utils/cn';
import { cardVariants } from './Card.variants';

export type CardProps = ComponentProps<'div'>;

export function Card({ className, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants(), className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-header" className={cn('grid gap-1.5 px-6', className)} {...props} />;
}

export function CardTitle({ level = 3, ...props }: HeadingProps) {
  return <Heading data-slot="card-title" level={level} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-small text-muted-foreground', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center gap-3 px-6', className)}
      {...props}
    />
  );
}
