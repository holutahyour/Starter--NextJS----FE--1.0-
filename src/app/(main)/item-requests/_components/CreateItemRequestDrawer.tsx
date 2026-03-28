"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { createItemRequestSchema, CreateItemRequestValues } from "@/data/schema/itemRequest";
import apiHandler from "@/data/api/ApiHandler";
import AppDrawer from "@/components/app/app-drawer";
import { useQuery } from "@/hooks/use-query";
import { useModifyQuery } from "@/hooks/use-modify-query";
import { APP_ITEM_REQUEST_DRAWER } from "@/lib/routes";
import { VStack } from "@chakra-ui/react";
import { ItemRequest } from "./types";
import ItemCombobox from "./ItemCombobox";

interface CreateItemRequestDrawerProps {
  onCreated: (req: ItemRequest) => void;
}

export default function CreateItemRequestDrawer({ onCreated }: CreateItemRequestDrawerProps) {
  const pathName = usePathname();

  // open = true when ?item_req_drawer=true is present in the URL
  const { router, searchParams, open } = useQuery(APP_ITEM_REQUEST_DRAWER, "true");

  const [departments, setDepartments] = useState<any[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchDepartments = async () => {
        setLoadingDepts(true);
        try {
          const res = await apiHandler.departments.list();
          if (res?.isSuccess && Array.isArray(res.content)) {
            setDepartments(res.content);
          } else if (Array.isArray(res)) {
            setDepartments(res);
          } else if (res?.items) {
             setDepartments(res.items);
          } else if (res?.data) {
             setDepartments(res.data);
          }
        } catch (e) {
          console.error("Failed to fetch departments", e);
        } finally {
          setLoadingDepts(false);
        }
      };
      fetchDepartments();
    }
  }, [open]);

  // URL to navigate to when the drawer closes (removes item_req_drawer param)
  const redirectUri = useModifyQuery(null, searchParams, [
    { key: APP_ITEM_REQUEST_DRAWER, value: "true" },
  ]);

  const discardChange = () => {
    router.push(pathName.split("?")[0]);
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateItemRequestValues>({
    resolver: zodResolver(createItemRequestSchema),
    defaultValues: { itemId: "", itemName: "", quantity: 1, purpose: "", departmentId: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await apiHandler.itemRequests.create({
        itemName: values.itemName,
        itemId: values.itemId || undefined,
        quantity: values.quantity,
        purpose: values.purpose,
        departmentId: (values.departmentId || undefined) as string,
      });
      if (res?.isSuccess && res.content) {
        onCreated(res.content);
      } else if (res?.id || res?.itemName) {
        onCreated(res as any);
      }
      reset();
      discardChange();
    } catch (e) {
      console.error("Failed to create item request", e);
    }
  });

  return (
    <AppDrawer
      title="Create New Item Request"
      placement="end"
      size="md"
      open={open}
      redirectUri={redirectUri}
      cancelQueryKey={APP_ITEM_REQUEST_DRAWER}
      onSubmit={onSubmit}
      submitLabel="Submit Request"
      hasFooter
    >
      <VStack gap={5} align="stretch" pb={4}>
        {/* Subtitle */}
        <p className="text-sm text-green-600 -mt-2">
          Submit a new item request to the inventory officer
        </p>

        {/* Item Name – searchable combobox */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name <span className="text-red-500">*</span>
          </label>
          <Controller
            name="itemName"
            control={control}
            render={({ field }) => (
              <ItemCombobox
                value={field.value}
                onChange={field.onChange}
                onSelect={(id, name) => {
                  field.onChange(name);
                  setValue("itemId", id);
                }}
                error={errors.itemName?.message}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.itemName && (
            <p className="text-xs text-red-500 mt-1">{errors.itemName.message}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            {...register("departmentId")}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors bg-white ${
              errors.departmentId
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-200 focus:ring-green-400 focus:border-green-400"
            }`}
            disabled={loadingDepts}
          >
            <option value="">Select a department...</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="text-xs text-red-500 mt-1">{errors.departmentId.message}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            {...register("quantity", { valueAsNumber: true })}
            type="number"
            min="1"
            placeholder="1"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
              errors.quantity
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-200 focus:ring-green-400 focus:border-green-400"
            }`}
          />
          {errors.quantity && (
            <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>
          )}
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("purpose")}
            rows={4}
            placeholder="Provide reasons for this item request"
            className={`w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 transition-colors ${
              errors.purpose
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-200 focus:ring-green-400 focus:border-green-400"
            }`}
          />
          {errors.purpose && (
            <p className="text-xs text-red-500 mt-1">{errors.purpose.message}</p>
          )}
        </div>
      </VStack>
    </AppDrawer>
  );
}
