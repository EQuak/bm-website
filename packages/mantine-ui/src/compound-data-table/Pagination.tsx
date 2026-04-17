"use no memo"

import { Button, Select } from "@mantine/core"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight
} from "@tabler/icons-react"
import { useDataTableContext } from "./context"

export function Pagination() {
  const { table } = useDataTableContext<object>()

  if (!table.getCanPreviousPage() && !table.getCanNextPage()) return null

  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const totalRows = table.getFilteredRowModel().rows.length
  const pageSize = table.getState().pagination.pageSize

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3">
      <div className="pl-3 text-muted-foreground text-sm">
        {currentPage} de {totalPages} ({totalRows})
      </div>

      <div className="flex items-center space-x-2">
        <Select
          value={`${pageSize}`}
          w={80}
          placeholder={pageSize.toString()}
          data={[
            {
              value: "10",
              label: "10"
            },
            {
              value: "20",
              label: "20"
            },
            {
              value: "30",
              label: "30"
            },
            {
              value: "40",
              label: "40"
            },
            {
              value: "50",
              label: "50"
            },
            {
              value: "100",
              label: "100"
            },
            {
              value: "200",
              label: "200"
            }
          ]}
          onChange={(value) => {
            table.setPageSize(Number(value))
          }}
        />

        <Button
          variant="outline"
          className="hidden h-8 w-8 items-center justify-center p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir para primeira página</span>
          <IconChevronsLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 items-center justify-center p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Ir para página anterior</span>
          <IconChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 items-center justify-center p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir para próxima página</span>
          <IconChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 items-center justify-center p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Ir para última página</span>
          <IconChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
