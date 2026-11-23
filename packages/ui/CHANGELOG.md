# @purplerbr/ui

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
