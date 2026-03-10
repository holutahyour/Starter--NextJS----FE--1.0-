'use client';

import { ReadonlyURLSearchParams, usePathname } from 'next/navigation';

export function useModifyQuery(route: string | null, searchParams: ReadonlyURLSearchParams, queries: { key: string, value?: string }[], type: 'set' | 'remove' = 'remove') {
  const pathname = usePathname();

  const removeQuery = () => {
    const params = new URLSearchParams(searchParams.toString());

    queries.map((query) => {
      params.delete(query.key);
    })

    const queryString = params.toString();
    const newUrl = queryString
      ? `${route ?? pathname}?${queryString}`
      : route ?? pathname;

    return newUrl;
  };

  const setQuery = () => {
    const params = new URLSearchParams(searchParams.toString());

    queries.map(({ key, value }) => {
      if (value) {
        params.set(key, value);
      }
    })

    const newUrl = `${route ?? pathname}?${params.toString()}`;

    return newUrl;
  };

  return type === 'set' ? setQuery() : removeQuery();
}
