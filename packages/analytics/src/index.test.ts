import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CONSENT_VERSION,
  createAnalytics,
  DEFAULT_STORAGE_KEY,
  GTAG_URL,
  PIXEL_URL,
  toGa4,
  toPixel,
  type AnalyticsOptions,
} from './index';

// The JSDOM instance Vitest exposes; typed here because the package has no @types/jsdom.
declare const jsdom: {
  reconfigure(settings: { url: string }): void;
  virtualConsole: {
    on(event: 'jsdomError', listener: (error: Error) => void): void;
    off(event: 'jsdomError', listener: (error: Error) => void): void;
  };
};

const GA4_ID = 'G-TEST123';
const PIXEL_ID = '1234567890';
const OPTIONS: AnalyticsOptions = {
  hosts: ['purpler.com.br'],
  ga4Id: GA4_ID,
  metaPixelId: PIXEL_ID,
};
const PLAN = { id: 'professional', name: 'Profissional', priceCents: 7999 };

type TagWindow = Window & {
  dataLayer?: ArrayLike<unknown>[];
  gtag?: unknown;
  fbq?: { queue: unknown[][]; disablePushState?: unknown };
  _fbq?: unknown;
};
const tags = (): TagWindow => window;

const scriptSources = () =>
  [...document.querySelectorAll('script')].map((script) => script.getAttribute('src'));
const gtagCalls = () => (tags().dataLayer ?? []).map((args) => Array.from(args));
const pixelCalls = () => tags().fbq?.queue ?? [];

let navigations: string[] = [];
const recordNavigation = (error: Error) => navigations.push(error.message);

function resetPage(url = 'https://purpler.com.br/') {
  jsdom.reconfigure({ url });
  document.head.replaceChildren();
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0]?.trim();
    if (name) document.cookie = `${name}=; Max-Age=0; Path=/`;
  }
  localStorage.clear();
  const w = tags();
  delete w.dataLayer;
  delete w.gtag;
  delete w.fbq;
  delete w._fbq;
}

beforeEach(() => {
  resetPage();
  navigations = [];
  jsdom.virtualConsole.on('jsdomError', recordNavigation);
});

afterEach(() => {
  jsdom.virtualConsole.off('jsdomError', recordNavigation);
});

