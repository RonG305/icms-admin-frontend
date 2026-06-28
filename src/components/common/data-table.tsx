"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  EyeOff,
  Search,
  Settings2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  title?: string
  searchColumn?: string
  searchPlaceholder?: string
  filters?: React.ReactNode
  toolbar?: React.ReactNode
  emptyMessage?: string
  defaultPageSize?: number
  showSelectionCount?: boolean
  onExport?: () => void
  paginationComponent?: React.ReactNode
}

export function DataTable<TData>({
  columns,
  data,
  title,
  searchColumn,
  searchPlaceholder = "Search...",
  filters,
  toolbar,
  emptyMessage = "No results.",
  defaultPageSize = 10,
  showSelectionCount = true,
  onExport,
  paginationComponent,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
    enableRowSelection: true,
    manualPagination: !!paginationComponent,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const hideableColumns = table
    .getAllColumns()
    .filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide())

  const totalRows = table.getFilteredRowModel().rows.length

  return (
    <div className="flex flex-col gap-4 p-4 md:p-5">
      {filters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          {title ? (
            <>
              <h3 className="text-base font-semibold whitespace-nowrap">{title}</h3>
              <span className="inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground min-w-[1.5rem]">
                {totalRows}
              </span>
            </>
          ) : (
            searchColumn && !searchOpen && (
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={searchPlaceholder}
                  value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
                  onChange={(e) => table.getColumn(searchColumn)?.setFilterValue(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            )
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {title && searchColumn && (
            searchOpen ? (
              <div className="flex items-center gap-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    autoFocus
                    placeholder={searchPlaceholder}
                    value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
                    onChange={(e) => table.getColumn(searchColumn)?.setFilterValue(e.target.value)}
                    className="pl-9 h-8 w-48"
                  />
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => { setSearchOpen(false); table.getColumn(searchColumn)?.setFilterValue("") }}>
                  ✕
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs cursor-pointer" onClick={() => setSearchOpen(true)}>
                <Search className="size-3.5" />
                Search
              </Button>
            )
          )}

          {toolbar}

          {hideableColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs cursor-pointer">
                  <EyeOff className="size-3.5" />
                  <span className="hidden sm:inline">Hide</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {hideableColumns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs cursor-pointer">
                <Settings2 className="size-3.5" />
                <span className="hidden sm:inline">Customize</span>
                <span className="hidden sm:inline text-muted-foreground">···</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuCheckboxItem checked>Compact rows</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>Show borders</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {onExport ? (
            <Button size="sm" className="h-8 gap-1.5 text-xs cursor-pointer" onClick={onExport}>
              <Download className="size-3.5" />
              Export
              <ChevronDown className="size-3.5 ml-0.5" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs cursor-pointer">
                  <Download className="size-3.5" />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuCheckboxItem>CSV</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Excel</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>PDF</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
        <Table>
          <TableHeader className="bg-muted/60 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border/60">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="uppercase text-[11px] tracking-wider font-semibold text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="hover:bg-muted/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-sm py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationComponent ? (
        <div>{paginationComponent}</div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          {showSelectionCount ? (
            <p className="text-muted-foreground hidden text-sm lg:block">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </p>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-6 lg:gap-8">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium whitespace-nowrap">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20 cursor-pointer" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="hidden size-8 p-0 lg:flex cursor-pointer"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">First page</span>
                <ChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 cursor-pointer"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Previous page</span>
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 cursor-pointer"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Next page</span>
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 p-0 lg:flex cursor-pointer"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Last page</span>
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
