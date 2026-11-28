import { describe, expect, it } from 'vitest';
import { formatFileSize, formatTypes, matchesAccept, moved, plural } from './files';

const KB = 1024;
const MB = KB * KB;

function file(name: string, type = ''): File {
  return new File(['x'], name, { type });
}

describe('formatFileSize', () => {
  it('picks KB, MB or GB at each boundary, in pt-BR', () => {
    expect(formatFileSize(0)).toBe('0 KB');
    expect(formatFileSize(MB - KB)).toBe('1.023 KB');
    expect(formatFileSize(MB)).toBe('1 MB');
    expect(formatFileSize(312.4 * MB)).toBe('312,4 MB');
    expect(formatFileSize(KB * MB - 1)).toBe('1.024 MB');
    expect(formatFileSize(KB * MB)).toBe('1 GB');
    expect(formatFileSize(5 * KB * MB)).toBe('5 GB');
  });
});

describe('formatTypes', () => {
  it('names extensions and mime types in a pt-BR "or" list', () => {
    expect(formatTypes('.zip')).toBe('ZIP');
    expect(formatTypes('.zip, .rar')).toBe('ZIP ou RAR');
    expect(formatTypes('image/png,image/webp,.jpg')).toBe('PNG, WEBP ou JPG');
  });
});

describe('matchesAccept', () => {
  it('matches extensions ignoring case', () => {
    expect(matchesAccept(file('Aula.MP4'), '.mp4')).toBe(true);
    expect(matchesAccept(file('aula.mp4.exe'), '.mp4')).toBe(false);
  });

  it('matches a type family and an exact type', () => {
    expect(matchesAccept(file('a', 'video/mp4'), 'video/*')).toBe(true);
    expect(matchesAccept(file('a', 'image/png'), 'video/*')).toBe(false);
    expect(matchesAccept(file('a', 'video/mp4'), 'image/png, VIDEO/MP4')).toBe(true);
    expect(matchesAccept(file('a', 'video/webm'), 'video/mp4')).toBe(false);
  });
});

describe('plural', () => {
  it('uses the singular only for one', () => {
    expect(plural(0, 'arquivo', 'arquivos')).toBe('0 arquivos');
    expect(plural(1, 'arquivo', 'arquivos')).toBe('1 arquivo');
    expect(plural(2, 'arquivo', 'arquivos')).toBe('2 arquivos');
  });
});

describe('moved', () => {
  it('returns a new list with the item at the new index', () => {
    const list = ['a', 'b', 'c'];

    expect(moved(list, 0, 2)).toEqual(['b', 'c', 'a']);
    expect(moved(list, 2, 0)).toEqual(['c', 'a', 'b']);
    expect(list).toEqual(['a', 'b', 'c']);
  });

  it('keeps the list when the source index does not exist', () => {
    expect(moved(['a', 'b'], 5, 0)).toEqual(['a', 'b']);
  });
});
