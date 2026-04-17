"use no memo" // disables React Compiler just for this file/component

import { Loader, Skeleton } from "@mantine/core"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { flexRender, type HeaderGroup, type Row } from "@tanstack/react-table"
import React from "react"
import { cn } from "../utils/cn"
import { useDataTableContext } from "./context"
import {
  getPinningCellClasses,
  getPinningHeaderClasses,
  getPinningStyles
} from "./pinning-utils"
import type { ExtraTableProps } from "./useDataTable"

interface TableMeta<TData> {
  extraProps?: ExtraTableProps<TData>
}

function getVisibleCellSignature<TData>(
  cells: ReturnType<Row<TData>["getVisibleCells"]>
) {
  return cells.map((cell) => cell.id).join("|")
}

type MemoRowProps<TData extends object> = {
  row: Row<TData>
  visibleCells: ReturnType<Row<TData>["getVisibleCells"]>
  isSelected: boolean
  isExpanded: boolean
  expandedColSpan: number
  renderExpandedContent?: (row: Row<TData>) => React.ReactNode
}

function MemoRowImpl<TData extends object>({
  row,
  visibleCells,
  isSelected,
  isExpanded,
  expandedColSpan,
  renderExpandedContent
}: MemoRowProps<TData>) {
  return (
    <React.Fragment key={row.id}>
      <tr
        key={row.id}
        data-state={isSelected && "selected"}
        className="group border-b border-b-mtn-default-border bg-[var(--data-table-tr-row-background-color)] transition-colors hover:bg-[var(--data-table-tr-row-background-color-hover)] data-[state=selected]:bg-[var(--data-table-tr-row-background-color-selected)]"
      >
        {visibleCells.map((cell) => {
          const { column } = cell
          const pinningInfo = getPinningCellClasses(column)

          return (
            <td
              key={cell.id}
              className={cn(
                "truncate px-2 py-2 transition-colors",
                pinningInfo.classes,
                // Alinhamento baseado no meta da coluna
                column.columnDef.meta?.cellAlign === "center" && "text-center",
                column.columnDef.meta?.cellAlign === "right" && "text-right",
                column.columnDef.meta?.cellAlign === "left" && "text-left",
                pinningInfo.isPinned && [
                  "bg-[var(--data-table-tr-row-background-color)]",
                  "group-hover:bg-[var(--data-table-tr-row-background-color-hover)]",
                  "group-data-[state=selected]:bg-[var(--data-table-tr-row-background-color-selected)]",
                  "[.group[data-state=selected]:hover_&]:bg-[var(--data-table-tr-row-background-color-hover)]"
                ]
              )}
              style={{
                ...getPinningStyles(column)
              }}
              data-pinned={pinningInfo.isPinned || undefined}
              data-column-type={column.columnDef.meta?.columnType || undefined}
              data-last-col={
                pinningInfo.isLastLeftPinned
                  ? "left"
                  : pinningInfo.isFirstRightPinned
                    ? "right"
                    : undefined
              }
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          )
        })}
      </tr>
      {isExpanded && (
        <tr key={`${row.id}-expanded`}>
          <td colSpan={expandedColSpan} className="p-0">
            <div className="border-t bg-mtn-dimmed/25">
              {renderExpandedContent ? (
                renderExpandedContent(row)
              ) : (
                <div className="p-4 text-muted-foreground">
                  Nenhum conteúdo expandido configurado
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  )
}

function areRowsEqual<TData extends object>(
  prev: MemoRowProps<TData>,
  next: MemoRowProps<TData>
) {
  if (prev.row.id !== next.row.id) return false
  if (prev.row.original !== next.row.original) return false
  if (prev.isSelected !== next.isSelected) return false
  if (prev.isExpanded !== next.isExpanded) return false
  if (prev.expandedColSpan !== next.expandedColSpan) return false
  if (prev.renderExpandedContent !== next.renderExpandedContent) return false

  return (
    getVisibleCellSignature(prev.visibleCells) ===
    getVisibleCellSignature(next.visibleCells)
  )
}

const MemoRow = React.memo(MemoRowImpl, areRowsEqual) as <TData extends object>(
  props: MemoRowProps<TData>
) => React.ReactElement

// Componente de linhas skeleton para loading
function SkeletonRows({
  columnCount,
  rowCount = 5
}: {
  columnCount: number
  rowCount?: number
}) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <tr
          key={`skeleton-row-${rowIndex}`}
          className="border-b border-b-mtn-default-border bg-[var(--data-table-tr-row-background-color)]"
        >
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <td
              key={`skeleton-cell-${rowIndex}-${colIndex}`}
              className="px-2 py-2"
            >
              <Skeleton height={20} radius="sm" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

// Overlay de loading para refetch (mantém dados visíveis)
function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-black/40">
      <div className="flex items-center gap-2 rounded-md bg-white px-4 py-2 shadow-md dark:bg-gray-800">
        <Loader size="sm" />
        <span className="text-muted-foreground text-sm">Atualizando...</span>
      </div>
    </div>
  )
}

export function Table<TData extends object>({
  useScrollArea = false,
  wrapperClassName,
  tableClassName
}: {
  useScrollArea?: boolean
  wrapperClassName?: string
  tableClassName?: string
}) {
  const { table } = useDataTableContext<TData>()

  // Extrair estados de loading do meta
  const meta = table.options.meta as TableMeta<TData> | undefined
  const isLoading = meta?.extraProps?.states?.loading ?? false
  const isFetching = meta?.extraProps?.states?.fetching ?? false
  const columnCount = table.getAllColumns().length
  const rowCount = table.getRowModel().rows?.length ?? 0
  const renderExpandedContent =
    meta?.extraProps?.expandColumn?.renderExpandedContent

  return (
    <div
      className={cn(
        useScrollArea ? "w-full" : "data-table-scroll w-full overflow-auto",
        "relative",
        wrapperClassName
      )}
    >
      {/* Overlay de loading durante refetch */}
      {isFetching && <LoadingOverlay />}

      <table
        className={cn(
          "[&_tr:hover_td[data-pinned]]:data-table-tr-row-background-color-hover [&_tr[data-state=selected]_td[data-pinned]]:data-table-tr-row-background-color-selected [&_tr[data-state=selected]:hover_td[data-pinned]]:data-table-tr-row-background-color-selected-hover w-full caption-bottom border-separate border-spacing-0 text-sm [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-border [&_th]:border-b [&_th]:border-b-mtn-default-border [&_tr:not(:last-child)_td]:border-b [&_tr:not(:last-child)_td]:border-b-mtn-default-border [&_tr]:border-none",
          tableClassName
        )}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
            <tr key={headerGroup.id} className="data-table-th-background-color">
              {headerGroup.headers.map(
                (header: HeaderGroup<TData>["headers"][number]) => {
                  const { column } = header
                  const pinningInfo = getPinningHeaderClasses(column)

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "h-9 truncate px-2 py-2.5 text-left font-semibold dark:text-white",
                        pinningInfo.classes,
                        pinningInfo.isPinned &&
                          "bg-[var(--data-table-th-background-color)]"
                      )}
                      style={{
                        ...getPinningStyles(column),
                        width: header.column.getSize(),
                        minWidth: header.column.columnDef.minSize,
                        maxWidth: header.column.columnDef.maxSize
                      }}
                      data-pinned={pinningInfo.isPinned || undefined}
                      data-column-type={
                        column.columnDef.meta?.columnType || undefined
                      }
                      data-last-col={
                        pinningInfo.isLastLeftPinned
                          ? "left"
                          : pinningInfo.isFirstRightPinned
                            ? "right"
                            : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            header.column.getCanSort() &&
                              "cursor-pointer select-none",
                            // Alinhamento baseado no meta da coluna
                            header.column.columnDef.meta?.headerAlign ===
                              "center" && "justify-center",
                            header.column.columnDef.meta?.headerAlign ===
                              "right" && "justify-end",
                            header.column.columnDef.meta?.headerAlign ===
                              "left" && "justify-start"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="truncate">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {header.column.getCanSort() &&
                            header.column.getIsSorted() && (
                              <div className="flex flex-col">
                                {header.column.getIsSorted() === "desc" ? (
                                  <IconChevronDown className="size-4" />
                                ) : (
                                  <IconChevronUp className="size-4" />
                                )}
                              </div>
                            )}
                        </div>
                      )}
                    </th>
                  )
                }
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {/* Loading inicial: mostrar skeleton rows (quando loading=true) */}
          {isLoading ? (
            <SkeletonRows columnCount={columnCount} rowCount={5} />
          ) : rowCount > 0 ? (
            table
              .getRowModel()
              .rows.map((row: Row<TData>) => (
                <MemoRow
                  key={row.id}
                  row={row}
                  visibleCells={row.getVisibleCells()}
                  isSelected={row.getIsSelected()}
                  isExpanded={row.getIsExpanded()}
                  expandedColSpan={columnCount}
                  renderExpandedContent={renderExpandedContent}
                />
              ))
          ) : (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="h-24 text-center text-muted-foreground"
              >
                Nenhum resultado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
