"use no memo" // disables React Compiler just for this file/component

import type { Icon } from "@tabler/icons-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ExpandedState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  useReactTable
} from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: TypeScript module augmentation requires these parameters
  interface ColumnMeta<TData, TValue> {
    columnType?: "select" | "expand" | "actions" | "default"
    headerAlign?: "left" | "center" | "right"
    cellAlign?: "left" | "center" | "right"
    /** rótulo amigável exibido no menu de colunas/filtros */
    label?: string
    /** placeholder usado em filtros de coluna */
    placeholder?: string
    /** tipo de input de filtro */
    variant?: "text" | "number" | "date" | "select"
    /** ícone a ser exibido no cabeçalho ou filtros */
    icon?: React.FC<React.SVGProps<SVGSVGElement>> | Icon
  }
}

import { Checkbox } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import * as React from "react"
import { getInitialColumnPinning } from "./pinning-utils"

export interface ActionColumn<TData> {
  /** mostra coluna de actions */
  showActionColumn: boolean
  /** posição da coluna (default: right) */
  position?: "left" | "right"
  /** se deve ser fixada/pinned (default: true) */
  fixed?: boolean
  /** alinhamento do header (default: center) */
  headerAlign?: "left" | "center" | "right"
  /** alinhamento das células (default: center) */
  cellAlign?: "left" | "center" | "right"
  /** função para renderizar as actions */
  renderActions: (row: Row<TData>) => React.ReactNode
}

export interface SelectColumn {
  /** mostra coluna de seleção */
  showSelectColumn: boolean
  /** sempre left e sempre fixed */
}

export interface ExpandColumn<TData> {
  /** mostra coluna de expansão */
  showExpandColumn: boolean
  /** função para renderizar conteúdo expandido */
  renderExpandedContent: (row: Row<TData>) => React.ReactNode
  /** sempre left e sempre fixed */
}

export interface ExtraTableProps<TData> {
  /** estado de loading */
  states?: {
    /** loading inicial (primeira carga, sem dados) - mostra skeleton rows */
    loading?: boolean
    /** fetching durante refetch (já tem dados) - mostra overlay */
    fetching?: boolean
  }
  /** habilita search global (default: true) */
  enableGlobalFilter?: boolean
  /** habilita menu de visibilidade de colunas (default: true) */
  enableColumnVisibility?: boolean
  /** configuração da coluna de actions */
  actionColumn?: ActionColumn<TData>
  /** configuração da coluna de seleção */
  selectColumn?: SelectColumn
  /** configuração da coluna de expansão */
  expandColumn?: ExpandColumn<TData>
}

export interface UseDataTableProps<TData extends object>
  extends Omit<
    TableOptions<TData>,
    | "state"
    | "onStateChange"
    | "getCoreRowModel"
    | "getSortedRowModel"
    | "getPaginationRowModel"
    | "getFilteredRowModel"
  > {
  /** dados a exibir */
  data: TData[]
  /** definição de colunas */
  columns: ColumnDef<TData, unknown>[]
  /** estado inicial opcional */
  initialSorting?: SortingState
  initialPageSize?: number
  extraProps?: ExtraTableProps<TData>
}

// Helper para criar coluna de seleção
function createSelectColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "_select",
    header: ({ table }) => (
      <div className="flex h-full items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onChange={(event) =>
            table.toggleAllPageRowsSelected(event.target.checked)
          }
          aria-label="Selecionar todas as linhas"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onChange={(event) => row.toggleSelected(event.target.checked)}
          aria-label="Selecionar linha"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 44,
    minSize: 44,
    maxSize: 44,
    meta: {
      pinned: "left" as const,
      fixed: true,
      columnType: "select" as const,
      headerAlign: "center" as const,
      cellAlign: "center" as const
    }
  }
}

