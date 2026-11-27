/** Something on sale, such as a plan; the price is in integer cents (BRL). */
export interface AnalyticsItem {
  id: string;
  name: string;
  priceCents: number;
}

/** The single event map: each event, its parameters, and below how it reaches GA4 and the Pixel. */
export interface AnalyticsEvents {
  page_view: { title: string };
  view_item_list: { listId: string; listName: string; items: readonly AnalyticsItem[] };
  select_item: { listId: string; item: AnalyticsItem };
  generate_lead: { location: string };
  contact: { method: 'whatsapp' };
  faq_open: { question: string };
}

export type AnalyticsEventName = keyof AnalyticsEvents;

export type Ga4Call = readonly [event: string, params: Record<string, unknown>];
export type PixelCall = readonly [method: 'track', event: string, params: Record<string, unknown>];

const CURRENCY = 'BRL';

const toGa4Item = ({ id, name, priceCents }: AnalyticsItem) => ({
  item_id: id,
  item_name: name,
  price: priceCents / 100,
});

const GA4: { [N in AnalyticsEventName]: (params: AnalyticsEvents[N]) => Ga4Call } = {
  page_view: ({ title }) => ['page_view', { page_title: title }],
  view_item_list: ({ listId, listName, items }) => [
    'view_item_list',
    {
      item_list_id: listId,
      item_list_name: listName,
      currency: CURRENCY,
      items: items.map(toGa4Item),
    },
  ],
  select_item: ({ listId, item }) => [
    'select_item',
    { item_list_id: listId, currency: CURRENCY, items: [toGa4Item(item)] },
  ],
  generate_lead: ({ location }) => ['generate_lead', { lead_source: location }],
  contact: ({ method }) => ['contact', { method }],
  faq_open: ({ question }) => ['faq_open', { question }],
};

const PIXEL: { [N in AnalyticsEventName]: (params: AnalyticsEvents[N]) => PixelCall | null } = {
  page_view: () => ['track', 'PageView', {}],
  view_item_list: ({ items }) => [
    'track',
    'ViewContent',
    { content_type: 'product', content_ids: items.map(({ id }) => id), currency: CURRENCY },
  ],
  select_item: ({ item }) => [
    'track',
    'Lead',
    { content_name: item.name, value: item.priceCents / 100, currency: CURRENCY },
  ],
  generate_lead: () => ['track', 'Lead', {}],
  contact: () => ['track', 'Contact', {}],
  faq_open: () => null,
};

/** The `gtag('event', …)` arguments of an event. */
export function toGa4<N extends AnalyticsEventName>(name: N, params: AnalyticsEvents[N]): Ga4Call {
  return GA4[name](params);
}

/** The `fbq(…)` arguments of an event, or null when the Pixel does not receive it. */
export function toPixel<N extends AnalyticsEventName>(
  name: N,
  params: AnalyticsEvents[N]
): PixelCall | null {
  return PIXEL[name](params);
}
