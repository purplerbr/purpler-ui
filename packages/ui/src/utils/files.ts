const KB = 1024;
const MB = KB * KB;
const GB = MB * KB;
const sizeFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const listFormat = new Intl.ListFormat('pt-BR', { type: 'disjunction' });

/** `image/png,.zip` → "PNG ou ZIP", for messages about the accepted types. */
export function formatTypes(accept: string): string {
  const names = accept.split(',').map((type) =>
    type
      .trim()
      .replace(/^\.|^.*\//, '')
      .toUpperCase()
  );
  return listFormat.format(names);
}

/** Same rules as the `accept` of a file input: extensions, `type/*` and exact types. */
export function matchesAccept(file: File, accept: string): boolean {
  return accept.split(',').some((raw) => {
    const type = raw.trim().toLowerCase();
    if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type);
    if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -1));
    return file.type === type;
  });
}

/** Bytes in pt-BR, such as "312,4 MB". */
export function formatFileSize(bytes: number): string {
  if (bytes >= GB) return `${sizeFormat.format(bytes / GB)} GB`;
  if (bytes >= MB) return `${sizeFormat.format(bytes / MB)} MB`;
  return `${sizeFormat.format(bytes / KB)} KB`;
}

export function plural(count: number, one: string, many: string): string {
  return `${String(count)} ${count === 1 ? one : many}`;
}

export function moved<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}
