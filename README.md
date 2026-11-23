# purpler-ui

Design system da Purpler: tokens e componentes React (Tailwind + shadcn).

Monorepo com dois pacotes, publicados no GitHub Packages:

- `@purplerbr/tokens`: paleta, tokens e temas (CSS e TypeScript, sem dependências).
- `@purplerbr/ui`: componentes React em design atômico (atoms, molecules, organisms, templates), com base em shadcn/ui.

A lib tem só componentes de interface. Regra de negócio não entra aqui: os dados chegam por props.

> Status: esqueleto. O toolchain (Storybook, Vitest, build e publicação) entra na primeira tarefa do repo.

## Contribuição

Toda mudança entra por pull request e passa por testes (Vitest + Testing Library + axe), revisão de segurança e revisão de UX.

## Licença

[MIT](LICENSE)
