import { toGa4, toPixel, type AnalyticsEventName, type AnalyticsEvents } from './events';

export { toGa4, toPixel } from './events';
export type {
  AnalyticsEventName,
  AnalyticsEvents,
  AnalyticsItem,
  Ga4Call,
  PixelCall,
} from './events';

export type ConsentChoice = 'granted' | 'denied';

export interface AnalyticsOptions {
  /** Exact hostnames where the tags may run; on any other host nothing ever loads. */
  hosts: readonly string[];
  ga4Id?: string;
  /** Leave it out to never start the Pixel. */
  metaPixelId?: string;
  /** localStorage key of the choice. */
  storageKey?: string;
}

export interface Analytics {
  /** Whether this host may run the tags at all: show the banner only when true. */
  isEnabled(): boolean;
  /** The stored choice of this version, or undefined while the notice was not answered. */
  consent(): ConsentChoice | undefined;
  /** Loads the tags unless the visitor refused them (opt-out, ADR 0015); call it after mount. */
  start(): void;
  /** Stores the "Ok" of the notice and loads the tags if they are not loaded yet. */
  grant(): void;
  /** Stores the refusal, revokes the tags, deletes their cookies and reloads a page that ran them. */
  deny(): void;
  /** Sends the event to the loaded tags; with the tags not loaded it does nothing. */
  track<N extends AnalyticsEventName>(name: N, params: AnalyticsEvents[N]): void;
}

/** Bump it when what the notice says changes: older choices are asked again. */
export const CONSENT_VERSION = 1;
export const DEFAULT_STORAGE_KEY = '@purpler:analytics-consent';
export const GTAG_URL = 'https://www.googletagmanager.com/gtag/js';
export const PIXEL_URL = 'https://connect.facebook.net/en_US/fbevents.js';

const TRACKING_COOKIE = /^(_ga(_.+)?|_fbp|_fbc)$/;

type Command = (...args: unknown[]) => void;
interface PixelStub {
  callMethod?: Command;
  queue: unknown[][];
  push: Command;
  loaded: boolean;
  version: string;
  disablePushState: boolean;
}
type PixelFunction = Command & PixelStub;
interface TagWindow {
  dataLayer?: unknown[];
  gtag?: Command;
  fbq?: PixelFunction;
  _fbq?: PixelFunction;
}

const tagWindow = (): Window & TagWindow => window;

// Global Privacy Control counts as a refusal before anything loads (ADR 0015); Do Not Track does not.
const hasPrivacySignal = (): boolean =>
  (navigator as Navigator & { globalPrivacyControl?: unknown }).globalPrivacyControl === true;

function readChoice(key: string): ConsentChoice | undefined {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (typeof stored !== 'object' || stored === null) return undefined;
    const { version, choice } = stored as { version?: unknown; choice?: unknown };
    if (version !== CONSENT_VERSION) return undefined;
    return choice === 'granted' || choice === 'denied' ? choice : undefined;
  } catch {
    return undefined;
  }
}

function writeChoice(key: string, choice: ConsentChoice): void {
  try {
    localStorage.setItem(key, JSON.stringify({ version: CONSENT_VERSION, choice }));
  } catch {
    // Private mode or blocked storage: the choice lives only in this page.
  }
}

function injectScript(src: string): void {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  // The page CSP lists these URLs; the nonce keeps them allowed under a nonce-only policy too.
  const nonce = document.querySelector<HTMLScriptElement>('script[nonce]')?.nonce;
  if (nonce) script.nonce = nonce;
  document.head.append(script);
}

function startGa4(id: string): void {
  const w = tagWindow();
  w.dataLayer ??= [];
  const layer = w.dataLayer;
  // gtag.js only reads Arguments objects from the dataLayer, never plain arrays.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    layer.push(arguments);
  };
  // Opt-out measurement (ADR 0015): only analytics storage; the ad signals stay denied for good.
  w.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  });
  w.gtag('js', new Date());
  w.gtag('config', id, {
    send_page_view: false,
    cookie_domain: 'none',
    cookie_flags: 'SameSite=Lax;Secure',
    // 13 months, the cookie retention of §12.9 of the root CLAUDE.md.
    cookie_expires: 34_128_000,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  injectScript(`${GTAG_URL}?id=${encodeURIComponent(id)}`);
}

function startPixel(id: string): void {
  const w = tagWindow();
  const queue: unknown[][] = [];
  // The official stub, bundled instead of inlined: fbevents.js sets callMethod and replays the queue.
  const fbq: PixelFunction = Object.assign(
    (...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else queue.push(args);
    },
    {
      queue,
      push: (...args: unknown[]) => {
        fbq(...args);
      },
      loaded: true,
      version: '2.0',
      // Page views are tracked by the app on each route; pushState would count them twice.
      disablePushState: true,
    }
  );
  w.fbq = fbq;
  w._fbq ??= fbq;
  fbq('set', 'autoConfig', false, id);
  fbq('init', id);
  injectScript(PIXEL_URL);
}

// The Pixel writes _fbp/_fbc on the registrable domain, so each parent domain is cleared too.
function deleteTrackingCookies(): void {
  const { hostname, protocol } = window.location;
  const labels = hostname.split('.');
  const domains = labels
    .slice(0, -1)
    .map((_, index) => `; Domain=.${labels.slice(index).join('.')}`);
  const secure = protocol === 'https:' ? '; Secure' : '';
  for (const pair of document.cookie.split(';')) {
    const name = pair.split('=')[0]?.trim() ?? '';
    if (!TRACKING_COOKIE.test(name)) continue;
    for (const domain of ['', ...domains]) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain}${secure}`;
    }
  }
}

/** GA4 and the Meta Pixel until the visitor refuses them, only on the given hosts (ADR 0015). */
export function createAnalytics({
  hosts,
  ga4Id,
  metaPixelId,
  storageKey = DEFAULT_STORAGE_KEY,
}: AnalyticsOptions): Analytics {
  let choice: ConsentChoice | undefined;
  let loaded = false;

  const isEnabled = () =>
    typeof window !== 'undefined' &&
    hosts.includes(window.location.hostname) &&
    (Boolean(ga4Id) || Boolean(metaPixelId));

  const consent = (): ConsentChoice | undefined => {
    if (!isEnabled()) return undefined;
    return hasPrivacySignal() ? 'denied' : (choice ?? readChoice(storageKey));
  };

  const load = () => {
    if (loaded || !isEnabled()) return;
    loaded = true;
    if (ga4Id) startGa4(ga4Id);
    if (metaPixelId) startPixel(metaPixelId);
  };

  return {
    isEnabled,
    consent,
    start: () => {
      // A refusal also clears cookies left by an earlier visit or written before GPC was turned on.
      if (consent() === 'denied') deleteTrackingCookies();
      else load();
    },
    grant: () => {
      if (!isEnabled() || hasPrivacySignal()) return;
      choice = 'granted';
      writeChoice(storageKey, choice);
      load();
    },
    deny: () => {
      if (!isEnabled()) return;
      choice = 'denied';
      writeChoice(storageKey, choice);
      const w = tagWindow();
      w.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      w.fbq?.('consent', 'revoke');
      deleteTrackingCookies();
      // Loaded tags cannot be unloaded: a reload leaves a page that never starts them.
      if (loaded) window.location.reload();
    },
    track: (name, params) => {
      if (!loaded) return;
      const w = tagWindow();
      if (ga4Id) w.gtag?.('event', ...toGa4(name, params));
      const pixel = metaPixelId ? toPixel(name, params) : null;
      if (pixel) w.fbq?.(...pixel);
    },
  };
}
