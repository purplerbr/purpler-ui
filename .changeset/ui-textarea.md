---
'@purplerbr/ui': minor
---

Add `Textarea` (`@purplerbr/ui/textarea`): the multi-line text field, with the same tokens, focus outline, invalid and disabled states as `Input`, for long text such as the store's return and privacy policies. It is a native `<textarea>` (all its props pass through, `rows` defaults to 6) and works inside `FormField` like `Input`, which links the label, help text and error. It grows with the text from `rows` lines up to a maximum height and then scrolls; in browsers without `field-sizing`, `rows` sets the height and the field can be dragged taller.
