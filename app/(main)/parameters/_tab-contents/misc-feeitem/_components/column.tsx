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
import { CircleX, MoreHorizontal } from "lucide-react";
import { Badge, Icon } from "@chakra-ui/react";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { IMiscellaneousFee,  } from "@/data/interface/IMiscellaneousFee";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<IMiscellaneousFee>[] = [
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
    accessorKey: "miscellaneousFeeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "feeCategoryCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fee Category" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const value = row.original;
      const formattedNaira = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(value.amount);

      return <span className="text-xs font-semibold">{formattedNaira}</span>;
    },
  },
  {
    accessorKey: "revenueAccount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
  },
  // {
  //   accessorKey: "isCreditNote",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Credit Note" />
  //   ),
  //   cell: ({ row }) => {
  //     const value = row.original;

  //     return value.isCreditNote ? (
  //       <Badge colorPalette="green">
  //         <CheckCircledIcon /> True
  //       </Badge>
  //     ) : (
  //       <Badge colorPalette="red">
  //         <Icon size="sm">
  //           <CircleX />
  //         </Icon>{" "}
  //         False
  //       </Badge>
  //     );
  //   },
  // },

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(value.id.toString())}
            >
              Copy Fee Item ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Fee Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 1,
  },
];
