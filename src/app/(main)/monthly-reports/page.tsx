"use client";

import React, { useState, useEffect } from "react";
import { BarChart2, TrendingUp, TrendingDown, Package, FileText, AlertCircle, Loader } from "lucide-react";
import apiHandler from "@/data/api/ApiHandler";

interface SummaryCard {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  trend?: "up" | "down" | "neutral";
}

export default function MonthlyReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiHandler.dashboard.getSummary();
        if (res?.isSuccess) setSummary(res.content);
      } catch (e) {
        console.error("Failed to fetch monthly summary", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const cards: SummaryCard[] = summary
    ? [
        {
          label: "Total Requisitions",
          value: (summary.pendingRequisitions ?? 0) + (summary.approvedRequisitions ?? 0),
          sub: `${summary.approvedRequisitions ?? 0} approved · ${summary.pendingRequisitions ?? 0} pending`,
          icon: <FileText className="w-5 h-5" />,
          color: "bg-green-50 text-green-600",
          trend: "up",
        },
        {
          label: "Item Requests",
          value: summary.totalItemRequests ?? 0,
          sub: "This month",
          icon: <Package className="w-5 h-5" />,
          color: "bg-blue-50 text-blue-600",
          trend: "up",
        },
        {
          label: "Open Incidents",
          value: summary.openIncidents ?? 0,
          sub: summary.resolvedIncidents ? `${summary.resolvedIncidents} resolved` : undefined,
          icon: <AlertCircle className="w-5 h-5" />,
          color: "bg-red-50 text-red-600",
          trend: summary.openIncidents > 3 ? "down" : "up",
        },
        {
          label: "Low Stock Items",
          value: summary.lowStockItems ?? 0,
          sub: "Requiring attention",
          icon: <BarChart2 className="w-5 h-5" />,
          color: "bg-orange-50 text-orange-600",
          trend: "down",
        },
      ]
    : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Reports</h1>
          <p className="text-sm text-gray-500">{month} — Activity Summary</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                    {card.icon}
                  </div>
                  {card.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                  {card.trend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{card.label}</p>
                {card.sub && <p className="text-xs text-gray-400 mt-1">{card.sub}</p>}
              </div>
            ))}
          </div>

          {/* Placeholder chart area */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Activity Over Time</h2>
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <div className="text-center text-gray-400">
                <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Chart integration coming soon</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
