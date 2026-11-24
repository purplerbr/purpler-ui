# @purplerbr/tokens

## 0.2.1

### Patch Changes

- aba308d: `--button-radius` (and the store theme `full` preset) is now `1.5rem` instead of `9999px`: single-line buttons stay pills, and a label that wraps to several lines gets a rounded rectangle instead of an ellipse.

## 0.2.0

### Minor Changes

- b659095: Add the `skeleton` color (`--skeleton`, utility `bg-skeleton`) for loading placeholders: `neutral-300` in light and `neutral-700` in dark, at least 1.3:1 on `background` and `card`. Like the logo colors, it stays out of the store theme.

## 0.1.0

### Minor Changes

- ba8e010: Novos tokens de cor do logo da Purpler, `brand-mark` (símbolo: uva 600 no claro, uva 300 no escuro) e `brand-wordmark` (nome: uva 950 no claro, areia 50 no escuro), nas variáveis `--brand-mark`/`--brand-wordmark` e nos utilitários `fill-brand-mark`/`fill-brand-wordmark`. Ficam fora dos tokens semânticos, então o tema de loja nunca muda o logo. Exporta `BRAND_LOGO_TOKENS`, `brandLogo` e o tipo `BrandLogoToken`.
- 8dfb458: Primeira versão: tokens da marca Balcão (paleta OKLCH, tokens semânticos claro e escuro, tipografia, raios, sombras, movimento, fontes auto-hospedadas e `buildStoreTheme()` com presets de loja) e a infraestrutura de `@purplerbr/ui` com `cn` e o átomo `Button`.