describe('createAnalytics', () => {
  it('touches nothing until start, and track before loading sends nothing', () => {
    const analytics = createAnalytics(OPTIONS);
    analytics.track('page_view', { title: 'Purpler' });

    expect(scriptSources()).toEqual([]);
    expect(tags().dataLayer).toBeUndefined();
    expect(tags().fbq).toBeUndefined();
    expect(document.cookie).toBe('');
  });

  it('loads the official GA4 and Pixel scripts on start, with no visitor action (opt-out)', () => {
    const page = document.createElement('script');
    page.nonce = 'page-nonce';
    document.head.append(page);

    createAnalytics(OPTIONS).start();

    const injected = [...document.querySelectorAll<HTMLScriptElement>('script[src]')];
    expect(injected.map((script) => script.src)).toEqual([`${GTAG_URL}?id=${GA4_ID}`, PIXEL_URL]);
    expect(injected.every((script) => script.async && script.nonce === 'page-nonce')).toBe(true);
  });

  it('forces Consent Mode, host-only cookies and no ad signals on GA4', () => {
    createAnalytics(OPTIONS).start();
    const calls = gtagCalls();

    expect(calls[0]).toEqual([
      'consent',
      'default',
      {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
      },
    ]);
    expect(calls[1]?.[0]).toBe('js');
    expect(calls[2]).toEqual([
      'config',
      GA4_ID,
      {
        send_page_view: false,
        cookie_domain: 'none',
        cookie_flags: 'SameSite=Lax;Secure',
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      },
    ]);
    expect(calls).toHaveLength(3);
    // gtag.js ignores plain arrays in the dataLayer.
    expect(tags().dataLayer?.map((args) => Object.prototype.toString.call(args))).toEqual([
      '[object Arguments]',
      '[object Arguments]',
      '[object Arguments]',
    ]);
  });

  it('turns autoConfig off before init and inits the Pixel with the ID only', () => {
    createAnalytics(OPTIONS).start();

    expect(pixelCalls()).toEqual([
      ['set', 'autoConfig', false, PIXEL_ID],
      ['init', PIXEL_ID],
    ]);
    expect(tags().fbq?.disablePushState).toBe(true);
    expect(tags()._fbq).toBe(tags().fbq);
  });

  it('never starts the Pixel without its ID', () => {
    createAnalytics({ hosts: OPTIONS.hosts, ga4Id: GA4_ID }).start();

    expect(scriptSources()).toEqual([`${GTAG_URL}?id=${GA4_ID}`]);
    expect(tags().fbq).toBeUndefined();
  });

  it('loads once, however many times start and grant run', () => {
    const analytics = createAnalytics(OPTIONS);
    analytics.start();
    analytics.start();
    analytics.grant();

    expect(scriptSources()).toHaveLength(2);
  });

  it.each([
    'app.purpler.com.br',
    'api.purpler.com.br',
    'minhaloja.purpler.com.br',
    'www.minhaloja.com.br',
    'localhost',
  ])('never runs on %s', (host) => {
    resetPage(`https://${host}/`);
    const analytics = createAnalytics(OPTIONS);
    analytics.start();
    analytics.grant();
    analytics.track('page_view', { title: 'Purpler' });

    expect(analytics.isEnabled()).toBe(false);
    expect(analytics.consent()).toBeUndefined();
    expect(scriptSources()).toEqual([]);
    expect(tags().dataLayer).toBeUndefined();
    expect(localStorage.length).toBe(0);
  });

  it('is disabled without any ID', () => {
    expect(createAnalytics({ hosts: OPTIONS.hosts }).isEnabled()).toBe(false);
    expect(createAnalytics({ hosts: OPTIONS.hosts, ga4Id: '' }).isEnabled()).toBe(false);
  });

  it('sends each event to GA4 and, when mapped, to the Pixel', () => {
    const analytics = createAnalytics(OPTIONS);
    analytics.start();
    analytics.track('select_item', { listId: 'plans', item: PLAN });
    analytics.track('faq_open', { question: 'Preciso de CNPJ?' });

    expect(gtagCalls().slice(3)).toEqual([
      ['event', ...toGa4('select_item', { listId: 'plans', item: PLAN })],
      ['event', 'faq_open', { question: 'Preciso de CNPJ?' }],
    ]);
    expect(pixelCalls().slice(2)).toEqual([
      ['track', 'Lead', { content_name: 'Profissional', value: 79.99, currency: 'BRL' }],
    ]);
  });

  it('stores the Ok of the notice with its version', () => {
    const analytics = createAnalytics(OPTIONS);
    expect(analytics.consent()).toBeUndefined();

    analytics.grant();

    expect(analytics.consent()).toBe('granted');
    expect(JSON.parse(localStorage.getItem(DEFAULT_STORAGE_KEY) ?? 'null')).toEqual({
      version: CONSENT_VERSION,
      choice: 'granted',
    });
    expect(scriptSources()).toHaveLength(2);
  });

  it('asks again when the stored choice is from another version or malformed', () => {
    localStorage.setItem('k', JSON.stringify({ version: CONSENT_VERSION + 1, choice: 'denied' }));
    expect(createAnalytics({ ...OPTIONS, storageKey: 'k' }).consent()).toBeUndefined();

    localStorage.setItem('k', '{');
    expect(createAnalytics({ ...OPTIONS, storageKey: 'k' }).consent()).toBeUndefined();

    localStorage.setItem('k', JSON.stringify({ version: CONSENT_VERSION, choice: 'maybe' }));
    expect(createAnalytics({ ...OPTIONS, storageKey: 'k' }).consent()).toBeUndefined();
  });

  it('keeps the choice in memory when storage is blocked', () => {
    const blocked = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(blocked);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(blocked);
    const analytics = createAnalytics(OPTIONS);

    expect(analytics.consent()).toBeUndefined();
    analytics.deny();
    expect(analytics.consent()).toBe('denied');
  });

  describe('with Global Privacy Control on', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true });
    });

    afterEach(() => {
      Reflect.deleteProperty(navigator, 'globalPrivacyControl');
    });

    it('treats the visit as refused: nothing loads, no cookie is written and Ok cannot override it', () => {
      document.cookie = '_ga=GA1.1.1; Path=/';
      const analytics = createAnalytics(OPTIONS);
      analytics.start();
      analytics.grant();
      analytics.track('page_view', { title: 'Purpler' });

      expect(analytics.consent()).toBe('denied');
      expect(scriptSources()).toEqual([]);
      expect(tags().dataLayer).toBeUndefined();
      expect(tags().fbq).toBeUndefined();
      expect(document.cookie).toBe('');
      expect(localStorage.length).toBe(0);
    });
  });

  it('on refusal revokes the tags, deletes their cookies on every domain and reloads', () => {
    const analytics = createAnalytics(OPTIONS);
    analytics.start();
    document.cookie = '_ga=GA1.1.1; Path=/; Secure';
    document.cookie = `_ga_${GA4_ID.slice(2)}=GS1.1; Path=/; Secure`;
    document.cookie = '_fbp=fb.1.1; Domain=.purpler.com.br; Path=/';
    document.cookie = '_fbc=fb.1.2; Domain=purpler.com.br; Path=/';
    document.cookie = 'other=1; Path=/';

    analytics.deny();

    expect(gtagCalls().at(-1)).toEqual(['consent', 'update', { analytics_storage: 'denied' }]);
    expect(pixelCalls().at(-1)).toEqual(['consent', 'revoke']);
    expect(document.cookie).toBe('other=1');
    expect(analytics.consent()).toBe('denied');
    expect(navigations).toEqual(['Not implemented: navigation to another Document']);
  });

  // On a subdomain, a delete without Domain leaves the Pixel cookies of the parent domain alive.
  it('deletes the parent-domain cookies from a subdomain too', () => {
    resetPage('https://www.purpler.com.br/');
    document.cookie = '_fbp=fb.1.1; Domain=.purpler.com.br; Path=/';
    document.cookie = '_fbc=fb.1.2; Domain=.purpler.com.br; Path=/';
    document.cookie = '_ga=GA1.1.1; Path=/';

    createAnalytics({ ...OPTIONS, hosts: ['www.purpler.com.br'] }).deny();

    expect(document.cookie).toBe('');
  });

  it('after a refusal, a new visit loads nothing and tracks nothing', () => {
    createAnalytics(OPTIONS).deny();
    resetPageKeepingStorage();

    const analytics = createAnalytics(OPTIONS);
    analytics.start();
    analytics.track('page_view', { title: 'Purpler' });

    expect(analytics.consent()).toBe('denied');
    expect(scriptSources()).toEqual([]);
    expect(tags().dataLayer).toBeUndefined();
    expect(tags().fbq).toBeUndefined();
  });

  it('does not reload a page that never ran the tags', () => {
    createAnalytics(OPTIONS).deny();

    expect(navigations).toEqual([]);
  });
});

