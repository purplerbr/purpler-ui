import { readFileSync } from 'node:fs';

export const ROOT = new URL('../../', import.meta.url);

export function read(path: string): string {
  return readFileSync(new URL(path, ROOT), 'utf8');
}

export function readJson(path: string): unknown {
  return JSON.parse(read(path));
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
