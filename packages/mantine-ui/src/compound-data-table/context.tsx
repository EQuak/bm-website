"use no memo"

import type { Table } from "@tanstack/react-table"
import { createContext, useContext } from "react"

// Generic table context holding TanStack Table instance
export interface DataTableContextValue<TData extends object> {
  table: Table<TData>
}

// runtime fallback to enforce provider usage
function throwMissingProvider(): never {
  throw new Error("useDataTableContext must be used within a DataTableProvider")
}

// we initialise context with undefined and narrow later
export const DataTableContext =
  createContext<DataTableContextValue<object> | null>(null)

export function useDataTableContext<TData extends object>() {
  const ctx = useContext(DataTableContext)
  if (!ctx) throwMissingProvider()
  return {
    table: ctx.table as unknown as Table<TData>
  } as DataTableContextValue<TData>
}

export function DataTableProvider<TData extends object>({
  table,
  children
}: {
  table: Table<TData>
  children: React.ReactNode
}) {
  return (
    <DataTableContext.Provider
      value={{ table: table as unknown as Table<object> }}
    >
      {children}
    </DataTableContext.Provider>
  )
}
