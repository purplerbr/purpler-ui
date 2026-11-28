---
'@purplerbr/ui': minor
---

Add `SingleImageUploader` (`@purplerbr/ui/single-image-uploader`): one image, such as the store logo or favicon, UI only (the app uploads). Without an image it shows a drop zone for one file; with one, it shows the whole image (`object-contain` on a neutral box, so wide logos are not cropped and transparent PNGs stay visible) with "Trocar" and "Remover". A file dropped anywhere on it adds or replaces the image. Only a file within `accept` and `maxSize` reaches `onFileSelected`; otherwise it shows the reason in pt-BR, also for several files at once. It has the same upload progress, "Processando…", error with "Tentar de novo" (`onRetry`) and polite announcements as `ImageUploader`, without the cover badge or reorder.
