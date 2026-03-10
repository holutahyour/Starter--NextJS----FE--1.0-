import { useCallback, useEffect, useRef, useState } from "react";
import apiHandler from "@/data/api/ApiHandler";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  params: Record<string, any>;
}

interface PrefetchCacheOptions<T> {
  fetchFunction: (params: any) => Promise<T>;
  cacheTimeout?: number; // milliseconds
  maxCacheSize?: number;
}

export interface PrefetchCacheResult<T> {
  get: (params: any) => T | null;
  set: (data: T, params: any) => void;
  clear: () => void;
  has: (params: any) => boolean;
  prefetch: (params: any) => Promise<T | null>;
  isPrefetching: boolean;
}

/**
 * Custom hook for managing prefetch cache with automatic cleanup and LRU eviction
 * Optimized for pagination prefetching scenarios
 */
export function usePrefetchCache<T = any>(
  options: PrefetchCacheOptions<T>
): PrefetchCacheResult<T> {
  const { fetchFunction, cacheTimeout = 300000, maxCacheSize = 3 } = options; // 5min default, 3 entries max

  const [isPrefetching, setIsPrefetching] = useState(false);
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Helper to generate cache key from params
  const getCacheKey = useCallback((params: any): string => {
    return JSON.stringify({ ...params, _cacheKey: true });
  }, []);

  // Check if entry exists and is still valid
  const has = useCallback((params: any): boolean => {
    const key = getCacheKey(params);
    const entry = cacheRef.current.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > cacheTimeout) {
      cacheRef.current.delete(key);
      return false;
    }

    return true;
  }, [getCacheKey, cacheTimeout]);

  // Get data from cache
  const get = useCallback((params: any): T | null => {
    const key = getCacheKey(params);
    const entry = cacheRef.current.get(key);

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > cacheTimeout) {
      cacheRef.current.delete(key);
      return null;
    }

    return entry.data;
  }, [getCacheKey, cacheTimeout]);

  // Set data in cache with LRU eviction
  const set = useCallback((data: T, params: any) => {
    const key = getCacheKey(params);

    // Remove existing entry if present (to update LRU)
    cacheRef.current.delete(key);

    // Evict oldest entry if cache is full
    if (cacheRef.current.size >= maxCacheSize) {
      const firstKey = cacheRef.current.keys().next().value;
      if (firstKey) {
        cacheRef.current.delete(firstKey);
      }
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      params: { ...params },
    };

    cacheRef.current.set(key, entry);
  }, [getCacheKey, maxCacheSize]);

  // Clear all cached data
  const clear = useCallback(() => {
    cacheRef.current.clear();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Prefetch data asynchronously
  const prefetch = useCallback(async (params: any): Promise<T | null> => {
    try {
      // Check cache first
      const cached = get(params);
      if (cached) return cached;

      // Skip if already prefetching
      if (isPrefetching) return null;

      setIsPrefetching(true);

      const response = await fetchFunction(params);

      // Store in cache
      set(response, params);

      return response;
    } catch (error) {
      console.error("Prefetch failed:", error);
      return null;
    } finally {
      setIsPrefetching(false);
    }
  }, [get, set, fetchFunction, isPrefetching]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  // Periodic cleanup of expired entries
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      const toDelete: string[] = [];

      cacheRef.current.forEach((entry, key) => {
        if (now - entry.timestamp > cacheTimeout) {
          toDelete.push(key);
        }
      });

      toDelete.forEach(key => cacheRef.current.delete(key));
    };

    timeoutRef.current = setInterval(cleanup, cacheTimeout / 4); // Check every 1/4 of timeout period

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [cacheTimeout]);

  return {
    get,
    set,
    clear,
    has,
    prefetch,
    isPrefetching,
  };
}

/**
 * Pre-configured hook for students table prefetching
 */
export function useStudentsPrefetchCache() {
  return usePrefetchCache({
    fetchFunction: async (params: { page: number; pageSize: number }) => {
      const response = await apiHandler.students.list(params);
      if (response?.content) {
        return {
          data: response.content,
          metaData: response.metaData,
        };
      }
      throw new Error("Invalid response structure");
    },
    cacheTimeout: 300000, // 5 minutes
    maxCacheSize: 2, // Only cache previous and next pages
  });
}