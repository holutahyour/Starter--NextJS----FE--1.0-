'use client'

import { ActionBarContent, ActionBarRoot, ActionBarSelectionTrigger, ActionBarSeparator } from "@/components/ui/chakra-action-bar"
import { Checkbox } from "@/components/ui/chakra-checkbox"
import { PaginationItems, PaginationNextTrigger, PaginationPageText, PaginationPrevTrigger, PaginationRoot } from "@/components/ui/chakra-pagination"
import { Button } from "@/components/ui/sdcn-button"
import { Box, BoxProps, HStack, Kbd, Stack, Table } from "@chakra-ui/react"
import { JSX, useState } from "react"

const pageSize = 10
//const count = 50
// const items = new Array(count)
//   .fill(0)
//   .map((_, index) => `Lorem ipsum dolor sit amet ${index + 1}`)


export interface AppTableProps extends BoxProps {
  items: any,
  filters: AppTableFilterProps[],
  headers: AppTableHeaderProps[]
  hasCheckbox: boolean
  hasActionBar?: boolean,
  compact?: boolean
}

export interface AppTableFilterProps extends BoxProps {
  name: string,
  menu: ({ icon?: React.ReactElement, value: string, badge?: string | number } | JSX.Element)[]
}

export interface AppTableHeaderProps { field: string }

interface AppTableComponentProps {
  headers?: AppTableHeaderProps[],
  indeterminate?: boolean,
  selection?: string[],
  setSelection?: (selction: any) => void,
  hasSelection?: boolean,
  visibleItems?: any,
  count?: number,
  pageSize?: number,
  page?: number,
  setPage?: (page: number) => void
  hasCheckbox?: boolean,
  hasActionBar?: boolean,
  compact?: boolean
}

function AppTable({ items, filters, headers, hasCheckbox, hasActionBar, compact }: AppTableProps) {
  const [selection, setSelection] = useState<string[]>([])

  const hasSelection = selection.length > 0
  const indeterminate = hasSelection && selection.length < items.length

  const [page, setPage] = useState(1)

  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize

  const visibleItems = items.slice(startRange, endRange)

  return (
    <Box scrollSnapAlign='start'>
      <Stack gap='5'>
        <Table.ScrollArea borderWidth="1px" rounded="md" h={`${425}px`}>
          <Table.Root size="sm" stickyHeader interactive >
            <AppTableHeader
              headers={headers}
              indeterminate={indeterminate}
              selection={selection}
              setSelection={setSelection}
              hasCheckbox={hasCheckbox}
              compact={compact}
            />
            <AppTableBody compact={compact} visibleItems={visibleItems} selection={selection} setSelection={setSelection} />
          </Table.Root>
        </Table.ScrollArea>
        <AppTablePagination count={items.length} pageSize={pageSize} page={page} setPage={setPage} />
        {hasActionBar && (<AppTableActionBar hasSelection={hasSelection} selection={selection} />)}
      </Stack>
    </Box>

  )
}


const AppTableHeader = ({ headers, indeterminate, selection, setSelection, hasCheckbox, compact }: AppTableComponentProps) => {
  const p = '4'
  const defaultP = '2'
  return (
    <Table.Header>
      <Table.Row bg="bg.subtle">
        {hasCheckbox && (<Table.ColumnHeader p={compact ? defaultP : p} w="6">
          <Checkbox
            //top="1"
            aria-label="Select all rows"
            checked={indeterminate ? "indeterminate" : selection && (selection?.length > 0)}
            onCheckedChange={setSelection && ((changes) => {
              setSelection(
                changes.checked ? items.map((item) => item.name) : [],
              )
            })}
          />
        </Table.ColumnHeader>)}
        {headers?.map((h,i) => (
          <Table.ColumnHeader key={i} p={compact ? defaultP : p} _last={{ textAlign: "end" }}>{h.field}</Table.ColumnHeader>
        ))}
      </Table.Row>
    </Table.Header>
  )
}

