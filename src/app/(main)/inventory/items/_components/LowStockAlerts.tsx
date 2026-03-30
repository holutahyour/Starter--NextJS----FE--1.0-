import React from "react";
import { AlertTriangle } from "lucide-react";
import { InventoryItem } from "./types";

interface LowStockAlertsProps {
  items: InventoryItem[];
}

export default function LowStockAlerts({ items }: LowStockAlertsProps) {
  const lowStockItems = items.filter((item) => item.status === "Low Stock");

  if (lowStockItems.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-4 mb-4">
        <div className="mt-1">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-red-900">
            Low Stock Alerts ({lowStockItems.length})
          </h2>
          <p className="text-sm text-red-700 font-medium">
            These items are below minimum stock levels and need restocking
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white/60 p-4 rounded-lg border border-red-100/50 shadow-sm"
          >
            <div>
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-xs text-gray-500">
                {item.category} • {item.location}
              </p>
            </div>
            <div className="text-right">
              <div className="text-red-600 font-bold">
                {item.currentStock} {item.unit}
              </div>
              <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
                Min: {item.minStock} {item.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
