"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Plus, Search, Filter, ChevronDown, Loader } from "lucide-react";
import apiHandler from "@/data/api/ApiHandler";

const SEVERITY_COLORS: Record<string, string> = {
  Low:      "bg-blue-100 text-blue-700",
  Medium:   "bg-yellow-100 text-yellow-700",
  High:     "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

const STATUS_COLORS: Record<string, string> = {
  Open:       "bg-red-100 text-red-700",
  InProgress: "bg-yellow-100 text-yellow-700",
  Resolved:   "bg-green-100 text-green-700",
  Closed:     "bg-gray-100 text-gray-600",
};

export default function IncidentReportsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiHandler.get<any>("/incidents");
        if (res?.isSuccess && Array.isArray(res.content)) {
          setIncidents(res.content);
        }
      } catch (e) {
        console.error("Failed to fetch incidents", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filtered = incidents.filter((i) =>
    (i.title || i.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
            <p className="text-sm text-gray-500">Track and resolve operational incidents</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" />
          Report Incident
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-6 h-6 text-red-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <AlertCircle className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No incidents reported</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Title</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Severity</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Reported By</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((i) => (
                <tr key={i.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-medium text-gray-900">{i.title || i.description || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_COLORS[i.severity] || "bg-gray-100 text-gray-600"}`}>
                      {i.severity || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{i.reportedBy || i.createdByName || "—"}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {i.createdAt ? new Date(i.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[i.status] || "bg-gray-100 text-gray-600"}`}>
                      {i.status || "Open"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
