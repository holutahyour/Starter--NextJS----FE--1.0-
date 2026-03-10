import { ActionBar, Portal, Button as ChakraButton } from '@chakra-ui/react'
import { LuShare, LuTrash2 } from 'react-icons/lu'
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
import { IPaginationMetaData } from '@/data/interface/IPagination'

interface DataTablePaginationMetaDataProps<TData> {
  table: Table<TData>
  metaData: IPaginationMetaData | null
  multiSelectBtnName?: string
  onMultiSelectAction?: (selectedRows: TData[]) => void
  onPageSizeChange?: (size: number) => void;
  onPageChange?: (page: number) => void;
  onNavigateToUrl?: (url: string) => void;
}

export function DataTablePaginationMetaData<TData>({
  table,
  metaData,
  multiSelectBtnName,
  onMultiSelectAction,
  onPageSizeChange,
  onPageChange,
  onNavigateToUrl,
}: DataTablePaginationMetaDataProps<TData>) {
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

  const handleNavigation = (url: string | null | undefined) => {
    if (url && onNavigateToUrl) {
      onNavigateToUrl(url);
    }
  };



  const currentPage = metaData && metaData.lastPage && metaData.lastPage > 0 ? Math.ceil(metaData.from / metaData.perPage) : 1;
  const totalPages = metaData && metaData.lastPage && metaData.lastPage > 0 ? metaData.lastPage : 1;
  const showingFrom = metaData?.from ?? 0;
  const showingTo = metaData?.to ?? 0;
  const totalEntries = metaData?.total ?? 0;

  // Determine if pagination is needed (more than one page)
  const hasMultiplePages = metaData && totalPages > 1;
  const canGoPrevious = hasMultiplePages && metaData?.prevPageUrl;
  const canGoNext = hasMultiplePages && metaData?.nextPageUrl;

  return (
    <div className="flex items-center gap-2 justify-between p-2">
      <div className="flex-1 text-sm text-muted-foreground text-nowrap">
        {selectedRows > 0 ? (
          `${selectedRows} of ${table.getFilteredRowModel().rows.length} row(s) selected.`
        ) : (
          metaData ? `Showing ${showingFrom}-${showingTo} of ${totalEntries} total entries` : ''
        )}
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
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit text-nowrap items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          {/* First Page Button */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleNavigation(metaData?.firstPageUrl || null)}
            disabled={!canGoPrevious}
            title="Go to first page"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous Page Button */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleNavigation(metaData?.prevPageUrl)}
            disabled={!canGoPrevious}
            title="Go to previous page"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Next Page Button */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleNavigation(metaData?.nextPageUrl)}
            disabled={!canGoNext}
            title="Go to next page"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last Page Button */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleNavigation(metaData?.lastPageUrl || null)}
            disabled={!canGoNext}
            title="Go to last page"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}