import { Table } from "@tanstack/react-table"

import {
    Table as SdcnTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/sdcn-table"
import { useRef } from "react"
import AppLoader from "../app-loader"
import AppEmptyState from "../app-empty-state"

interface DataTableContentProps<TData> {
    table: Table<TData>
    flexRender: any,
    columns: any,
    loading: boolean
}

function DataTableContent<TData>({
    table,
    flexRender,
    columns,
    loading
}: DataTableContentProps<TData>) {
    const parentRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={parentRef} className="rounded-md border">
            <SdcnTable className="text-xs">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className="px-2 py-0 font-bold min-w-fit"
                                        {...{
                                            colSpan: header.colSpan,
                                            style: {
                                                width: header.getSize(),
                                            },
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        // Show loading state for entire table
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-96 text-center">
                                <AppLoader size="sm" />
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                        // Show data rows when not loading and has data
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="px-2 py-[2px] min-w-fit font-semibold"
                                        {...{
                                            style: {
                                                width: cell.column.getSize(),
                                            },
                                        }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        // Show empty state when no data
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-96 text-center">
                                <AppEmptyState heading='Empty Table' description='import or fetch new data' />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </SdcnTable>
        </div>
    )
}

export default DataTableContent