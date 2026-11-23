import { Check, X } from 'lucide-react';
import { useId, type ReactNode } from 'react';

interface FoundationPageProps {
  title: string;
  lead: string;
  children: ReactNode;
}

export function FoundationPage({ title, lead, children }: FoundationPageProps) {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 py-4">
      <header className="flex flex-col gap-3">
        <p className="text-caption text-muted-foreground uppercase">Fundamentos</p>
        <h1 className="font-display text-title-1">{title}</h1>
        <p className="max-w-prose text-body-lg text-muted-foreground">{lead}</p>
      </header>
      {children}
    </main>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function Section({ title, description, children }: SectionProps) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="font-display text-title-3">
          {title}
        </h2>
        {description !== undefined && (
          <p className="max-w-prose text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
      {children}
    </div>
  );
}

/** Correct/incorrect label: icon plus text, never color alone (WCAG 1.4.1). */
export function Verdict({ ok, children }: { ok: boolean; children: ReactNode }) {
  const Icon = ok ? Check : X;
  return (
    <p className="flex items-start gap-2 text-small">
      <Icon
        aria-hidden="true"
        className={ok ? 'mt-0.5 size-4 text-success' : 'mt-0.5 size-4 text-destructive'}
      />
      <span>
        <strong className="font-semibold">{ok ? 'Correto' : 'Incorreto'}:</strong> {children}
      </span>
    </p>
  );
}

interface DataTableProps {
  label: string;
  head: readonly string[];
  children: ReactNode;
}

/** The table scrolls sideways on small screens, so its container must take keyboard focus (WCAG 2.1.1). */
export function DataTable({ label, head, children }: DataTableProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="overflow-x-auto rounded-lg border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <table className="w-full border-collapse text-left text-small">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {head.map((label) => (
              <th key={label} scope="col" className="px-3 py-2 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}

export const cell = 'px-3 py-2 align-top';
