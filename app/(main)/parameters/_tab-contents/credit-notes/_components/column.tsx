"use client"
import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/app/app-data-table/data-table-column-header"
import { Checkbox } from "@/components/ui/chakra-checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/sdcn-dropdown-menu"
import { Button } from "@/components/ui/sdcn-button"
import { EllipsisVertical } from "lucide-react"
import { ICreditNote } from "@/data/interface/ICreditNoteImportPayload"

export const getCreditNoteColumns = (
  reloadData: () => void
): ColumnDef<ICreditNote>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) =>
          table.toggleAllPageRowsSelected((e.target as HTMLInputElement).checked)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(e) =>
          row.toggleSelected((e.target as HTMLInputElement).checked)
        }
        aria-label="Select row"
      />
    ),
    size: 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "paymentReference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Reference" />
    ),
  },
  {
    accessorKey: "studentCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Code" />
    ),
  },
  {
    accessorKey: "creditNoteName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Note Name" />
    ),
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"))
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount)
      return <span className="font-medium">{formatted}</span>
    },
  },
  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("paymentDate"))
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: "isPaymentVerified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verified" />
    ),
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.getValue("isPaymentVerified")
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.getValue("isPaymentVerified") ? "Yes" : "No"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const creditNote = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(creditNote.code)}
            >
              Copy Reference
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("View details", creditNote)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={reloadData}>
              Refresh Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
