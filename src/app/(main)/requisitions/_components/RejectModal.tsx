"use client";

import { useState } from "react";
import { Loader, XCircle } from "lucide-react";

interface RejectModalProps {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  busy: boolean;
}

export default function RejectModal({ onConfirm, onCancel, busy }: RejectModalProps) {
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
