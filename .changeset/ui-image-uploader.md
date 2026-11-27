---
'@purplerbr/ui': minor
---

Add `ImageUploader` (`@purplerbr/ui/image-uploader`): the image list of a form, UI only (the app uploads). A drop zone takes files by drag and drop anywhere on it, by click and by keyboard, and sends to `onFilesSelected` only the files within `accept`, `maxSize` and `maxFiles`; the others are listed with the reason. Each image shows a thumbnail, the upload progress, "Processando…" or the error with "Tentar de novo" (`onRetry`); the first one is the cover. Images reorder by drag and drop or with the move buttons (`onReorder`), are removed with `onRemove`, and every change is announced in an `aria-live` region while the focus follows the moved image.
