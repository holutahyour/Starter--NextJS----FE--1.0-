'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useQuery(query: string, queryValue: string) {
  const [open, setOpen] = useState(false)

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Open drawer if APP_DRAWER query exists
  useEffect(() => {
    if (searchParams.get(query) === queryValue) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchParams, open, query, queryValue]);

  return { router, searchParams, pathname, open, setOpen };
} 