// Helper para criar coluna de expansão
function createExpandColumn<TData>(): ColumnDef<TData, unknown> {
  return {
    id: "_expand",
    header: ({ table }) => (
      <div className="flex h-full items-center justify-center">
        <button
          onClick={() => table.toggleAllRowsExpanded()}
          className="flex items-center justify-center rounded p-1 transition-transform hover:bg-muted"
          aria-label={
            table.getIsAllRowsExpanded()
              ? "Recolher todas as linhas"
              : "Expandir todas as linhas"
          }
        >
          <IconChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${
              table.getIsAllRowsExpanded() ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex h-full items-center justify-center">
        <button
          onClick={() => row.toggleExpanded()}
          className="flex items-center justify-center rounded p-1 transition-transform hover:bg-muted"
          aria-label={row.getIsExpanded() ? "Recolher linha" : "Expandir linha"}
        >
          <IconChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${
              row.getIsExpanded() ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 44,
    minSize: 44,
    maxSize: 44,
    meta: {
      pinned: "left" as const,
      fixed: true,
      columnType: "expand" as const,
      headerAlign: "center" as const,
      cellAlign: "center" as const
    }
  }
}

// Helper para criar coluna de actions
function createActionColumn<TData>(
  config: ActionColumn<TData>
): ColumnDef<TData, unknown> {
  return {
    id: "_actions",
    header: "Ações",
    cell: ({ row }) => config.renderActions(row),
    enableSorting: false,
    enableHiding: false,
    size: 150,
    minSize: 80,
    maxSize: 200,
    meta: {
      pinned: config.fixed ? config.position || "right" : false,
      fixed: config.fixed ?? true,
      columnType: "actions" as const,
      headerAlign: config.headerAlign || "center",
      cellAlign: config.cellAlign || "center"
    }
  }
}

// Helper para gerar colunas extras
function generateExtraColumns<TData>(extraProps?: ExtraTableProps<TData>): {
  leftColumns: ColumnDef<TData, unknown>[]
  rightColumns: ColumnDef<TData, unknown>[]
} {
  const leftColumns: ColumnDef<TData, unknown>[] = []
  const rightColumns: ColumnDef<TData, unknown>[] = []

  if (!extraProps) return { leftColumns, rightColumns }

  // Select sempre à esquerda (primeiro)
  if (extraProps.selectColumn?.showSelectColumn) {
    leftColumns.push(createSelectColumn<TData>())
  }

  // Expand sempre à esquerda (depois do select)
  if (extraProps.expandColumn?.showExpandColumn) {
    leftColumns.push(createExpandColumn<TData>())
  }

  // Actions pode ser left ou right
  if (extraProps.actionColumn?.showActionColumn) {
    const actionColumn = createActionColumn<TData>(extraProps.actionColumn)
    const position = extraProps.actionColumn.position || "right"

    if (position === "left") {
      leftColumns.push(actionColumn)
    } else {
      rightColumns.push(actionColumn)
    }
  }

  return { leftColumns, rightColumns }
}

export function useDataTable<TData extends object>(
  props: UseDataTableProps<TData>
) {
  const {
    data,
    columns: userColumns,
    initialSorting = [],
    initialPageSize = 10,
    extraProps,
    ...tableOptions
  } = props

  // controlled states
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize
  })
  const [globalFilter, setGlobalFilter] = React.useState<string>("")
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  // Gerar colunas combinadas
  const { leftColumns, rightColumns } = React.useMemo(
    () => generateExtraColumns(extraProps),
    [extraProps]
  )

  const columns = React.useMemo(
    () => [...leftColumns, ...userColumns, ...rightColumns],
    [leftColumns, userColumns, rightColumns]
  )

  // Estado de pinning baseado nas colunas
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    () => getInitialColumnPinning(columns)
  )

  const table = useReactTable<TData>({
    data,
    columns,
    ...tableOptions,
    meta: {
      extraProps,
      ...tableOptions.meta
    },
    state: {
      sorting,
      pagination,
      globalFilter,
      columnVisibility,
      columnFilters,
      rowSelection,
      expanded,
      columnPinning
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel:
      extraProps?.enableGlobalFilter !== false
        ? getFilteredRowModel()
        : undefined,
    enableRowSelection: extraProps?.selectColumn?.showSelectColumn ?? false,
    enableExpanding: extraProps?.expandColumn?.showExpandColumn ?? false
  })

  return {
    table,
    sorting,
    setSorting,
    pagination,
    setPagination,
    globalFilter,
    setGlobalFilter,
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    expanded,
    setExpanded,
    columnPinning,
    setColumnPinning
  }
}
