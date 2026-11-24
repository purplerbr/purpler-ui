import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  parseTableUrlState,
  useTableUrlState,
  type TableUrlAdapter,
  type TableUrlStateConfig,
} from './useTableUrlState';

const CONFIG: TableUrlStateConfig<'status' | 'type'> = {
  sortable: ['name', 'price'],
  limits: [10, 20, 50, 100],
  filters: { status: ['active', 'draft'], type: ['physical', 'digital'] },
};

const parse = (query: string, config = CONFIG) =>
  parseTableUrlState(new URLSearchParams(query), config);

describe('parseTableUrlState', () => {
  it('applies a shared link as is', () => {
    const { state, normalized } = parse('sort=price&order=desc&page=3&status=active&limit=50');

    expect(state).toEqual({
      page: 3,
      limit: 50,
      sort: 'price',
      order: 'desc',
      filters: { status: 'active' },
    });
    expect(normalized.toString()).toBe('sort=price&order=desc&page=3&status=active&limit=50');
  });

  it('falls back to the defaults without params', () => {
    expect(parse('').state).toEqual({
      page: 1,
      limit: 10,
      sort: undefined,
      order: undefined,
      filters: {},
    });
    expect(
      parse('', { ...CONFIG, defaultSort: { sort: 'name', order: 'asc' }, defaultLimit: 20 }).state
    ).toEqual({ page: 1, limit: 20, sort: 'name', order: 'asc', filters: {} });
  });

  it.each([
    ['page=0', 'page'],
    ['page=-2', 'page'],
    ['page=abc', 'page'],
    ['page=1.5', 'page'],
    ['page=01', 'page'],
    ['page=99999999999', 'page'],
    ['limit=7', 'limit'],
    ['limit=1000', 'limit'],
    ['status=archived', 'status'],
    ['type=%3Cscript%3E', 'type'],
  ])('drops %s and keeps the default for %s', (query, key) => {
    const { state, normalized } = parse(query);

    expect(normalized.has(key)).toBe(false);
    expect(state.page).toBe(1);
    expect(state.limit).toBe(10);
    expect(state.filters).toEqual({});
  });

  it('drops a sort that is not a sortable column, with its order', () => {
    const { state, normalized } = parse('sort=cost&order=desc&page=2');

    expect(state.sort).toBeUndefined();
    expect(state.order).toBeUndefined();
    expect(normalized.toString()).toBe('page=2');
  });

  it('keeps a valid sort and turns an unknown order into ascending', () => {
    const { state, normalized } = parse('sort=price&order=up');

    expect(state).toMatchObject({ sort: 'price', order: 'asc' });
    expect(normalized.toString()).toBe('sort=price');
  });

  it('keeps the first valid value of a repeated param', () => {
    const { state, normalized } = parse('page=2&page=5&status=nope&status=draft');

    expect(state.page).toBe(2);
    expect(state.filters).toEqual({});
    expect(normalized.getAll('page')).toEqual(['2']);
    expect(normalized.has('status')).toBe(false);
  });

  it('leaves params it does not manage alone', () => {
    expect(parse('tab=orders&page=x').normalized.toString()).toBe('tab=orders');
  });
});

describe('useTableUrlState with the window adapter', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/produtos');
  });
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('opens a shared link already in its state, without touching the history', () => {
    window.history.replaceState(null, '', '/produtos?sort=price&order=desc&page=3&status=active');
    const push = vi.spyOn(window.history, 'pushState');
    const replace = vi.spyOn(window.history, 'replaceState');

    const { result } = renderHook(() => useTableUrlState(CONFIG));

    expect(result.current.state).toEqual({
      page: 3,
      limit: 10,
      sort: 'price',
      order: 'desc',
      filters: { status: 'active' },
    });
    expect(result.current.query).toEqual({
      page: 3,
      limit: 10,
      sort: 'price',
      order: 'desc',
      status: 'active',
    });
    expect(push).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it('replaces invalid params with the defaults, keeping the path and the hash', () => {
    window.history.replaceState(null, '', '/produtos?page=-1&sort=hack&limit=5&tab=x#lista');
    const push = vi.spyOn(window.history, 'pushState');
    const replace = vi.spyOn(window.history, 'replaceState');

    const { result } = renderHook(() => useTableUrlState(CONFIG));

    expect(replace).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
    expect(`${window.location.pathname}${window.location.search}${window.location.hash}`).toBe(
      '/produtos?tab=x#lista'
    );
    expect(result.current.state.page).toBe(1);
  });

  it('pushes a history entry on page change and keeps the other params', () => {
    window.history.replaceState(null, '', '/produtos?status=draft');
    const push = vi.spyOn(window.history, 'pushState');
    const { result } = renderHook(() => useTableUrlState(CONFIG));

    act(() => {
      result.current.setPage(2);
    });

    expect(push).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe('?status=draft&page=2');
    expect(result.current.state.page).toBe(2);

    act(() => {
      result.current.setPage(1);
    });
    expect(window.location.search).toBe('?status=draft');
  });

  it('sorts a new column ascending, flips it on the next toggle and goes back to page 1', () => {
    window.history.replaceState(null, '', '/produtos?page=4');
    const { result } = renderHook(() => useTableUrlState(CONFIG));

    act(() => {
      result.current.toggleSort('price');
    });
    expect(window.location.search).toBe('?sort=price&order=asc');

    act(() => {
      result.current.toggleSort('price');
    });
    expect(result.current.state).toMatchObject({ sort: 'price', order: 'desc', page: 1 });

    act(() => {
      result.current.toggleSort('price');
    });
    expect(result.current.state.order).toBe('asc');
  });

  it('sets and clears a filter and a page size, back on page 1', () => {
    window.history.replaceState(null, '', '/produtos?page=3');
    const { result } = renderHook(() => useTableUrlState(CONFIG));

    act(() => {
      result.current.setFilter('type', 'digital');
    });
    expect(window.location.search).toBe('?type=digital');

    act(() => {
      result.current.setLimit(50);
    });
    expect(result.current.state).toMatchObject({ limit: 50, page: 1 });

    act(() => {
      result.current.setLimit(10);
      result.current.setFilter('type', undefined);
    });
    expect(window.location.search).toBe('');
  });

  it('follows the browser back and forward buttons (popstate)', () => {
    const { result } = renderHook(() => useTableUrlState(CONFIG));

    act(() => {
      window.history.replaceState(null, '', '/produtos?page=5&sort=name&order=desc');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current.state).toMatchObject({ page: 5, sort: 'name', order: 'desc' });
  });

  it('stops listening to popstate after unmount', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useTableUrlState(CONFIG));
    const listener = add.mock.calls.find(([type]) => type === 'popstate')?.[1];

    unmount();

    expect(listener).toBeTypeOf('function');
    expect(remove).toHaveBeenCalledWith('popstate', listener);
  });
});

