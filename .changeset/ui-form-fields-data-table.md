---
'@purplerbr/ui': minor
---

Form components and a URL-driven data table for the dashboard:

- `Input` (`@purplerbr/ui/input`): text field with error and disabled states and an optional fixed `prefix`/`suffix` (such as `.purpler.com.br`) that stays out of the value and is read as part of the description.
- `Label` (`@purplerbr/ui/label`): Radix label in the brand text style.
- `FormField` (`@purplerbr/ui/form-field`): label, description and error for one control. It links them with `aria-labelledby`/`aria-describedby`, sets `aria-invalid`, and shows the error in a `role="alert"`. Works with react-hook-form through `error={errors.x?.message}`, without depending on it.
- `RadioGroup` and `RadioGroupItem` (`@purplerbr/ui/radio-group`): Radix radio group with a `card` variant for plan choice; an item takes a `description` and a `badge` such as "Em breve", and can be disabled.
- `Toaster` and `toast` (`@purplerbr/ui/toaster`): sonner 2.0.8 (new exact dependency), unstyled and painted with the tokens, in pt-BR. Sonner injects a `<style>` without a nonce.
- `DataTable` (`@purplerbr/ui/data-table`): controlled table with sortable headers (`aria-sort`), pagination in a named `nav` with "Página X de Y", and loading, empty and error states. `useTableUrlState` keeps `page`, `limit`, `sort`, `order` and declared filters in the URL, validates every value against a config, pushes on change, replaces invalid params and follows Back/Forward. It takes a router adapter (React Router's `useSearchParams` fits) or falls back to `window.history`.
