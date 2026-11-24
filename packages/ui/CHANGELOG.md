# @purplerbr/ui

## 0.6.0

### Minor Changes

- 6321e80: Form components and a URL-driven data table for the dashboard:
  
  - `Input` (`@purplerbr/ui/input`): text field with error and disabled states and an optional fixed `prefix`/`suffix` (such as `.purpler.com.br`) that stays out of the value and is read as part of the description.
  - `Label` (`@purplerbr/ui/label`): Radix label in the brand text style.
  - `FormField` (`@purplerbr/ui/form-field`): label, description and error for one control. It links them with `aria-labelledby`/`aria-describedby`, sets `aria-invalid`, and shows the error in a `role="alert"`. Works with react-hook-form through `error={errors.x?.message}`, without depending on it.
  - `RadioGroup` and `RadioGroupItem` (`@purplerbr/ui/radio-group`): Radix radio group with a `card` variant for plan choice; an item takes a `description` and a `badge` such as "Em breve", and can be disabled.
  - `Toaster` and `toast` (`@purplerbr/ui/toaster`): sonner 2.0.8 (new exact dependency), unstyled and painted with the tokens, in pt-BR. Sonner injects a `<style>` without a nonce.
  - `DataTable` (`@purplerbr/ui/data-table`): controlled table with sortable headers (`aria-sort`), pagination in a named `nav` with "Página X de Y", and loading, empty and error states. `useTableUrlState` keeps `page`, `limit`, `sort`, `order` and declared filters in the URL, validates every value against a config, pushes on change, replaces invalid params and follows Back/Forward. It takes a router adapter (React Router's `useSearchParams` fits) or falls back to `window.history`.

## 0.5.0

### Minor Changes

- 9344b78: New `FloatingContactLink` atom (`@purplerbr/ui/floating-contact-link`): a contact link fixed to the bottom-right corner, clear of the iOS safe areas, in the brand colors. Icon only with a 48 px target on phones, icon and text from `md`. It always opens in a new tab with `rel="noopener noreferrer"` and reads "(abre em nova aba)" after the label. It sits below the Sheet overlay and the skip link, and works without JavaScript. The destination, the icon and the label come from props.

### Patch Changes

- 9b2980b: Logo: tighter viewBox (no blank left margin); brand symbol optically centered

## 0.4.0

### Minor Changes

- f830ee7: New `List` atom (`@purplerbr/ui/list`) with `ListItem`: a `ul` with the brand gap and indent, `marker` `disc` or `none`, aligned to the start even inside centered blocks such as `EmptyState`. It always sets `role="list"`, so Safari and VoiceOver keep announcing it as a list without markers.

## 0.3.0

### Minor Changes

- 6caf0a5: New `Accordion` molecule (`@purplerbr/ui/accordion`) for FAQs, built on native `<details>` and `<summary>`: it opens and closes without JavaScript, so prerendered pages stay readable and every answer stays in the HTML for search engines. `open` starts an item expanded and a shared `name` keeps one item open at a time.
- a236bc6: New `Badge` atom (`@purplerbr/ui/badge`): a short static label such as "Mais popular" or "Rascunho", in the primary, secondary, accent, outline, success, warning, info and destructive variants. Every fill and text pair is a semantic pair proven AA, store themes included.
- bc0f364: New `EmptyState` molecule (`@purplerbr/ui/empty-state`): a decorative icon, a title (level 1 for a whole page such as a 404), a description and the next action.
- bd8a47e: New `Logo` atom (`@purplerbr/ui/logo`): the Purpler logo filled with the `brand-mark` and `brand-wordmark` tokens, in three sizes. `AuthLayout` now renders it instead of its inlined copy.
- bc0f364: New `MarketingFooter` organism (`@purplerbr/ui/marketing-footer`): logo, legal links, a `mailto:` contact and a closing note, all from props.
- bc0f364: New `MarketingHeader` organism (`@purplerbr/ui/marketing-header`) for the Purpler site: skip link to `#conteudo`, logo, nav links with `aria-current`, a CTA and a mobile menu in a `Sheet`. Without JavaScript the menu button hides and the links show under the bar, so prerendered pages stay navigable. Links, CTA and labels come from props.
- bc0f364: New `MarketingLayout` template (`@purplerbr/ui/marketing-layout`): header, a focusable `main` with the skip link target `id` (`conteudo` by default) and footer, for every public page of the site that is not a login page.
- bc0f364: New `PricingCard` organism (`@purplerbr/ui/pricing-card`): one plan with its name, a price already formatted by the app, its features and a CTA described by the plan name; `highlight` adds a `Badge` and a highlighted border. The lib never computes prices.
- bc0f364: New `PricingTable` organism (`@purplerbr/ui/pricing-table`): the plan comparison as a real table with column and row headers, text values as given and booleans read as "Incluído" or "Não incluído", in a scroll region that takes keyboard focus on small screens.
- bc0f364: New `Sheet` molecule (`@purplerbr/ui/sheet`): a side panel on the Radix Dialog that traps the focus, closes on Esc and returns the focus to its trigger, from the right, left, top or bottom edge.

## 0.2.2

### Patch Changes

- Updated dependencies [aba308d]
  - @purplerbr/tokens@0.2.1

## 0.2.1

### Patch Changes

- 369b503: `Button`: long labels now wrap, centered and balanced, instead of overflowing, and a single long word (a store name without spaces) breaks; the text sizes use a minimum height, so a single-line button keeps its height and icon-only buttons keep their fixed square. `variant="link"` drops the side padding, so it lines up with the text next to it.

## 0.2.0

### Minor Changes

- 81c33c7: Add the `Spinner` and `Skeleton` atoms for loading states. `Spinner` is a `role="status"` region labelled "Carregando…" by default; under reduced motion the ring stops and the label shows. `Spinner` is for lazy route chunks; data screens use `Skeleton`, an `aria-hidden` `bg-skeleton` block that stops pulsing under reduced motion; its container announces the loading.

### Patch Changes

- 416c77b: `Heading` shows no focus ring when a page moves focus to it by script (`tabIndex={-1}`); a heading is never in the tab order. `Spinner` is now named by its `label` (`aria-label`), so `getByRole('status', { name })` finds it, and props can no longer replace its `role` or name.
- Updated dependencies [b659095]
  - @purplerbr/tokens@0.2.0

## 0.1.0

### Minor Changes

- 290acaf: Novos componentes `Alert` (molécula, com `AlertTitle` e `AlertDescription`, variantes `info`, `success`, `warning` e `destructive`) e `Checkbox` (átomo sobre o Radix, com `label` opcional e estado parcial), nos subpaths `@purplerbr/ui/alert` e `@purplerbr/ui/checkbox`.
- 7f9b184: Novos componentes `Heading` (átomo, `level` de 1 a 6 e `size` independente do nível, em Bricolage) e `Card` (molécula, com `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` e `CardFooter`; o `CardTitle` aceita o nível do heading), nos subpaths `@purplerbr/ui/heading` e `@purplerbr/ui/card`.
- 8dfb458: Primeira versão: tokens da marca Balcão (paleta OKLCH, tokens semânticos claro e escuro, tipografia, raios, sombras, movimento, fontes auto-hospedadas e `buildStoreTheme()` com presets de loja) e a infraestrutura de `@purplerbr/ui` com `cn` e o átomo `Button`.
- 2e4471c: Novos componentes `Text` (átomo, `as` em `p`, `span` ou `div`, `size` da escala de texto da marca e `tone` semântico: `inherit`, `default`, `muted`, `primary` e `destructive`) e `AuthLayout` (template de página de login em coluna única, com o logo da Purpler no `header`, o conteúdo no `main` e um `footer` opcional para os links de termos e privacidade), nos subpaths `@purplerbr/ui/text` e `@purplerbr/ui/auth-layout`.

### Patch Changes

- Updated dependencies [ba8e010]
- Updated dependencies [8dfb458]
  - @purplerbr/tokens@0.1.0
