# @purplerbr/ui

Componentes React da Purpler, em design atômico (`atoms`, `molecules`, `organisms`, `templates`), com base em shadcn/ui (Radix + cva) e nos tokens de `@purplerbr/tokens`.

A lib é só de interface: sem regra de negócio, sem chamada de API e sem store de domínio. Os dados chegam por props.

## Instalação

O pacote fica no GitHub Packages. Veja o [README do repositório](https://github.com/purplerbr/purpler-ui#consumo) para configurar o `.yarnrc.yml`.

```sh
yarn add @purplerbr/ui@0.1.0 @purplerbr/tokens@0.1.0 lucide-react
```

`react` e `react-dom` (19 ou mais) e `lucide-react` são `peerDependencies`.

## CSS (Tailwind v4)

```css
@import 'tailwindcss';
@import '@purplerbr/tokens/fonts.css';
@import '@purplerbr/tokens/tokens.css';
@import '@purplerbr/tokens/theme.css';
@import '@purplerbr/ui/styles.css';
@source '../../node_modules/@purplerbr/ui/dist';
```

O `@source` faz o Tailwind do app compilar as classes dos componentes.

## Uso

```tsx
import { Button } from '@purplerbr/ui/button';

<Button onClick={publicar}>Publicar loja</Button>;
<Button variant="outline" asChild>
  <a href="/pedidos">Ver pedidos</a>
</Button>;
<Button loading>Salvando produto</Button>;
```

Cada componente tem um subpath em kebab-case (`@purplerbr/ui/button`). A raiz (`@purplerbr/ui`) exporta tudo, inclusive o `cn`.

## Licença

[MIT](LICENSE)
