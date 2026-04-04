"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, Loader, Archive } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import apiHandler from "@/data/api/ApiHandler";
import { useModifyQuery } from "@/hooks/use-modify-query";
import { InventoryItem, MOCK_INVENTORY_ITEMS, mapApiToFrontendItem } from "./_components/types";
import LowStockAlerts from "./_components/LowStockAlerts";
import InventoryTable from "./_components/InventoryTable";
import AddItemDrawer from "./_components/AddItemDrawer";
import UpdateItemDrawer from "./_components/UpdateItemDrawer";

const USE_MOCK = process.env.NEXT_PUBLIC_DISABLE_MOCK_DATA !== "true";
const APP_INVENTORY_DRAWER = "inv_drawer";

export default function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingItem, setUpdatingItem] = useState<InventoryItem | null>(null);

  // URL that opens the drawer
  const drawerUrl = useModifyQuery(
    null,
    searchParams,
    [{ key: APP_INVENTORY_DRAWER, value: "true" }],
    "set"
  );

  const fetchData = useCallback(async () => {
    try {
      if (USE_MOCK) {
        setItems(MOCK_INVENTORY_ITEMS);
        return;
      }
      const res = await apiHandler.items.list(search || undefined);
      
      if (Array.isArray(res)) {
        setItems(res.map(mapApiToFrontendItem));
      } else if (res?.isSuccess && Array.isArray(res.content)) {
        setItems(res.content.map(mapApiToFrontendItem));
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error("Failed to fetch inventory items", e);
      if (USE_MOCK) setItems(MOCK_INVENTORY_ITEMS);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const handleUpdate = (item: InventoryItem) => {
    setUpdatingItem(item);
    router.push(`?inv_update_drawer=true`, { scroll: false });
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.categoryName || item.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Drawers */}
      <AddItemDrawer
        onCreated={(newItem) => {
          setItems((prev) => [newItem, ...prev]);
        }}
      />
      <UpdateItemDrawer
        item={updatingItem}
        onUpdated={(updatedItem) => {
          setItems((prev) =>
            prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
          );
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <Archive className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-sm text-gray-500 font-medium">Track and manage inventory stock levels</p>
          </div>
        </div>
        <button
          onClick={() => router.push(drawerUrl)}
          className="flex items-center gap-2 bg-[#7cc843] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#68a638] transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Alerts Section */}
      <LowStockAlerts items={filteredItems} />

      {/* All Items Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">All Inventory Items</h2>
            <p className="text-sm text-gray-500 font-medium">Complete list of items in inventory</p>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by item name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-6 h-6 text-green-500 animate-spin" />
              <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Loading Inventory...</span>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-400">
            <Archive className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">No inventory items found</p>
            {search && <p className="text-xs mt-1">Try adjusting your search terms</p>}
          </div>
        ) : (
          <InventoryTable items={filteredItems} onUpdate={handleUpdate} />
        )}
      </div>
    </div>
  );
}
