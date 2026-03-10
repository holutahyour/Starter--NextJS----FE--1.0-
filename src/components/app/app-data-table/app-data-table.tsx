"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  TableOptions,
  useReactTable,
  VisibilityState,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/sdcn-input"
import { Card, CardContent } from "@/components/ui/sdcn-card"
import { useModifyQuery } from "@/hooks/use-modify-query"
import { useQuery } from "@/hooks/use-query"
import { APP_DEFAULT_PAGE, APP_DRAWER } from "@/lib/routes"
import { handleExport } from "@/lib/utils"
import { Button, Heading, HStack, Separator, Stack } from "@chakra-ui/react"
import { Banknote } from "lucide-react"
import React, { useEffect, useState } from "react"
import { LuArrowRight, LuShare } from "react-icons/lu"
import DataTableContent from "./data-table-content"
import DataTableETL from "./data-table-etl"
import { DataTablePagination } from "./data-table-pagination"
import { DataTablePaginationMetaData } from "./data-table-pagination-metadata"
import { DataTableViewOptions } from "./data-table-view-option"
import { IFeePayment } from "@/data/interface/IFeePayment"
import { IPaginationMetaData } from "@/data/interface/IPagination"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DataTableFilter } from "./data-table-filter"

type FilterConfig = {
  key: keyof IFeePayment
  placeholder: string
}

interface AppDataTableProps<TData, TValue> {
  filters?: FilterConfig[]
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title?: string
  titleElement?: React.ReactNode
  filter: string
  initialState?: Partial<TableOptions<TData>['state']>
  filterPlaceholder: string
  loading: boolean
  redirectUri?: string
  drawerUrl?: string
  multiSelectBtnName?: string
  onMultiSelectAction?: (selectedRows: TData[]) => void
  fillterElement?: React.ReactNode
  onImport?: ((file: File[]) => Promise<void>) | ((file: File[]) => void)
  customButton?: React.ReactNode
  syncButton?: React.ReactNode
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  onPageSizeChange?: (size: number) => void;
  onPageChange?: (page: number) => void;
  metaData?: IPaginationMetaData | null;
  onNavigateToUrl?: (url: string) => void;
}

