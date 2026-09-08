"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * URL-driven open/close state for the Operations modals, mirroring the drawer
 * pattern in `src/hooks/use-query.tsx` but for a query key whose *value* is
 * meaningful (a record id, a stat key, or "true").
 */
export function useOperationsModal(key: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = searchParams.get(key);

  const open = useCallback(
    (v: string = "true") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, v);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [key, pathname, router, searchParams]
  );

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, [key, pathname, router, searchParams]);

  return { value, isOpen: value !== null, open, close };
}

/**
 * A single query param used to remember which tab is showing, so the tab
 * survives a refresh and can be linked to directly.
 */
export function useTabParam(key: string, fallback: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = searchParams.get(key) ?? fallback;

  const setActive = useCallback(
    (v: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, v);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [key, pathname, router, searchParams]
  );

  return { active, setActive };
}
