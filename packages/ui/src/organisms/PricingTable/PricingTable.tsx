import { Check, Minus } from 'lucide-react';
import { useId, type ComponentProps } from 'react';
import { cn } from '../../utils/cn';
import { pricingTableCellVariants, pricingTableVariants } from './PricingTable.variants';

export interface PricingTablePlan {
  id: string;
  name: string;
}

export interface PricingTableRow {
  label: string;
  /** By plan `id`: text as given, `true` for included, `false` (or missing) for not included. */
  values: Readonly<Record<string, string | boolean>>;
}

export type PricingTableProps = ComponentProps<'div'> & {
  /** Names the table and its scroll region for screen readers. */
  caption: string;
  plans: readonly PricingTablePlan[];
  rows: readonly PricingTableRow[];
  includedLabel?: string;
  notIncludedLabel?: string;
};

function Value({
  value,
  included,
  notIncluded,
}: {
  value: string | boolean | undefined;
  included: string;
  notIncluded: string;
}) {
  if (typeof value === 'string') return value;
  const Icon = value ? Check : Minus;
  return (
    <>
      <Icon
        aria-hidden="true"
        className={cn('size-5', value ? 'text-primary' : 'text-muted-foreground')}
      />
      <span className="sr-only">{value ? included : notIncluded}</span>
    </>
  );
}

/** Plan comparison as a real table: one column per plan and one row per feature, all from props. */
export function PricingTable({
  className,
  caption,
  plans,
  rows,
  includedLabel = 'Incluído',
  notIncludedLabel = 'Não incluído',
  ...props
}: PricingTableProps) {
  const captionId = useId();

  return (
    <div
      data-slot="pricing-table"
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
      className={cn(pricingTableVariants(), className)}
      {...props}
    >
      <table className="w-full min-w-xl border-collapse text-small">
        <caption id={captionId} className="sr-only">
          {caption}
        </caption>
        <thead>
          <tr>
            <td className={pricingTableCellVariants({ kind: 'corner' })} />
            {plans.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className={pricingTableCellVariants({ kind: 'column' })}
              >
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className={pricingTableCellVariants({ kind: 'row' })}>
                {row.label}
              </th>
              {plans.map((plan) => (
                <td key={plan.id} className={pricingTableCellVariants()}>
                  <Value
                    value={row.values[plan.id]}
                    included={includedLabel}
                    notIncluded={notIncludedLabel}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
