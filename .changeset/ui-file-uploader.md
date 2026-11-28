---
'@purplerbr/ui': minor
---

Add `FileUploader` (`@purplerbr/ui/file-uploader`): the file list of a form (digital products, course videos), UI only (the app uploads). A drop zone takes files by drag and drop anywhere on it, by click and by keyboard, and sends to `onFilesSelected` only the files within `accept`, `maxSize` and `maxFiles`; the others are listed with the reason. Each row shows the name, the size in pt-BR, the upload progress, "Verificando…", "Enviado" or the error with "Tentar de novo" (`onRetry`). Rows are removed with `onRemove` and, when `onReorder` is given, reorder by drag and drop or with the move buttons. Status changes are announced in a polite `aria-live` region. `title`, `description` and `emptyHint` set the copy. The type, size and list helpers of `ImageUploader` now live in a shared internal util, with no change to its behavior.
