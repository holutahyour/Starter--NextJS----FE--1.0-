"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText, Plus, Search, Loader,
  CheckCircle, XCircle, Calendar, User, Building2,
} from "lucide-react";
import apiHandler from "@/data/api/ApiHandler";

const USE_MOCK = process.env.NEXT_PUBLIC_DISABLE_MOCK_DATA !== "true";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Requisition {
  id: string;
  title: string;
  amount: number;
  description: string;
  status: "Pending" | "Approved" | "Rejected" | "Draft";
  reason?: string;
  date?: string;
  createdAt?: string;
  submittedByName?: string;
  department?: { name: string };
  departmentName?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  Pending:  { label: "pending",  className: "bg-yellow-100 text-yellow-700" },
  Approved: { label: "approved", className: "bg-green-100 text-green-700" },
  Rejected: { label: "rejected", className: "bg-red-100 text-red-700" },
  Draft:    { label: "draft",    className: "bg-gray-100 text-gray-500" },
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d?: string) =>
  d ? new Date(d).toISOString().slice(0, 10) : "—";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_REQUISITIONS: Requisition[] = [
  {
    id: "mock-1",
    title: "Marketing Campaign Materials",
    amount: 5000,
    description: "Budget for Q1 marketing campaign materials including banners, flyers, and digital ads",
    status: "Pending",
    date: "2026-02-03",
    submittedByName: "David Marketing",
    departmentName: "Marketing",
  },
  {
    id: "mock-2",
    title: "Office Furniture",
    amount: 12000,
    description: "New desks and chairs for the sales team expansion",
    status: "Pending",
    date: "2026-02-04",
    submittedByName: "Emma Sales",
    departmentName: "Sales",
  },
  {
    id: "mock-3",
    title: "Training Workshop",
    amount: 3500,
    description: "External training for operations team on new software",
    status: "Approved",
    date: "2026-01-28",
    submittedByName: "Tom Operations",
    departmentName: "Operations",
  },
  {
    id: "mock-4",
    title: "Travel Expenses",
    amount: 8000,
    description: "Client meeting travel expenses for February",
    status: "Rejected",
    reason: "Budget exceeded for travel this quarter. Please resubmit with reduced amount.",
    date: "2026-01-30",
    submittedByName: "Emma Sales",
    departmentName: "Sales",
  },
  {
    id: "mock-5",
    title: "IT Equipment Upgrade",
    amount: 25000,
    description: "Replacement laptops and peripherals for the engineering team",
    status: "Pending",
    date: "2026-02-10",
    submittedByName: "Alex IT",
    departmentName: "Information Technology",
  },
];

// ─── Reject Modal ─────────────────────────────────────────────────────────────
function RejectModal({
  onConfirm,
  onCancel,
  busy,
}: {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  busy: boolean;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-base font-semibold text-gray-900 mb-2">Reject Requisition</h2>
        <p className="text-sm text-gray-500 mb-4">Provide a reason that will be visible to the requester.</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Enter rejection reason..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim() || busy}
            onClick={() => onConfirm(reason.trim())}
            className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {busy ? <Loader className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Requisition Card ─────────────────────────────────────────────────────────
function RequisitionCard({
  req,
  onApprove,
  onReject,
  actionBusy,
}: {
  req: Requisition;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  actionBusy: string | null;
}) {
  const badge = STATUS_BADGE[req.status] ?? STATUS_BADGE.Draft;
  const dept = req.department?.name || req.departmentName || "—";
  const date = fmtDate(req.date || req.createdAt);
  const isPending = req.status === "Pending";
  const busy = actionBusy === req.id;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-base">{req.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
              {badge.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-green-600 flex-wrap">
            {dept !== "—" && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {dept}
              </span>
            )}
            {req.submittedByName && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> {req.submittedByName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {date}
            </span>
          </div>
        </div>
        <span className="text-lg font-bold text-green-700 whitespace-nowrap ml-4">
          {fmt(req.amount)}
        </span>
      </div>

      {/* Description */}
      <div className="px-6 pb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description:</p>
        <p className="text-sm text-green-600">{req.description || "No description provided."}</p>
      </div>

      {/* Rejection Reason */}
      {req.status === "Rejected" && req.reason && (
        <div className="mx-6 mb-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <p className="text-xs font-semibold text-red-600 mb-0.5">Rejection Reason:</p>
          <p className="text-sm text-red-500">{req.reason}</p>
        </div>
      )}

      {/* Approve / Reject Actions */}
      {isPending && (
        <div className="grid grid-cols-2 border-t border-gray-100">
          <button
            disabled={busy}
            onClick={() => onApprove(req.id)}
            className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            {busy ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Approve
          </button>
          <button
            disabled={busy}
            onClick={() => onReject(req.id)}
            className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 transition-colors border-l border-white/20"
          >
            {busy ? <Loader className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
const FILTERS = ["All", "Pending", "Approved", "Rejected"];

export default function RequisitionsPage() {
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectBusy, setRejectBusy] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      if (USE_MOCK) {
        // Return mock data filtered by the active tab
        const mockFiltered =
          activeFilter === "All"
            ? MOCK_REQUISITIONS
            : MOCK_REQUISITIONS.filter((r) => r.status === activeFilter);
        setRequisitions(mockFiltered);
        return;
      }

      const res = await apiHandler.requisitions.list(
        activeFilter !== "All" ? { status: activeFilter } : undefined
      );
      if (res?.isSuccess && Array.isArray(res.content)) {
        setRequisitions(res.content);
      } else {
        setRequisitions([]);
      }
    } catch (e) {
      console.error("Failed to fetch requisitions", e);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);


  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const handleApprove = async (id: string) => {
    setActionBusy(id);
    try {
      await apiHandler.requisitions.approve(id);
      setRequisitions((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
      );
    } catch (e) {
      console.error("Approve failed", e);
    } finally {
      setActionBusy(null);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTarget) return;
    setRejectBusy(true);
    try {
      await apiHandler.requisitions.reject(rejectTarget, reason);
      setRequisitions((prev) =>
        prev.map((r) =>
          r.id === rejectTarget ? { ...r, status: "Rejected", reason } : r
        )
      );
      setRejectTarget(null);
    } catch (e) {
      console.error("Reject failed", e);
    } finally {
      setRejectBusy(false);
    }
  };

  const filtered = requisitions.filter((r) =>
    (r.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Reject Modal */}
      {rejectTarget && (
        <RejectModal
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
          busy={rejectBusy}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requisitions</h1>
          <p className="text-sm text-gray-500">Manage department requisitions to finance</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          New Requisition
        </button>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeFilter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search requisitions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader className="w-6 h-6 text-green-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <FileText className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">No requisitions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <RequisitionCard
              key={req.id}
              req={req}
              onApprove={handleApprove}
              onReject={(id) => setRejectTarget(id)}
              actionBusy={actionBusy}
            />
          ))}
        </div>
      )}
    </div>
  );
}
