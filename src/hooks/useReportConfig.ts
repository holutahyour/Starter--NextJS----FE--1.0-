import { useEffect, useState } from "react";

export function useReportConfig(reportName: string) {
  const [config, setConfig] = useState<{
    embedUrl: string;
    embedToken: string;
    reportId: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmbedConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reports/${reportName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch embed config");
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (reportName) {
      fetchEmbedConfig();
    }
  }, [reportName]);

  return { config, loading, error };
}