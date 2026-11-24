import { Check } from 'lucide-react';
import { useId, type ComponentProps } from 'react';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import type { HeadingLevel } from '../../atoms/Heading/Heading';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../molecules/Card/Card';
import { cn } from '../../utils/cn';
import { pricingCardVariants } from './PricingCard.variants';

export type PricingCardProps = ComponentProps<'div'> & {
  name: string;
  /** Already formatted by the app, such as “R$ 79,99” or “Grátis”; the lib never computes prices. */
  price: string;
  /** Shown after the price, such as “/mês”. */
  period?: string;
  description?: string;
  features: readonly string[];
  cta: { href: string; label: string };
  /** Badge text, such as “Mais popular”; it also highlights the card. */
  highlight?: string;
  headingLevel?: HeadingLevel;
};

/** One plan: name, price, what it includes and its call to action, all from props. */
export function PricingCard({
  className,
  name,
  price,
  period,
  description,
  features,
  cta,
  highlight,
  headingLevel = 3,
  ...props
}: PricingCardProps) {
  const titleId = useId();

  return (
    <Card
      data-slot="pricing-card"
      className={cn(pricingCardVariants({ highlighted: Boolean(highlight) }), className)}
      {...props}
    >
      <CardHeader>
        {highlight ? <Badge>{highlight}</Badge> : null}
        <CardTitle id={titleId} level={headingLevel}>
          {name}
        </CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-6">
        <p className="flex flex-wrap items-baseline gap-x-1">
          <span className="font-display text-title-1 font-bold">{price}</span>
          {period ? <span className="text-body text-muted-foreground">{period}</span> : null}
        </p>
        <ul className="grid gap-3 text-small">
          {features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto">
        {/* Every card has the same CTA text, so the plan name completes it for screen readers. */}
        <Button
          asChild
          variant={highlight ? 'primary' : 'outline'}
          className="w-full"
          aria-describedby={titleId}
        >
          <a href={cta.href}>{cta.label}</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
