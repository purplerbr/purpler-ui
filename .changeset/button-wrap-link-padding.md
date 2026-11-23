---
'@purplerbr/ui': patch
---

`Button`: long labels now wrap, centered and balanced, instead of overflowing, and a single long word (a store name without spaces) breaks; the text sizes use a minimum height, so a single-line button keeps its height and icon-only buttons keep their fixed square. `variant="link"` drops the side padding, so it lines up with the text next to it.
