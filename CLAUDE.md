# CLAUDE.md — purpler-ui

Repo do design system da Purpler. Segue o `CLAUDE.md` da raiz do workspace (§5, §8, §10 e §11), que é a fonte da verdade; aqui ficam só os detalhes deste repo. **O repo é público:** nada de infra, segredo, URL interna ou link para repo privado em arquivo versionado.

- **Agente dono:** `ux-designer`. Validadores: `tester` → `security-lgpd`.
- Dois pacotes: `packages/tokens` (`@purplerbr/tokens`) e `packages/ui` (`@purplerbr/ui`), publicados no GitHub Packages.
- **Só frontend:** sem regra de negócio, sem chamada de API, sem store de domínio. Tudo entra por props.
- **Design atômico:** `atoms/`, `molecules/`, `organisms/`, `templates/`. Uma pasta por componente: `X.tsx`, `X.variants.ts` (cva), `X.stories.tsx`, `X.test.tsx`, `index.ts`.
- **Base shadcn/ui** (Radix + cva + `cn`). Nenhuma cor, raio, sombra ou fonte literal fora de `@purplerbr/tokens`.
- **Acessibilidade WCAG 2.2 AA:** o teste de contraste dos temas é obrigatório.
- Comentários de código: no máximo 2 linhas cada.

## `@purplerbr/tokens`

- **Fonte dos valores:** a marca Balcão. `test/fixtures/paleta.json` é a cópia aprovada da paleta; `palette.test.ts` falha se `palette` ou `semantic` divergirem dela. Mudou a marca → atualize a fixture e os tokens no mesmo PR.
- **CSS gerado do TypeScript:** `tokens.css`, `theme.css` e `fonts.css` saem de `src/css.ts` no `onSuccess` do tsup, direto em `dist/`. Não existe CSS escrito à mão.
- **`theme.css`** usa `@theme inline` e zera as escalas literais do Tailwind (`--color-*`, `--font-*`, `--font-weight-*`, `--text-*`, `--radius-*`, `--shadow-*`, `--inset-shadow-*`, `--drop-shadow-*`, `--text-shadow-*` e `--ease-*`): só os tokens viram utilitários. Use `text-small`/`text-body`/`text-title-*`, nunca `text-sm`. Os pesos são os da marca (`font-normal` a `font-extrabold`). Os raios derivam de `--radius`, e os botões usam `rounded-button` (`--button-radius`). `packages/ui/test/tailwindTheme.test.ts` compila o `theme.css` com o Tailwind e confere o que existe e o que não existe.
- **Tema de loja:** `buildStoreTheme()` deriva todos os tokens da cor do lojista e ajusta a luminosidade até cada par de `SEMANTIC_PAIRS` passar no AA (claro e escuro). Entrada fora do contrato (inclusive número malformado como `oklch(1.2.3 0 0)` ou valor que não é string) lança `TypeError`. `renderStoreThemeCss()` recusa valores que o builder não produziria e qualquer par abaixo do AA.
- **Fontes:** woff2 variáveis do Fontsource 5.3.0 em `packages/tokens/fonts/`, com as licenças OFL. Família nova entra em `FONT_FAMILIES` (`src/fonts.ts`) e o teste confere arquivo × `@font-face` × licença.
- Código de `src/` não importa APIs do Node (regra do ESLint); só os testes e a config do tsup usam `node:*`.

## `@purplerbr/ui`

- **Build:** tsup com entradas por glob (`src/index.ts` + `src/{atoms,molecules,organisms,templates}/*/index.ts`), ESM e `dts`. O `styles.css` é copiado para `dist/`.
- **Exports:** um subpath kebab-case por pasta de componente. `scripts/exports.ts` gera o mapa (`yarn workspace @purplerbr/ui exports:sync`); o CI e `tests/repo/packages.test.ts` falham se o `package.json` estiver desatualizado.
- **`cn`:** `src/utils/cn.ts` (clsx + tailwind-merge configurado com os utilitários dos tokens). O shadcn CLI 4 gera `import { cn } from "cn"` e adiciona o pacote `cn`: troque pelo nosso e remova o pacote (o teste de manifesto falha se ele estiver nas dependências).
- **Storybook 10** (`.storybook/`): builder Vite com `@tailwindcss/vite`, addons docs e a11y, telemetria desligada. A toolbar tem **Tema** (claro/escuro, classe `.dark` no `<html>`) e **Marca** (Purpler ou um preset de loja, aplicado com `renderStoreThemeCss()`). Os tokens TS vêm do código-fonte (alias); o CSS vem do pacote construído, como nos apps, por isso o script `storybook` constrói os tokens antes.
- **Fundamentos** (`src/foundations/`, fora do build e da cobertura; tabela larga fica num `DataTable` com `role="region"`, rótulo e `tabIndex={0}`, para rolar pelo teclado a 360 px): Marca, Cores, Tipografia, Espaçamento, Raios e elevação, Movimento, Ícones e Voz. Os logos ficam em `src/assets/brand/`, cópia de `docs/marca` do repo de coordenação.

## Comandos

