# purpler-ui

Design system da Purpler: tokens e componentes React (Tailwind v4 + shadcn/ui), com Storybook.

Monorepo com dois pacotes, publicados no GitHub Packages:

- [`@purplerbr/tokens`](packages/tokens): paleta, tokens, temas e utilitários de cor (CSS e TypeScript, sem dependências).
- [`@purplerbr/ui`](packages/ui): componentes React em design atômico (atoms, molecules, organisms, templates), com base em shadcn/ui.

A lib tem só componentes de interface. Regra de negócio não entra aqui: os dados chegam por props.

## Consumo

O GitHub Packages exige um token para instalar, mesmo com o pacote público. No app, o `.yarnrc.yml` mapeia o escopo `@purplerbr` para o GitHub Packages:

```yaml
npmScopes:
  purplerbr:
    npmRegistryServer: 'https://npm.pkg.github.com'
    npmAuthToken: '${GITHUB_PACKAGES_TOKEN}'
```

- **Na sua máquina:** crie um token clássico do GitHub **só com `read:packages`** e com expiração (no máximo 90 dias) e exporte como `GITHUB_PACKAGES_TOKEN`. Nunca commite o token.
- **No CI:** use o `GITHUB_TOKEN` do job, com `permissions: packages: read`, na variável `GITHUB_PACKAGES_TOKEN`.
- O mapeamento explícito do escopo evita _dependency confusion_: `@purplerbr/*` nunca vem do registro público do npm.
- Instale com versão exata (sem `^`): `yarn add @purplerbr/ui@0.1.0 @purplerbr/tokens@0.1.0`.

A configuração do CSS e os exemplos de uso estão nos READMEs de [`@purplerbr/tokens`](packages/tokens/README.md) e de [`@purplerbr/ui`](packages/ui/README.md).

## Desenvolvimento

```sh
nvm use                # Node 24
yarn install           # Yarn 4.13 (a release está em .yarn/releases) e hooks do Husky
yarn storybook         # constrói os tokens e abre o Storybook em http://127.0.0.1:6006
```

Antes de abrir um PR: `yarn lint:ci`, `yarn format:check`, `yarn typecheck`, `yarn test:coverage` e `yarn build`. O hook de pre-commit roda o `gitleaks`, que precisa estar instalado (`brew install gitleaks`).

### Novo componente

1. Gere com o shadcn CLI, que fica nas devDependencies de `@purplerbr/ui`:

   ```sh
   yarn workspace @purplerbr/ui shadcn add <componente>
   ```

   O arquivo sai em `packages/ui/src/generated/` (ignorado pelo git).

2. Mova para a pasta atômica: `src/{atoms,molecules,organisms,templates}/<Nome>/` com `<Nome>.tsx`, `<Nome>.variants.ts` (cva), `<Nome>.stories.tsx`, `<Nome>.test.tsx` e `index.ts`.
3. Troque os valores por tokens: cores semânticas (`bg-primary`, `text-muted-foreground`), `rounded-*`, `shadow-*` e foco com `outline-ring`. Nada de cor, raio, sombra ou fonte literal.
4. Troque o `import { cn } from "cn"` gerado pelo `cn` da lib (`../../utils/cn`) e, se o CLI tiver adicionado o pacote `cn` às dependências, remova (`yarn workspace @purplerbr/ui remove cn`).
5. Rode `yarn workspace @purplerbr/ui exports:sync` para criar o subpath do componente no `package.json`.

### Versões e publicação

- Toda mudança em pacote precisa de changeset: `yarn changeset`. O CI confere no PR.
- Para lançar, um PR de release roda `yarn changeset version`. Depois do merge em `main`, o workflow `release` roda todos os portões (lint, typecheck, testes, build e segurança) e o `changeset publish` publica no GitHub Packages as versões que ainda não existem lá. Com o Yarn 4, o changesets publica com `yarn npm publish`, que troca o `workspace:*` pela versão exata.
- Só `dist/` vai para o pacote. O CI confere o que o `yarn pack` empacota (`yarn pack:check`): os arquivos e o `package.json`, que não pode ter `workspace:`.

## Contribuição

Toda mudança entra por pull request e passa por testes (Vitest + Testing Library + axe), revisão de segurança e revisão de UX.

## Licença

[MIT](LICENSE)
