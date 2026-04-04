import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/sdcn-table";
import { InventoryItem } from "./types";
import { Package, Edit2, MapPin } from "lucide-react";

interface InventoryTableProps {
  items: InventoryItem[];
  onUpdate: (item: InventoryItem) => void;
}

export default function InventoryTable({ items, onUpdate }: InventoryTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="font-semibold text-gray-900">Item Name</TableHead>
            <TableHead className="font-semibold text-gray-900">Category</TableHead>
            <TableHead className="font-semibold text-gray-900">Current Stock</TableHead>
            <TableHead className="font-semibold text-gray-900">Min Stock</TableHead>
            <TableHead className="font-semibold text-gray-900 text-center">Status</TableHead>
            <TableHead className="font-semibold text-gray-900">Location</TableHead>
            <TableHead className="font-semibold text-gray-900">Last Updated</TableHead>
            <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50/30 transition-colors">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                    <Package className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-gray-600">{item.categoryName || item.category || "Unknown"}</TableCell>
              <TableCell>
                <span className={item.status === "Low Stock" ? "text-red-600 font-bold" : "text-gray-900 font-semibold"}>
                  {item.currentStock} {item.unit}
                </span>
              </TableCell>
              <TableCell className="text-gray-500">
                {item.minStock} {item.unit}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === "Low Stock"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{item.locationName || item.location || "N/A"}</span>
                  {item.itemLocation && (
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{item.itemLocation}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{item.lastUpdatedDate}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{item.lastUpdatedBy}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => onUpdate(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  <Edit2 className="w-3 h-3" />
                  Update
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
