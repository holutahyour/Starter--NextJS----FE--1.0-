import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/sdcn-card";

interface LowStockItem {
  id: string;
  name: string;
  minRequired: number | string;
  currentQuantity: number;
}

interface LowStockListProps {
  items: LowStockItem[];
}

export function LowStockList({ items }: LowStockListProps) {
  return (
    <Card className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Low Stock Alerts
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Items that need to be restocked
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Min: {item.minRequired}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    {item.currentQuantity} <span className="text-xs font-normal">units</span>
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-sm">
                    Low Stock
                  </span>
                </div>
              </div>
              {index < items.length - 1 && (
                <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
