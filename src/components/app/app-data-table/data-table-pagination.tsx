import { ActionBar, Portal, Button as ChakraButton } from '@chakra-ui/react'
import { LuShare, LuTrash2, } from 'react-icons/lu'
import { Table } from "@tanstack/react-table"
import { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/sdcn-select"
import { Button } from "@/components/ui/sdcn-button"
import { Input } from "@/components/ui/sdcn-input"
import { ChangeEvent, KeyboardEvent } from "react"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  multiSelectBtnName?: string
  onMultiSelectAction?: (selectedRows: TData[]) => void
  onPageSizeChange?: (size: number) => void;
  onPageChange?: (page: number) => void;
}

export function DataTablePagination<TData>({
  table,
  multiSelectBtnName,
  onMultiSelectAction,
  onPageSizeChange,
  onPageChange,
}: DataTablePaginationProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows.length

  // Update isOpen when rows are selected
  useEffect(() => {
    setIsOpen(selectedRows > 0)
  }, [selectedRows])

  const handleAction = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
    if (onMultiSelectAction) {
      onMultiSelectAction(selectedRows);
    } else {
      console.log('no Sharing:',);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-between p-2">
      <div className="flex-1 text-sm text-muted-foreground text-nowrap">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-nowrap">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const size = Number(value);
              table.setPageSize(size);
              if (onPageSizeChange) {
                onPageSizeChange(size);
              }
            }}
          >
            <SelectTrigger className="h-8 w-[100px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs">
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit text-nowrap items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange ? onPageChange(0) : table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange ? onPageChange(table.getState().pagination.pageIndex - 1) : table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              console.log("Current Page Index:", table.getState().pagination.pageIndex);
              console.log("Page Count:", table.getPageCount());
              console.log("Can Next Page:", table.getCanNextPage());
              if (onPageChange) {
                onPageChange(table.getState().pagination.pageIndex + 1);
              } else {
                table.nextPage();
              }
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange ? onPageChange(table.getPageCount() - 1) : table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
