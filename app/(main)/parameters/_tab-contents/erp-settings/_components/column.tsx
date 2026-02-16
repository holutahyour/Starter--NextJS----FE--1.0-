"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/app/app-data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/chakra-checkbox";
import { Button } from "@/components/ui/sdcn-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/sdcn-dropdown-menu";
import { IErpSettings } from "@/data/interface/IErpSettings";
import { CircleX, MoreHorizontal } from "lucide-react";
import { Badge, Icon } from "@chakra-ui/react";
import { CheckCircledIcon } from "@radix-ui/react-icons";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<IErpSettings>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
       checked={table.getIsAllPageRowsSelected()}
        // isIndeterminate={table.getIsSomePageRowsSelected()}
        onChange={(e) =>
          table.toggleAllPageRowsSelected(
            (e.target as HTMLInputElement).checked
          )
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
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "erpType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Erp Type" />
    ),
  },
  {
    id: "Activation Status",
    accessorKey: "isActivated",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activation Status" />
    ),
    cell: ({ row }) => {
      const value = row.original;

      return value.isActivated ? (
        <Badge fontWeight="semibold" colorPalette="green">
          <CheckCircledIcon /> Activated
        </Badge>
      ) : (
        <Badge fontWeight="semibold" colorPalette="red">
          <Icon size="sm">
            <CircleX />
          </Icon>{" "}
          Deactivated
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const value = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(value.id.toString())}
                        >
                            Copy ERP Settings ID
                        </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem> </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 1,
  },
];
