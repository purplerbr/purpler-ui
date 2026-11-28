# @purplerbr/ui

## 0.15.0

### Minor Changes

- 9aa88f4: Add `Textarea` (`@purplerbr/ui/textarea`): the multi-line text field, with the same tokens, focus outline, invalid and disabled states as `Input`, for long text such as the store's return and privacy policies. It is a native `<textarea>` (all its props pass through, `rows` defaults to 6) and works inside `FormField` like `Input`, which links the label, help text and error. It grows with the text from `rows` lines up to a maximum height and then scrolls; in browsers without `field-sizing`, `rows` sets the height and the field can be dragged taller.

## 0.14.0

### Minor Changes

- 516e2f6: `FileUploader` items take two optional props: `processingLabel` replaces "Verificando…" while the item is processing (and in its announcement), and `retryable: false` hides "Tentar de novo" on an error that only a new file fixes, keeping the remove button. Without them, nothing changes.

## 0.13.0

### Minor Changes

- be21ab5: Add `FileUploader` (`@purplerbr/ui/file-uploader`): the file list of a form (digital products, course videos), UI only (the app uploads). A drop zone takes files by drag and drop anywhere on it, by click and by keyboard, and sends to `onFilesSelected` only the files within `accept`, `maxSize` and `maxFiles`; the others are listed with the reason. Each row shows the name, the size in pt-BR, the upload progress, "Verificando…", "Enviado" or the error with "Tentar de novo" (`onRetry`). Rows are removed with `onRemove` and, when `onReorder` is given, reorder by drag and drop or with the move buttons. Status changes are announced in a polite `aria-live` region. `title`, `description` and `emptyHint` set the copy. The type, size and list helpers of `ImageUploader` now live in a shared internal util, with no change to its behavior.

## 0.12.0

### Minor Changes

- 017468d: Add `ImageUploader` (`@purplerbr/ui/image-uploader`): the image list of a form, UI only (the app uploads). A drop zone takes files by drag and drop anywhere on it, by click and by keyboard, and sends to `onFilesSelected` only the files within `accept`, `maxSize` and `maxFiles`; the others are listed with the reason. Each image shows a thumbnail, the upload progress, "Processando…" or the error with "Tentar de novo" (`onRetry`); the first one is the cover. Images reorder by drag and drop or with the move buttons (`onReorder`), are removed with `onRemove`, and every change is announced in an `aria-live` region while the focus follows the moved image.
- 2f65d0f: Add `Select` (`@purplerbr/ui/select`): one choice in a list, on Radix Select in the shadcn style, with the same box as `Input`. It takes `options` (`{ value, label, disabled? }`), `placeholder`, `value`/`defaultValue`/`onValueChange` and `disabled`, and is named, described and marked invalid by `FormField` (or `aria-label`). `allLabel` adds a first option meaning "no filter", such as "Todas as categorias", reported as `''`.

## 0.11.0

### Minor Changes

- e233975: Add `ConsentBanner` (`@purplerbr/ui/consent-banner`): the cookie notice with a choice, fixed to the bottom of the page, a region named by its title, with the description, the privacy link and two buttons with the same weight ("Aceitar" by default, or "Ok", and "Recusar"). It does not block the page and moves the focus to its title only with `focusOnMount` (reopened from the footer). While open, it publishes its height in `--consent-banner-height` on `:root` (`CONSENT_BANNER_HEIGHT`): `styles.css` turns it into `scroll-padding-bottom` and a box after the page, and `FloatingContactLink` rises above the banner, so neither the keyboard focus nor the end of the page stays hidden under it. The app decides when to show it and what the choice does. `MarketingFooter` takes `action`, rendered after the links in the same nav, such as a "Gerenciar cookies" button.

## 0.10.0

### Minor Changes

- 0516540: `AlertDialogAction` takes `loading`: it passes it to the `Button` (spinner, `aria-busy` and `aria-disabled`, focus kept) and, while loading, a click or Enter neither runs `onClick` nor closes the dialog.

## 0.9.0

### Minor Changes

- cea4ca1: Add `AlertDialog` (`@purplerbr/ui/alert-dialog`): a confirmation on Radix AlertDialog that traps the focus, starts on cancel, closes on Esc, ignores clicks outside and returns the focus to the trigger. `AlertDialogAction` and `AlertDialogCancel` take the `Button` `variant` and `size` (use `destructive` for actions that cannot be undone).

## 0.8.0

### Minor Changes

- ed4e7df: `DashboardLayout` gets `storeLabel`: the current store name in the top bar below `lg`, on one line cut with an ellipsis, with a skeleton and a status while the store loads. Nav group labels use `text-muted-foreground`, and the `account` slot takes the padding of the `store` slot. `SEMANTIC_PAIRS` now checks `sidebar` × `muted-foreground`, `sidebar` × `primary`, `sidebar` × `ring` and `sidebar-accent` × `sidebar-primary`; the light store theme also fits `primary` against `sidebar`.

### Patch Changes

- Updated dependencies [ed4e7df]
  - @purplerbr/tokens@0.2.2

## 0.7.0

### Minor Changes

- 246a367: Add `DashboardLayout` (`@purplerbr/ui/dashboard-layout`): the shell of the merchant dashboard, with a fixed sidebar from `lg`, a menu `Sheet` on small screens, a "current store" slot with a loading skeleton, grouped nav with `aria-current`, an account footer, the skip link and a `renderLink` prop for the app's router link.

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
