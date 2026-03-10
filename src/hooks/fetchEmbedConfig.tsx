import { useEffect, useState } from "react";

export function usePaginatedReportConfig() {
  const [config, setConfig] = useState<{
    embedToken: string;
    embedUrl: string;
    reportId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/get-embed-token-paginatedReport")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch embed config");
        setLoading(false);
      });
  }, []);

  return { config, loading, error };
}
