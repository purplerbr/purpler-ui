import { STORE_THEME_PRESETS, buildStoreTheme, renderStoreThemeCss } from '@purplerbr/tokens';

export const PURPLER_BRAND = 'purpler';
export const STYLE_ELEMENT_ID = 'purpler-store-theme';

export type Scheme = 'light' | 'dark';

const storeCss = new Map(
  STORE_THEME_PRESETS.map((preset) => [
    preset.id,
    renderStoreThemeCss(buildStoreTheme(preset.input)),
  ])
);

export const schemeOf = (value: unknown): Scheme => (value === 'dark' ? 'dark' : 'light');

/** Applies the toolbar choice to the preview document: `.dark` on <html> and the store CSS. */
export function applyTheme(scheme: Scheme, store: unknown): void {
  const root = document.documentElement;
  root.classList.toggle('dark', scheme === 'dark');
  root.lang = 'pt-BR';
  let style = document.getElementById(STYLE_ELEMENT_ID);
  if (style === null) {
    style = document.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    document.head.append(style);
  }
  const css = typeof store === 'string' ? storeCss.get(store) : undefined;
  style.textContent = css ?? '';
  style.dataset.store = css === undefined ? PURPLER_BRAND : String(store);
}

/** Theme that the decorator applied, for pages that show values of the active theme. */
export function activeTheme(): { scheme: Scheme; store: string } {
  return {
    scheme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    store: document.getElementById(STYLE_ELEMENT_ID)?.dataset.store ?? PURPLER_BRAND,
  };
}
