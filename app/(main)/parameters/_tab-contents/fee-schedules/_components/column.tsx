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
import { IFeeSchedule } from "@/data/interface/IFeeSchedule";
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

export const columns: ColumnDef<IFeeSchedule>[] = [
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
    accessorKey: "feeItemCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fee Item" />
    ),
  },
  {
    accessorKey: "academicFacultyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Faculty" />
    ),
  },
  {
    accessorKey: "academicDepartmentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
  },
  // {
  //   accessorKey: "sessionName",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Session" />
  //   ),
  // },
  {
    accessorKey: "academicLevelCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    // cell: ({ row }) => {
    //   const value = row.original;

    //   return value.studentType == "1" ? (
    //     <Badge fontWeight="semibold" colorPalette="green">
    //       <CheckCircledIcon /> Local
    //     </Badge>
    //   ) : (
    //     <Badge fontWeight="semibold" colorPalette="red">
    //       <Icon size="sm">
    //         <CircleX />
    //       </Icon>{" "}
    //       None
    //     </Badge>
    //   );
    // },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Bill" />
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
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
  },
  {
    accessorKey: "revenueAccount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Revenue Account" />
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
            <DropdownMenuItem
              onClick={() =>
                value.id && navigator.clipboard.writeText(value.id.toString())
              }
            >
              Copy Fee Schedule ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Fee Schedule</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 1,
  },
];
