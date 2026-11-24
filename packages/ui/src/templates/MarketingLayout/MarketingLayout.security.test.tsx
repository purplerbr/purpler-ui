import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MarketingFooter } from '../../organisms/MarketingFooter/MarketingFooter';
import { MarketingHeader } from '../../organisms/MarketingHeader/MarketingHeader';
import { PricingCard } from '../../organisms/PricingCard/PricingCard';
import { MarketingLayout } from './MarketingLayout';

const PAYLOAD = 'javascript:alert(document.domain)';

// The lib passes hrefs through as given; React 19 (the peer floor) must neutralize script URLs.
function Page() {
  return (
    <MarketingLayout
      header={
        <MarketingHeader
          homeHref={PAYLOAD}
          links={[{ href: ` ${PAYLOAD}`, label: 'Planos' }]}
          cta={{ href: 'JaVaScRiPt:alert(1)', label: 'Começar' }}
        />
      }
      footer={<MarketingFooter homeHref={PAYLOAD} links={[{ href: PAYLOAD, label: 'Termos' }]} />}
    >
      <PricingCard
        name="Básico"
        price="Grátis"
        features={[]}
        cta={{ href: PAYLOAD, label: 'Ir' }}
      />
    </MarketingLayout>
  );
}

function hrefsOf(root: ParentNode): string[] {
  return [...root.querySelectorAll('a[href]')].map((anchor) => anchor.getAttribute('href') ?? '');
}

describe('MarketingLayout link hrefs', () => {
  it('never renders a caller-supplied javascript: URL in the client render', () => {
    const { container } = render(<Page />);
    const hrefs = hrefsOf(container).filter((href) => href !== '#conteudo');

    expect(hrefs).toHaveLength(6);
    for (const href of hrefs) expect(href).not.toMatch(/alert/i);
  });

  it('never renders a caller-supplied javascript: URL in the server render', () => {
    const doc = new DOMParser().parseFromString(renderToString(<Page />), 'text/html');
    const hrefs = hrefsOf(doc).filter((href) => href !== '#conteudo');

    expect(hrefs).toHaveLength(6);
    for (const href of hrefs) expect(href).not.toMatch(/alert/i);
  });
});
