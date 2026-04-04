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
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 py-3 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div>
          <AlertTriangle className="w-4 h-4 text-red-600" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-red-900 leading-tight">
            Low Stock Alerts ({lowStockItems.length})
          </h2>
          <p className="text-xs text-red-700 font-medium">
            These items are below minimum stock levels and need restocking
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white/60 p-2.5 px-3 rounded-lg border border-red-100/50 shadow-sm"
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-900 leading-tight">{item.name}</h3>
              <p className="text-xs text-gray-500">
                {item.category} • {item.location}
              </p>
            </div>
            <div className="text-right">
              <div className="text-red-600 font-bold text-sm leading-tight">
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
