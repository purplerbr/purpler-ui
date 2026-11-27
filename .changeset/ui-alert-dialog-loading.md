---
'@purplerbr/ui': minor
---

`AlertDialogAction` takes `loading`: it passes it to the `Button` (spinner, `aria-busy` and `aria-disabled`, focus kept) and, while loading, a click or Enter neither runs `onClick` nor closes the dialog.
