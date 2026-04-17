import type { Column, ColumnDef } from "@tanstack/react-table"
import type { CSSProperties } from "react"

// Extend the meta type to include our custom properties
declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: Module declaration
  interface ColumnMeta<TData, TValue> {
    pinned?: "left" | "right" | false
    fixed?: boolean
  }
}

/**
 * Helper function to compute pinning styles for columns
 * Based on TanStack Table pinning example
 */
export const getPinningStyles = <TData,>(
  column: Column<TData>
): CSSProperties => {
  const isPinned = column.getIsPinned()
  // const pinnedPosition = column.columnDef.meta?.pinned

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0
  }
}

/**
 * Get pinning classes for table header cells
 */
export const getPinningHeaderClasses = <TData,>(column: Column<TData>) => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left")
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right")

  return {
    isPinned,
    isLastLeftPinned,
    isFirstRightPinned,
    classes: [
      // Base pinning styles
      "relative",
      isPinned &&
        "data-pinned:data-table-th-background-color data-pinned:backdrop-blur-xs",
      // Border styles for pinned columns
      isLastLeftPinned && "border-r border-r-mtn-default-border",
      isFirstRightPinned && "border-l border-l-mtn-default-border",
      // Hide resize handle on specific conditions
      "[&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0",
      "[&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0",
      "[&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0"
    ]
      .filter(Boolean)
      .join(" ")
  }
}

/**
 * Get pinning classes for table body cells
 */
export const getPinningCellClasses = <TData,>(column: Column<TData>) => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left")
  const isFirstRightPinned =
    isPinned === "right" && column.getIsFirstColumn("right")

  return {
    isPinned,
    isLastLeftPinned,
    isFirstRightPinned,
    classes: [
      // Base pinning styles
      isPinned &&
        "data-pinned:data-table-tr-row-background-color data-pinned:backdrop-blur-lg",
      // Border styles for pinned columns
      isLastLeftPinned && "border-r border-r-mtn-default-border",
      isFirstRightPinned && "border-l border-l-mtn-default-border"
    ]
      .filter(Boolean)
      .join(" ")
  }
}

/**
 * Configure column pinning based on meta information
 */
export const configureColumnPinning = <TData,>(columns: ColumnDef<TData>[]) => {
  return columns.map((column) => {
    const pinnedPosition = column.meta?.pinned
    if (pinnedPosition && column.meta?.fixed) {
      return {
        ...column,
        // TanStack Table will use this for pinning
        enablePinning: true
      }
    }
    return column
  })
}

/**
 * Get initial column pinning state from columns
 */
export const getInitialColumnPinning = <TData,>(
  columns: ColumnDef<TData>[]
) => {
  const left: string[] = []
  const right: string[] = []

  columns.forEach((column) => {
    if (column.meta?.pinned === "left" && column.meta?.fixed) {
      const id =
        column.id || ("accessorKey" in column ? column.accessorKey : undefined)
      if (id) left.push(String(id))
    } else if (column.meta?.pinned === "right" && column.meta?.fixed) {
      const id =
        column.id || ("accessorKey" in column ? column.accessorKey : undefined)
      if (id) right.push(String(id))
    }
  })

  return { left, right }
}
