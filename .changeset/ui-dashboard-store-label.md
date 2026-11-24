---
'@purplerbr/ui': minor
'@purplerbr/tokens': patch
---

`DashboardLayout` gets `storeLabel`: the current store name in the top bar below `lg`, on one line cut with an ellipsis, with a skeleton and a status while the store loads. Nav group labels use `text-muted-foreground`, and the `account` slot takes the padding of the `store` slot. `SEMANTIC_PAIRS` now checks `sidebar` × `muted-foreground`, `sidebar` × `primary`, `sidebar` × `ring` and `sidebar-accent` × `sidebar-primary`; the light store theme also fits `primary` against `sidebar`.