export default function AppDataTable<TData, TValue>({
  columns,
  data,
  title,
  titleElement,
  filter,
  filterPlaceholder,
  loading,
  redirectUri,
  drawerUrl,
  multiSelectBtnName,
  onMultiSelectAction,
  onImport,
  fillterElement,
  initialState,
  customButton, // ✅ NEW
  syncButton,
  pageCount,
  pagination: controlledPagination,
  onPaginationChange: setControlledPagination,
  onPageSizeChange,
  onPageChange,
  metaData,
  onNavigateToUrl,
}: AppDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [uncontrolledPagination, setUncontrolledPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

  const pagination = controlledPagination ?? uncontrolledPagination
  const onPaginationChange = setControlledPagination ?? setUncontrolledPagination

  // Use metadata pageCount when available, otherwise use provided pageCount or -1
  const finalPageCount = metaData ? metaData.lastPage : (pageCount ?? -1);

  const table = useReactTable({
    data,
    columns,
    pageCount: finalPageCount,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: onPaginationChange,
    manualPagination: !!onPageChange,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination,
    },
    defaultColumn: {
      size: 150,
      minSize: 1,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    ...(initialState ? { initialState } : {}),
  })

  useEffect(() => {
    const clearHandler = () => setRowSelection({})
    const tableElement = document.querySelector('[data-table-instance]')
    if (tableElement) {
      tableElement.addEventListener('clearSelection', clearHandler)
    }
    return () => {
      if (tableElement) {
        tableElement.removeEventListener('clearSelection', clearHandler)
      }
    }
  }, [])

  return (
    <Card className="my-4 min-w-fit" data-table-instance>
      <CardContent className="pt-6 p-5">
        <Stack>
          <AppDataTableHeader
            table={table}
            title={title}
            titleElement={titleElement}
            filter={filter}
            filterPlaceholder={filterPlaceholder}
            fillterElement={fillterElement}
            loading={loading}
            onExport={() => handleExport<TData[]>(data ?? [], title as string)}
            redirectUri={redirectUri ?? APP_DEFAULT_PAGE()}
            drawerUrl={drawerUrl}
            onImport={onImport}
            multiSelectBtnName={multiSelectBtnName}
            onMultiSelectAction={onMultiSelectAction}
            customButton={customButton} // ✅ PASS IT IN
            syncButton={syncButton}
          />

          <DataTableContent
            loading={loading}
            table={table}
            flexRender={flexRender}
            columns={columns}
          />

          {metaData ? (
            <DataTablePaginationMetaData
              table={table}
              metaData={metaData}
              multiSelectBtnName={multiSelectBtnName}
              onMultiSelectAction={onMultiSelectAction}
              onPageSizeChange={onPageSizeChange}
              onPageChange={onPageChange}
              onNavigateToUrl={onNavigateToUrl}
            />
          ) : (
            <DataTablePagination
              table={table}
              multiSelectBtnName={multiSelectBtnName}
              onMultiSelectAction={onMultiSelectAction}
              onPageSizeChange={onPageSizeChange}
              onPageChange={onPageChange}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

interface AppDataTableHeaderProps<TData> {
  table: Table<TData>
  data?: TData[]
  title?: string
  titleElement?: React.ReactNode
  filter: string
  filterPlaceholder: string
  onImport?: ((file: File[]) => Promise<void>) | ((file: File[]) => void)
  onDownload?: (() => Promise<void>) | (() => void)
  onExport?: (() => Promise<void>) | (() => void)
  loading: boolean
  redirectUri: string
  drawerUrl?: string
  fillterElement: React.ReactNode
  multiSelectBtnName?: string
  onMultiSelectAction?: (selectedRows: TData[]) => void
  customButton?: React.ReactNode // ✅ NEW
  syncButton?: React.ReactNode
}

function AppDataTableHeader<TData>({
  table,
  data,
  title,
  filter,
  filterPlaceholder,
  onImport,
  onDownload,
  onExport,
  loading,
  redirectUri,
  drawerUrl,
  titleElement,
  fillterElement,
  multiSelectBtnName,
  onMultiSelectAction,
  customButton, // ✅ NEW
  syncButton,
}: AppDataTableHeaderProps<TData>) {
  return (
    <HStack justifyContent="space-between" pb="6">
      <AppDataTableLabel title={title} titleElement={titleElement} />
      <AppDataTableFilter
        table={table}
        title={title}
        filter={filter}
        filterPlaceholder={filterPlaceholder}
        fillterElement={fillterElement}
        loading={loading}
        onImport={onImport}
        onExport={onExport}
        drawerUrl={drawerUrl}
        multiSelectBtnName={multiSelectBtnName}
        onMultiSelectAction={onMultiSelectAction}
        customButton={customButton} // ✅ NEW
        syncButton={syncButton}
        redirectUri={""} />
    </HStack>
  )
}

function AppDataTableLabel({
  title,
  titleElement,
}: {
  title?: string
  titleElement: React.ReactNode
}) {
  return (
    titleElement ?? (
      <HStack align="center" gap="5">
        <Banknote />
        <Heading size="lg" fontWeight="bold">
          {title ?? "Table"}
        </Heading>
      </HStack>
    )
  )
}

function AppDataTableFilter<TData>({
  table,
  title,
  filter,
  filterPlaceholder,
  onImport,
  onDownload,
  onExport,
  loading,
  drawerUrl,
  fillterElement,
  multiSelectBtnName,
  onMultiSelectAction,
  customButton,
  syncButton,
}: AppDataTableHeaderProps<TData>) {
  const { router } = useQuery(APP_DRAWER, "true")
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isAddStudentPage = pathname.includes("/miscellaneousbills")

  const selectedRows = table.getFilteredSelectedRowModel().rows.length

  useEffect(() => {
    setIsOpen(selectedRows > 0)
  }, [selectedRows])

  const handleAction = () => {
    const selected = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original)
    if (onMultiSelectAction) onMultiSelectAction(selected)
  }

  return (
    <HStack align="center" gap={4}>
      {syncButton && syncButton}
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            {multiSelectBtnName && (
              <div className="bg-slate-50 text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
                <span className="text-sm font-medium">
                  {selectedRows} selected
                </span>
                <div className="w-px h-4 bg-white-700" />
                <Button
                  className="bg-primary text-white rounded-md px-3 py-1 text-sm"
                  size="sm"
                  onClick={handleAction}
                >
                  <LuShare className="mr-2 h-4 w-4" />
                  {multiSelectBtnName}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <DataTableFilter table={table} filterPlaceholder={filterPlaceholder} />

      {(onImport || onExport || onDownload) && (
        <DataTableETL
          table={table}
          onImport={onImport}
          onDownload={onDownload}
          onExport={onExport}
        />
      )}

      {!isAddStudentPage && <DataTableViewOptions table={table} />}

      {drawerUrl && (
        <>
          <Separator
            variant="solid"
            borderColor="gray.700"
            orientation="vertical"
            height="6"
          />
          <Button
            onClick={() => router.push(drawerUrl)}
            size="xs"
            colorScheme="primary"
          >
            Import {title} <LuArrowRight />
          </Button>
        </>
      )}

      {customButton && customButton}

      {fillterElement}
    </HStack>
  )
}