describe('useTableUrlState with a router adapter', () => {
  it('reads from the adapter and writes with push or replace', () => {
    const setSearchParams = vi.fn<TableUrlAdapter['setSearchParams']>();
    const adapter = { searchParams: new URLSearchParams('page=2&order=desc'), setSearchParams };

    const { result } = renderHook(() => useTableUrlState(CONFIG, adapter));
    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.state.page).toBe(2);
    expect(setSearchParams).toHaveBeenNthCalledWith(1, new URLSearchParams('page=2'), {
      replace: true,
    });
    expect(setSearchParams).toHaveBeenLastCalledWith(new URLSearchParams('page=3'), {
      replace: false,
    });
  });
});

describe('parseTableUrlState with untrusted links', () => {
  it.each([
    ['sort=hack&sort=name&order=desc', undefined, ''],
    ['sort=name&sort=price&order=desc&order=asc', 'name', 'sort=name&order=desc'],
    ['order=desc&order=asc&sort=price', 'price', 'sort=price&order=desc'],
  ])('reads only the first value of a repeated sort or order in %s', (query, sort, expected) => {
    const { state, normalized } = parse(query);

    expect(state.sort).toBe(sort);
    expect(normalized.toString()).toBe(expected);
  });

  it('keeps the largest page it accepts and drops the next one', () => {
    expect(parse('page=999999999').state.page).toBe(999999999);
    expect(parse('page=1000000000').normalized.toString()).toBe('');
    expect(parse('page=%2B2').normalized.toString()).toBe('');
    expect(parse('page=2%20').normalized.toString()).toBe('');
  });

  it('decodes percent-encoded values before checking them', () => {
    const { state, normalized } = parse('sort=na%6De&status=act%69ve&page=%32');

    expect(state).toMatchObject({ sort: 'name', page: 2, filters: { status: 'active' } });
    expect(normalized.toString()).toBe('sort=name&status=active&page=2');
  });

  it('drops a malformed escape without throwing and keeps unmanaged values as decoded', () => {
    const { state, normalized } = parse('sort=%E0%A4%A&q=caf%C3%A9+azul&Sort=price&tab');

    expect(state.sort).toBeUndefined();
    expect(normalized.get('q')).toBe('café azul');
    expect(normalized.get('Sort')).toBe('price');
    expect(normalized.has('tab')).toBe(true);
    expect(normalized.has('sort')).toBe(false);
  });
});

describe('useTableUrlState actions on untrusted state', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/produtos');
  });
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('goes back to page 1 when the page size changes', () => {
    window.history.replaceState(null, '', '/produtos?page=3&q=caf%C3%A9');
    const { result } = renderHook(() => useTableUrlState(CONFIG));

    act(() => {
      result.current.setLimit(50);
    });

    expect(window.location.search).toBe('?q=caf%C3%A9&limit=50');
    expect(result.current.state).toMatchObject({ page: 1, limit: 50 });
  });

  it('floors a fractional page and clears an invalid one', () => {
    const { result } = renderHook(() => useTableUrlState(CONFIG));

    act(() => {
      result.current.setPage(2.7);
    });
    expect(window.location.search).toBe('?page=2');

    act(() => {
      result.current.setPage(Number.NaN);
    });
    expect(window.location.search).toBe('');
  });

  it('flips a default sort that is not in the URL yet', () => {
    const { result } = renderHook(() =>
      useTableUrlState({ ...CONFIG, defaultSort: { sort: 'price', order: 'desc' } })
    );

    act(() => {
      result.current.toggleSort('price');
    });

    expect(window.location.search).toBe('?sort=price&order=asc');
  });

  it('follows a real history back and forward after its own pushes', async () => {
    const { result } = renderHook(() => useTableUrlState(CONFIG));
    act(() => {
      result.current.setPage(2);
    });
    act(() => {
      result.current.toggleSort('name');
    });

    act(() => {
      window.history.back();
    });
    await waitFor(() => {
      expect(result.current.state).toMatchObject({ page: 2, sort: undefined });
    });

    act(() => {
      window.history.forward();
    });
    await waitFor(() => {
      expect(result.current.state).toMatchObject({ page: 1, sort: 'name', order: 'asc' });
    });
  });
});
