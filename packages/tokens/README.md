# @purplerbr/tokens

Paleta, tokens e temas da Purpler (marca Balcão), em CSS e TypeScript. Zero dependências e sem React: roda no navegador, em Workers e em Node.

## Instalação

O pacote fica no GitHub Packages. Veja o [README do repositório](https://github.com/purplerbr/purpler-ui#consumo) para configurar o `.yarnrc.yml`.

```sh
yarn add @purplerbr/tokens@0.1.0
```

## CSS (Tailwind v4)

```css
@import 'tailwindcss';
@import '@purplerbr/tokens/fonts.css';
@import '@purplerbr/tokens/tokens.css';
@import '@purplerbr/tokens/theme.css';
```

| Arquivo      | O que tem                                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens.css` | variáveis em `:root` (claro) e em `.dark` / `[data-theme='dark']`                                                                                        |
| `theme.css`  | `@theme inline` que liga as variáveis aos utilitários (`bg-primary`, `rounded-lg`, `shadow-md`, `text-title-1`, `font-display`) e `@custom-variant dark` |
| `fonts.css`  | `@font-face` das fontes auto-hospedadas, servidas de `dist/fonts`                                                                                        |

O `theme.css` remove a paleta, os raios e as sombras literais do Tailwind (`bg-red-500` deixa de existir). Só sobram os tokens semânticos.

## TypeScript

```ts
import {
  buildStoreTheme,
  contrastRatio,
  isAccessiblePair,
  pickForeground,
  renderStoreThemeCss,
  STORE_THEME_PRESETS,
} from '@purplerbr/tokens';

contrastRatio('#992faa', '#ffffff'); // 6,28
isAccessiblePair('#fcfaf7', '#5e5454'); // true (texto, 4,5:1)
pickForeground('#ffd400'); // 'oklch(0 0 0)'

// Tema de loja: o lojista escolhe a cor, o resto é derivado com AA garantido.
const theme = buildStoreTheme({
  primary: '#2e6b3e',
  accent: '#d39b2a',
  radius: 'lg',
  font: 'nunito',
});
const css = renderStoreThemeCss(theme); // vai num <style> depois do tokens.css
```

- `buildStoreTheme()` aceita só `#rrggbb`, `#rgb` ou `oklch(L C H)`, um raio de `STORE_RADIUS` e uma fonte de `STORE_FONTS`. Qualquer outro valor lança `TypeError`. As cores são convertidas em números e serializadas de novo, então o valor de entrada nunca chega cru ao CSS.
- `renderStoreThemeCss()` recusa valores que o `buildStoreTheme()` não produziria.
- Exports: `palette`, `semantic`, `SEMANTIC_PAIRS`, `radius`, `spacing`, `shadow`, `typography`, `motion`, `STORE_THEME_PRESETS`, `STORE_FONTS`, `STORE_RADIUS`, `buildStoreTheme()`, `renderStoreThemeCss()`, `contrastRatio()`, `pickForeground()`, `isAccessiblePair()` e utilitários de cor (`toOklch`, `toHex`, `formatOklch`).

## Fontes

Bricolage Grotesque e Figtree (marca) e Inter, Montserrat, Nunito, Lora e Space Grotesk (temas de loja), em woff2 variável dos pacotes Fontsource 5.3.0, subsets latin e latin-ext. Todas sob a SIL Open Font License 1.1; as licenças vão em `dist/fonts/OFL-*.txt`.

## Licença

[MIT](LICENSE)