const AppTableBody = ({ visibleItems, selection, setSelection, hasCheckbox, compact }: AppTableComponentProps) => {
  const p = '4'
  const defaultP = '2'
  return (
    <Table.Body>
      {visibleItems.map((item, i) => (
        <Table.Row
          key={i}
          data-selected={selection && (selection.includes(item.name) ? "" : undefined)}

        >
          {hasCheckbox && (<Table.Cell p={compact ? defaultP : p}>
            <Checkbox
              //top="1"
              aria-label="Select row"
              checked={selection && (selection.includes(item.name))}
              onCheckedChange={setSelection && ((changes) => {
                setSelection((prev) =>
                  changes.checked
                    ? [...prev, item.name]
                    : selection && (selection.filter((name) => name !== item.name)),
                )
              })}
            />
          </Table.Cell>)}
          <Table.Cell p={compact ? defaultP : p}>{item.name}</Table.Cell>
          <Table.Cell p={compact ? defaultP : p}>{item.category}</Table.Cell>
          <Table.Cell p={compact ? defaultP : p} textAlign="end">{item.price}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  )
}

const AppTablePagination = ({ count, pageSize, page, setPage }: AppTableComponentProps) => {
  return (
    <PaginationRoot
      count={count ?? 0}
      pageSize={pageSize}
      page={page}
      onPageChange={setPage && ((e) => setPage(e.page))}
      size='xs'
    >
      <HStack px='2'>
        <PaginationPageText fontSize='sm' format="long" flex="1" />
        <HStack wrap="wrap">
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </HStack>

    </PaginationRoot>
  )
}

const AppTableActionBar = ({ hasSelection, selection }: AppTableComponentProps) => {
  return (
    <ActionBarRoot open={hasSelection}>
      <ActionBarContent>
        <ActionBarSelectionTrigger>
          {selection?.length} selected
        </ActionBarSelectionTrigger>
        <ActionBarSeparator />
        <Button variant="outline" size="sm">
          Delete <Kbd>⌫</Kbd>
        </Button>
        <Button variant="outline" size="sm">
          Share <Kbd>T</Kbd>
        </Button>
      </ActionBarContent>
    </ActionBarRoot>
  )
}

export default AppTable;

const items = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
  { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
  { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
  { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
  { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
  { id: 6, name: "Electric Kettle", category: "Kitchen Appliances", price: 25.99 },
  { id: 7, name: "Bluetooth Speaker", category: "Electronics", price: 75.49 },
  { id: 8, name: "Yoga Mat", category: "Fitness", price: 29.99 },
  { id: 9, name: "Gaming Mouse", category: "Accessories", price: 49.99 },
  { id: 10, name: "Bookshelf", category: "Furniture", price: 200.0 },
  { id: 11, name: "Air Conditioner", category: "Home Appliances", price: 499.99 },
  { id: 12, name: "Electric Toothbrush", category: "Personal Care", price: 34.99 },
  { id: 13, name: "Vacuum Cleaner", category: "Home Appliances", price: 299.99 },
  { id: 14, name: "Digital Camera", category: "Electronics", price: 550.0 },
  { id: 15, name: "Fitness Tracker", category: "Fitness", price: 99.99 },
  { id: 16, name: "Microwave Oven", category: "Kitchen Appliances", price: 89.99 },
  { id: 17, name: "Water Bottle", category: "Accessories", price: 15.99 },
  { id: 18, name: "Monitor", category: "Electronics", price: 199.49 },
  { id: 19, name: "Desk Lamp", category: "Furniture", price: 45.0 },
  { id: 20, name: "Smartwatch", category: "Electronics", price: 299.99 },
  { id: 21, name: "Tennis Racket", category: "Sports", price: 79.99 },
  { id: 22, name: "Blender", category: "Kitchen Appliances", price: 59.99 },
  { id: 23, name: "Hair Dryer", category: "Personal Care", price: 39.99 },
  { id: 24, name: "Printer", category: "Electronics", price: 125.0 },
  { id: 25, name: "Gaming Console", category: "Electronics", price: 499.99 },
  { id: 26, name: "Office Chair", category: "Furniture", price: 179.99 },
  { id: 27, name: "Cordless Drill", category: "Tools", price: 89.99 },
  { id: 28, name: "Rug", category: "Home Decor", price: 120.0 },
  { id: 29, name: "Smart Thermostat", category: "Electronics", price: 199.99 },
  { id: 30, name: "Action Camera", category: "Electronics", price: 329.99 },
  { id: 31, name: "Air Fryer", category: "Kitchen Appliances", price: 139.99 },
  { id: 32, name: "Dishwasher", category: "Home Appliances", price: 849.99 },
  { id: 33, name: "Portable Projector", category: "Electronics", price: 199.99 },
  { id: 34, name: "Soundbar", category: "Electronics", price: 299.99 },
  { id: 35, name: "Electric Scooter", category: "Transportation", price: 399.99 }
];