function resetPageKeepingStorage() {
  const stored = localStorage.getItem(DEFAULT_STORAGE_KEY);
  resetPage();
  if (stored !== null) localStorage.setItem(DEFAULT_STORAGE_KEY, stored);
}

describe('event map', () => {
  const ITEMS = [
    { id: 'basic', name: 'Básico', priceCents: 0 },
    { id: 'professional', name: 'Profissional', priceCents: 7999 },
  ];

  it('translates every event to GA4', () => {
    expect(toGa4('page_view', { title: 'Planos' })).toEqual([
      'page_view',
      { page_title: 'Planos' },
    ]);
    expect(toGa4('view_item_list', { listId: 'plans', listName: 'Planos', items: ITEMS })).toEqual([
      'view_item_list',
      {
        item_list_id: 'plans',
        item_list_name: 'Planos',
        currency: 'BRL',
        items: [
          { item_id: 'basic', item_name: 'Básico', price: 0 },
          { item_id: 'professional', item_name: 'Profissional', price: 79.99 },
        ],
      },
    ]);
    expect(toGa4('select_item', { listId: 'plans', item: PLAN })).toEqual([
      'select_item',
      {
        item_list_id: 'plans',
        currency: 'BRL',
        items: [{ item_id: 'professional', item_name: 'Profissional', price: 79.99 }],
      },
    ]);
    expect(toGa4('generate_lead', { location: 'header' })).toEqual([
      'generate_lead',
      { lead_source: 'header' },
    ]);
    expect(toGa4('contact', { method: 'whatsapp' })).toEqual(['contact', { method: 'whatsapp' }]);
    expect(toGa4('faq_open', { question: 'Posso cancelar?' })).toEqual([
      'faq_open',
      { question: 'Posso cancelar?' },
    ]);
  });

  it('translates every event to the Pixel, and leaves the FAQ out', () => {
    expect(toPixel('page_view', { title: 'Planos' })).toEqual(['track', 'PageView', {}]);
    expect(
      toPixel('view_item_list', { listId: 'plans', listName: 'Planos', items: ITEMS })
    ).toEqual([
      'track',
      'ViewContent',
      { content_type: 'product', content_ids: ['basic', 'professional'], currency: 'BRL' },
    ]);
    expect(toPixel('select_item', { listId: 'plans', item: PLAN })).toEqual([
      'track',
      'Lead',
      { content_name: 'Profissional', value: 79.99, currency: 'BRL' },
    ]);
    expect(toPixel('generate_lead', { location: 'header' })).toEqual(['track', 'Lead', {}]);
    expect(toPixel('contact', { method: 'whatsapp' })).toEqual(['track', 'Contact', {}]);
    expect(toPixel('faq_open', { question: 'Posso cancelar?' })).toBeNull();
  });
});
