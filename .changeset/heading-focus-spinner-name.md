---
'@purplerbr/ui': patch
---

`Heading` shows no focus ring when a page moves focus to it by script (`tabIndex={-1}`); a heading is never in the tab order. `Spinner` is now named by its `label` (`aria-label`), so `getByRole('status', { name })` finds it, and props can no longer replace its `role` or name.
