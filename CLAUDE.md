# CLAUDE.md — purpler-ui

Repo do design system da Purpler. Detalha só o que é específico deste repo.

- Dois pacotes: `packages/tokens` (`@purplerbr/tokens`) e `packages/ui` (`@purplerbr/ui`).
- **Só frontend:** sem regra de negócio, sem chamada de API, sem store de domínio. Tudo entra por props.
- **Design atômico:** `atoms/`, `molecules/`, `organisms/`, `templates/`. Uma pasta por componente: `X.tsx`, `X.variants.ts` (cva), `X.stories.tsx`, `X.test.tsx`, `index.ts`.
- **Base shadcn/ui** (Radix + cva + `cn`). Nenhuma cor, raio, sombra ou fonte literal fora de `@purplerbr/tokens`.
- **Acessibilidade WCAG 2.2 AA:** o teste de contraste dos temas é obrigatório.
- **Testes:** Vitest + Testing Library + user-event + vitest-axe, com cobertura ≥ 80% (global e nas linhas alteradas).
- **Storybook:** CSF3, autodocs e uma story `AllVariants` por componente.
- Comentários de código: no máximo 2 linhas cada.

Comandos: definidos no bootstrap do toolchain.
