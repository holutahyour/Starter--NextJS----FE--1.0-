export interface ItemRequest {
  id: string;
  itemName?: string;
  title?: string;
  name?: string;
  quantity?: number;
  purpose?: string;
  description?: string;
  status: 1 | 2 | 3 | "Pending" | "Approved" | "Rejected";
  reason?: string;
  date?: string;
  createdAt?: string;
  requestedBy?: string;
  createdByName?: string;
  actionedByName?: string;
  departmentName?: string;
  department?: { name: string };
}

export const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  1: { label: "pending", className: "bg-green-50 text-green-700 border border-green-200" },
  2: { label: "approved", className: "bg-green-600 text-white" },
  3: { label: "rejected", className: "bg-red-600 text-white" },
  Pending: { label: "pending", className: "bg-green-50 text-green-700 border border-green-200" },
  Approved: { label: "approved", className: "bg-green-600 text-white" },
  Rejected: { label: "rejected", className: "bg-red-600 text-white" },
  Draft: { label: "draft", className: "bg-gray-100 text-gray-500" },
};

export const fmtDate = (d?: string) =>
  d ? new Date(d).toISOString().slice(0, 10) : "—";

export const MOCK_ITEM_REQUESTS: ItemRequest[] = [
  {
    id: "mock-1",
    itemName: "Laptop - Dell XPS 15",
    departmentName: "Marketing",
    requestedBy: "David Marketing",
    date: "2026-02-03",
    purpose: "New team members joining the marketing department",
    quantity: 2,
    status: "Pending",
  },
  {
    id: "mock-2",
    itemName: "Office Chair",
    departmentName: "Sales",
    requestedBy: "Emma Sales",
    date: "2026-02-04",
    purpose: "Expansion of sales team workspace",
    quantity: 5,
    status: "Pending",
  },
  {
    id: "mock-3",
    itemName: "Printer - HP LaserJet",
    departmentName: "Operations",
    requestedBy: "Tom Operations",
    date: "2026-01-30",
    purpose: "Replace old malfunctioning printer",
    quantity: 1,
    status: "Approved",
  },
  {
    id: "mock-4",
    itemName: 'External Monitor 27"',
    departmentName: "Marketing",
    requestedBy: "David Marketing",
    date: "2026-01-28",
    purpose: "Design team workflow improvement",
    quantity: 3,
    status: "Rejected",
    reason: "Currently out of stock. Will be available next month.",
  },
];
