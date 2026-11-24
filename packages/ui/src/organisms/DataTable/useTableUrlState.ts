import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';

export type SortOrder = 'asc' | 'desc';

/** Bridge to the app's router; React Router's `useSearchParams` pair fits as is. */
export interface TableUrlAdapter {
  searchParams: URLSearchParams;
  setSearchParams: (next: URLSearchParams, options: { replace: boolean }) => void;
}

export interface TableUrlStateConfig<Filter extends string = string> {
  /** Column keys that may be sorted; any other `sort` in the URL is dropped. */
  sortable?: readonly string[];
  defaultSort?: { sort: string; order: SortOrder };
  /** Allowed page sizes; the backend caps `limit` at 100. */
  limits?: readonly number[];
  defaultLimit?: number;
  /** Allowed values per filter param, such as `{ status: ['active', 'draft'] }`. */
  filters?: Readonly<Record<Filter, readonly string[]>>;
}

export interface TableUrlState<Filter extends string = string> {
  page: number;
  limit: number;
  sort: string | undefined;
  order: SortOrder | undefined;
  filters: Partial<Record<Filter, string>>;
}

export const DEFAULT_LIMITS = [10, 20, 50, 100] as const;
const isOrder = (value: string | null): value is SortOrder => value === 'asc' || value === 'desc';

const listeners = new Set<() => void>();
const notify = (): void => {
  for (const listener of listeners) listener();
};
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

/** Adapter over `window.location` and `history`, for apps without a router. */
export function useWindowSearchParams(): TableUrlAdapter {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => ''
  );
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const setSearchParams = useCallback(
    (next: URLSearchParams, { replace }: { replace: boolean }) => {
      const query = next.toString();
      const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
      if (replace) window.history.replaceState(window.history.state, '', url);
      else window.history.pushState(null, '', url);
      notify();
    },
    []
  );
  return { searchParams, setSearchParams };
}

const isPage = (value: string): boolean => /^[1-9]\d{0,8}$/.test(value);

/** The first value of `key` when it passes `isValid`; `undefined` otherwise. */
function read(params: URLSearchParams, key: string, isValid: (value: string) => boolean) {
  const value = params.get(key);
  return value !== null && isValid(value) ? value : undefined;
}

/** Reads the managed params; keeps only valid ones and leaves every other param alone. */
export function parseTableUrlState<Filter extends string>(
  params: URLSearchParams,
  config: TableUrlStateConfig<Filter>
): { state: TableUrlState<Filter>; normalized: URLSearchParams } {
  const limits = config.limits ?? DEFAULT_LIMITS;
  const defaultLimit = config.defaultLimit ?? limits[0] ?? 10;
  const filterValues: [string, readonly string[]][] = Object.entries(config.filters ?? {});

  const page = read(params, 'page', isPage);
  const limit = read(params, 'limit', (value) => limits.some((item) => String(item) === value));
  const sort = read(params, 'sort', (value) => config.sortable?.includes(value) ?? false);
  // An order without a valid sort means nothing, so it goes too.
  const rawOrder = sort === undefined ? null : params.get('order');
  const order = isOrder(rawOrder) ? rawOrder : undefined;
  const managed: Record<string, string | undefined> = { page, limit, sort, order };
  const filters: Partial<Record<string, string>> = {};
  for (const [name, allowed] of filterValues) {
    const value = read(params, name, (item) => allowed.includes(item));
    managed[name] = value;
    if (value !== undefined) filters[name] = value;
  }

  const normalized = new URLSearchParams(params);
  for (const [key, value] of Object.entries(managed)) {
    if (params.getAll(key).length === (value === undefined ? 0 : 1)) continue;
    normalized.delete(key);
    if (value !== undefined) normalized.set(key, value);
  }

  return {
    state: {
      page: page === undefined ? 1 : Number(page),
      limit: limit === undefined ? defaultLimit : Number(limit),
      sort: sort ?? config.defaultSort?.sort,
      order: sort === undefined ? config.defaultSort?.order : (order ?? 'asc'),
      filters,
    },
    normalized,
  };
}

/**
 * Table state (page, limit, sort, order, filters) kept in the URL, validated against `config`.
 * Changes push a history entry; invalid params are dropped with a replace.
 */
export function useTableUrlState<Filter extends string = string>(
  config: TableUrlStateConfig<Filter>,
  adapter?: TableUrlAdapter
) {
  const windowAdapter = useWindowSearchParams();
  const { searchParams, setSearchParams } = adapter ?? windowAdapter;
  const { state, normalized } = parseTableUrlState(searchParams, config);
  const isNormal = normalized.toString() === searchParams.toString();

  useEffect(() => {
    if (!isNormal) setSearchParams(normalized, { replace: true });
  });

  const defaultLimit = config.defaultLimit ?? (config.limits ?? DEFAULT_LIMITS)[0];
  // Two setters in one event both build on the latest params, not on this render's.
  const latest = useRef(normalized);
  useEffect(() => {
    latest.current = normalized;
  });
  const update = (changes: Record<string, string | number | undefined>): void => {
    const next = new URLSearchParams(latest.current);
    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined) next.delete(key);
      else next.set(key, String(value));
    }
    latest.current = next;
    setSearchParams(next, { replace: false });
  };

  return {
    state,
    /** Params for the API call: `page`, `limit`, `sort` and `order` when set, and the filters. */
    query: {
      page: state.page,
      limit: state.limit,
      ...(state.sort === undefined ? {} : { sort: state.sort, order: state.order ?? 'asc' }),
      ...state.filters,
    },
    setPage: (page: number) => {
      update({ page: Math.floor(page) > 1 ? Math.floor(page) : undefined });
    },
    setLimit: (limit: number) => {
      update({ limit: limit === defaultLimit ? undefined : limit, page: undefined });
    },
    /** A new column sorts ascending; the same column flips between ascending and descending. */
    toggleSort: (column: string) => {
      const order: SortOrder = state.sort === column && state.order === 'asc' ? 'desc' : 'asc';
      update({ sort: column, order, page: undefined });
    },
    setFilter: (name: Filter, value: string | undefined) => {
      update({ [name]: value, page: undefined });
    },
  };
}
