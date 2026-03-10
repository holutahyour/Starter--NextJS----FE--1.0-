"use client";
import { useReportConfig } from "@/hooks/useReportConfig";
import dynamic from "next/dynamic";

const PowerBIEmbed = dynamic(
  () => import("powerbi-client-react").then((mod) => mod.PowerBIEmbed),
  {
    ssr: false,
    loading: () => <p>Loading Power BI report...</p>,
  }
);

export default function BillingReportPage() {
  const { config, loading, error } = useReportConfig("billing-report");

  if (loading) return <div>Loading report...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!config) return <div>No report configuration found</div>;

  return (
    <div className="w-full h-full">
      <PowerBIEmbed
        embedConfig={{
          type: "report",
          id: config.reportId,
          embedUrl: config.embedUrl,
          accessToken: config.embedToken,
          tokenType: 1, // models.TokenType.Embed
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
            },
          },
        }}
        cssClassName={"Embed-container"}
        getEmbeddedComponent={(embeddedReport) => {
          window.report = embeddedReport;
        }}
      />
    </div>
  );
}