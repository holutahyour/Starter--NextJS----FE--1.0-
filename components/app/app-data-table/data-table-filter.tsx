"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/sdcn-input"

interface DataTableFilterProps<TData> {
  table: Table<TData>
  filterPlaceholder: string
}

export function DataTableFilter<TData>({
  table,
  filterPlaceholder,
}: DataTableFilterProps<TData>) {
  return (
    <Input
      placeholder={filterPlaceholder}
      value={(table.getState().globalFilter as string) ?? ""}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      className="max-w-sm"
    />
  )
}