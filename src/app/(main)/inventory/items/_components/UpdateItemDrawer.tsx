"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { createItemSchema, CreateItemValues } from "@/data/schema/item";
import apiHandler from "@/data/api/ApiHandler";
import AppDrawer from "@/components/app/app-drawer";
import DynamicSelect from "./DynamicSelect";
import { useQuery } from "@/hooks/use-query";
import { useModifyQuery } from "@/hooks/use-modify-query";
import { VStack } from "@chakra-ui/react";
import { InventoryItem } from "./types";

const APP_UPDATE_INVENTORY_DRAWER = "inv_update_drawer";

interface UpdateItemDrawerProps {
  item: InventoryItem | null;
  onUpdated: (item: InventoryItem) => void;
}

export default function UpdateItemDrawer({ item, onUpdated }: UpdateItemDrawerProps) {
  const pathName = usePathname();
  const { router, searchParams, open } = useQuery(APP_UPDATE_INVENTORY_DRAWER, "true");

  const redirectUri = useModifyQuery(null, searchParams, [
    { key: APP_UPDATE_INVENTORY_DRAWER, value: "true" },
  ]);

  const discardChange = () => {
    router.push(pathName.split("?")[0]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateItemValues>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      vendorId: "",
      unitType: "piece",
      initialStock: 0,
      minStockLevel: 10,
      location: "",
      batchTracked: false,
      expiryTracked: false,
    },
  });

  useEffect(() => {
    if (item && open) {
      reset({
        name: item.name,
        sku: "SKU-" + item.id, // Fallback for mock if missing
        categoryId: item.category === "Office Supplies" ? "Office Supplies" : item.category === "IT Equipment" ? "IT Equipment" : "Printer Supplies", 
        vendorId: "",
        unitType: item.unit,
        initialStock: item.currentStock,
        minStockLevel: item.minStock,
        location: item.location,
        batchTracked: false,
        expiryTracked: false,
        description: "",
        barcode: "",
        storageConditions: "",
      });
    }
  }, [item, open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!item) return;

    try {
      const updatedItem: InventoryItem = {
        ...item,
        name: values.name,
        category: values.categoryId || "Uncategorized",
        currentStock: values.initialStock || 0,
        minStock: values.minStockLevel || 0,
        unit: values.unitType,
        status: (values.initialStock || 0) <= (values.minStockLevel || 0) ? "Low Stock" : "Adequate",
        location: values.location || "",
        lastUpdatedDate: new Date().toISOString().split("T")[0],
        lastUpdatedBy: "Current User",
      };
      
      onUpdated(updatedItem);
      reset();
      discardChange();
    } catch (e) {
      console.error("Failed to update inventory item", e);
    }
  });

  return (
    <AppDrawer
      title="Update Inventory Item"
      placement="end"
      size="md"
      open={open}
      redirectUri={redirectUri}
      cancelQueryKey={APP_UPDATE_INVENTORY_DRAWER}
      onSubmit={onSubmit}
      submitLabel="Save Changes"
      hasFooter
    >
      <VStack gap={5} align="stretch" pb={4}>
        <p className="text-sm text-blue-600 -mt-2">
          Update details for the selected inventory item
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              placeholder="e.g. A4 Paper"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.name ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-blue-400 focus:border-blue-400"
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              {...register("sku")}
              placeholder="e.g. SKU-12345"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.sku ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-blue-400 focus:border-blue-400"
              }`}
            />
            {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <DynamicSelect
              apiConfig={apiHandler.categories}
              value={watch("categoryId") || ""}
              onChange={(id, name) => setValue("categoryId", id, { shouldValidate: true })}
              placeholder="Select Category"
              createLabel="Create category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
            <DynamicSelect
              apiConfig={apiHandler.vendors}
              value={watch("vendorId") || ""}
              onChange={(id, name) => setValue("vendorId", id, { shouldValidate: true })}
              placeholder="Select Vendor"
              createLabel="Create vendor"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Type <span className="text-red-500">*</span>
            </label>
            <input
              {...register("unitType")}
              placeholder="e.g. piece, box, ream"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.unitType ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-blue-400 focus:border-blue-400"
              }`}
            />
            {errors.unitType && <p className="text-xs text-red-500 mt-1">{errors.unitType.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
            <input
              {...register("barcode")}
              placeholder="Optional barcode"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
            <input
              {...register("initialStock", { valueAsNumber: true })}
              type="number"
              min="0"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.initialStock ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-blue-400 focus:border-blue-400"
              }`}
            />
            {errors.initialStock && <p className="text-xs text-red-500 mt-1">{errors.initialStock.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Level</label>
            <input
              {...register("minStockLevel", { valueAsNumber: true })}
              type="number"
              min="0"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.minStockLevel ? "border-red-400 focus:ring-red-300" : "border-gray-200 focus:ring-blue-400 focus:border-blue-400"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
            <input
              {...register("costPrice", { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
            <input
              {...register("sellingPrice", { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-6 items-center py-2">
          <label className="flex items-center gap-3 w-auto cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" {...register("batchTracked")} />
            <span className="text-sm text-gray-700 font-medium">Batch Tracked</span>
          </label>

          <label className="flex items-center gap-3 w-auto cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" {...register("expiryTracked")} />
            <span className="text-sm text-gray-700 font-medium">Expiry Tracked</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <DynamicSelect
            apiConfig={apiHandler.locations}
            // For location we match by name since it's stored as a string
            value={watch("location") || ""}
            onChange={(id, name) => setValue("location", name, { shouldValidate: true })}
            placeholder="Select Location"
            createLabel="Create location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register("description")}
            rows={2}
            placeholder="Optional item details"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Storage Conditions</label>
          <textarea
            {...register("storageConditions")}
            rows={2}
            placeholder="e.g. Store in a cool, dry place"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors resize-none"
          />
        </div>
      </VStack>
    </AppDrawer>
  );
}