| Comando                                            | O que faz                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn install`                                     | instala as dependências e os hooks do Husky                                                                                                                                                                                                                                                                                             |
| `yarn storybook`                                   | constrói os tokens e sobe o Storybook em `http://127.0.0.1:6006`                                                                                                                                                                                                                                                                        |
| `yarn build`                                       | constrói os dois pacotes (tokens antes da ui)                                                                                                                                                                                                                                                                                           |
| `yarn build-storybook`                             | gera o Storybook estático em `packages/ui/storybook-static/` (ignorado pelo git)                                                                                                                                                                                                                                                        |
| `yarn lint` / `yarn lint:ci`                       | ESLint (typescript-eslint strict, jsx-a11y, react-hooks, storybook, sonarjs) com e sem `--fix`                                                                                                                                                                                                                                          |
| `yarn format` / `yarn format:check`                | Prettier                                                                                                                                                                                                                                                                                                                                |
| `yarn typecheck`                                   | `tsc` da raiz e de cada pacote                                                                                                                                                                                                                                                                                                          |
| `yarn test`                                        | Vitest: projetos `tokens` (node), `ui` (jsdom + Testing Library + vitest-axe) e `repo` (manifestos, workflows, lockfile)                                                                                                                                                                                                                |
| `yarn test:coverage`                               | o mesmo, com cobertura v8 (mínimo de 80% em linhas, funções, branches e statements)                                                                                                                                                                                                                                                     |
| `yarn test:storybook`                              | Playwright (Chromium e WebKit) contra o Storybook local: Fundamentos e Button em claro e escuro, presets de loja, axe WCAG 2.2 AA, teclado e 360/768/1280 px. Não roda no CI                                                                                                                                                            |
| `yarn pack:check`                                  | `yarn pack` dos dois pacotes num diretório ignorado dentro do repo (`node_modules/.cache/purpler-pack-check/`): só `dist/`, sem fonte, teste, story, mapa ou `.env`, e o `package.json` empacotado sem `workspace:` e com `@purplerbr/*` em versão exata (precisa de `yarn build` antes). Nenhum script ou teste deste repo chama `npm` |
| `yarn changeset`                                   | registra a mudança de versão de um pacote                                                                                                                                                                                                                                                                                               |
| `yarn workspace @purplerbr/ui shadcn add <x>`      | gera um componente do shadcn em `src/generated/` (ignorado pelo git)                                                                                                                                                                                                                                                                    |
| `yarn npm audit --all --recursive --severity high` | auditoria de dependências (a mesma do CI)                                                                                                                                                                                                                                                                                               |
| `gitleaks git --redact --no-banner .`              | varredura de segredos no histórico (a mesma do CI)                                                                                                                                                                                                                                                                                      |

- **R23:** o `yarn.lock` vazio no primeiro commit fixou a raiz do projeto neste repo. Sem ele, o Yarn sobe até a pasta pessoal do usuário. Rode o gerenciador só daqui de dentro.
- **Navegadores do Playwright:** `yarn playwright install chromium webkit` na primeira vez. Screenshots e traces ficam em `test-results/` e `playwright-report/` (ignorados pelo git) e nunca viram artifact público.
- **WebKit:** no macOS, Tab não passa por botões sem o "Acesso total ao teclado"; os testes usam Option+Tab no WebKit.

## Testes

- Comportamento e ARIA, não classes CSS. Teclado e `axe` em todo componente interativo.
- O `axe` do jsdom não calcula contraste; o contraste é garantido pelos testes de tokens (pares semânticos, presets e o teste de propriedade com 400 cores aleatórias) e conferido no navegador real pelo `yarn test:storybook`.
- `vitest-axe` 0.1 ainda tipa o matcher no namespace antigo `Vi`; `test/vitest-axe.d.ts` registra o `toHaveNoViolations` no `vitest`.
- `eslint-plugin-jsx-a11y` 6.10 declara peer até o ESLint 9; funciona no 10 (não usa as APIs removidas). O aviso do Yarn é esperado até sair uma versão nova.

## Git e CI

- **Hooks:** `pre-commit` roda `lint-staged` e `gitleaks git --pre-commit --staged`; `commit-msg` roda o commitlint; `pre-push` roda `typecheck` e `test`.
- **CI** (`ci.yml`, em todo PR): `setup` → `lint` ‖ `typecheck` → `test` (cobertura + `diff-cover` de 80%) → `build` (pacotes, exports, `yarn pack` com conferência do manifesto, Storybook estático, changeset do PR), e `security` (gitleaks no histórico + `yarn npm audit`). `permissions: contents: read`, actions fixadas por SHA e nenhum segredo.
- **Release** (`release.yml`, push em `main`): os mesmos portões e o job `publish`, o único com `packages: write`, que usa o `GITHUB_TOKEN` do job e roda `changeset publish --no-git-tag` (§8.8). Com o Yarn 4, o changesets publica com `yarn npm publish`, que troca o `workspace:*` pela versão exata (os apps pinam versão exata). Ele não publica enquanto houver changeset pendente. Tags de release ainda não são criadas (exigiriam `contents: write`). Sem `id-token`, sem token da Cloudflare: o deploy do Storybook não acontece neste repo.
- `tests/repo/workflows.test.ts` falha se algum workflow usar action sem SHA, pedir `id-token`, ler `secrets.`, rodar em `pull_request_target`, tocar a Cloudflare ou dar `packages: write` fora do job `publish`.
