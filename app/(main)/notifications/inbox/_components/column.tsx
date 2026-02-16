"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { DataTableColumnHeader } from "@/components/app/app-data-table/data-table-column-header";
import { MoreHorizontal } from "lucide-react";
import { INotification } from "@/data/interface/INotification";
import moment from "moment";

export const columns: ColumnDef<INotification>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <span className={!row.original.isRead ? "font-semibold" : ""}>
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => (
      <span className={!row.original.isRead ? "font-semibold" : ""}>
        {row.original.message}
      </span>
    ),
  },
  // {
  //   accessorKey: "read",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) =>
  //     row.original.isRead ? "Read" : "Unread",
  // },
{
  accessorKey: "createdAt",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Created At" />
  ),
  cell: ({ row }) => {
    const date = row.original.createdAt;
    return moment.utc(date).fromNow();
  },
  enableSorting: true, // ✅ ensure sorting is allowed
  sortingFn: (a, b) => {
    return new Date(b.original.createdAt).getTime() - new Date(a.original.createdAt).getTime();
  },
},
  {
    accessorKey: "referenceId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference ID" />
    ),
    cell: ({ row }) => row.original.referenceId || "",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const notification = row.original;

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
                navigator.clipboard.writeText(notification.id.toString())
              }
            >
              Copy Notification ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mark as Read</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 1,
  },
];
