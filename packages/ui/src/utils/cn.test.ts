import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins conditional class names', () => {
    expect(cn('px-4', false, undefined, null, { 'font-semibold': true, hidden: false })).toBe(
      'px-4 font-semibold'
    );
  });

  it('lets the last conflicting utility win', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('bg-primary', 'bg-secondary')).toBe('bg-secondary');
  });

  it('knows the token utilities, so a text style and a text color can live together', () => {
    expect(cn('text-display', 'text-primary')).toBe('text-display text-primary');
    expect(cn('text-small', 'text-body')).toBe('text-body');
    expect(cn('rounded-md', 'rounded-button')).toBe('rounded-button');
    expect(cn('font-sans', 'font-display')).toBe('font-display');
    expect(cn('ease-enter', 'ease-standard')).toBe('ease-standard');
  });
});
