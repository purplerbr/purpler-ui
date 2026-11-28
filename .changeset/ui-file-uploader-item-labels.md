---
'@purplerbr/ui': minor
---

`FileUploader` items take two optional props: `processingLabel` replaces "Verificando…" while the item is processing (and in its announcement), and `retryable: false` hides "Tentar de novo" on an error that only a new file fixes, keeping the remove button. Without them, nothing changes.
