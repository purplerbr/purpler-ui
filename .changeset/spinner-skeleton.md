---
'@purplerbr/ui': minor
---

Add the `Spinner` and `Skeleton` atoms for loading states. `Spinner` is a `role="status"` region labelled "Carregando…" by default; under reduced motion the ring stops and the label shows. `Spinner` is for lazy route chunks; data screens use `Skeleton`, an `aria-hidden` `bg-skeleton` block that stops pulsing under reduced motion; its container announces the loading.
