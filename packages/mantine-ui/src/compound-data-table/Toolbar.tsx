"use no memo"

import type { ReactNode } from "react"
import { cn } from "../utils/cn"
import { ColumnToggle } from "./ColumnToggle"
import { useDataTableContext } from "./context"
import { GlobalSearch } from "./GlobalSearch"

interface ToolbarProps {
  children?: ReactNode
  className?: string
  /** Componente customizado para substituir o GlobalSearch padrão */
  searchComponent?: ReactNode
  globalSearchProps?: {
    className?: string
    placeholder?: string
  }
}

export function Toolbar({
  children,
  className = "",
  searchComponent,
  globalSearchProps
}: ToolbarProps) {
  // Acessa o contexto para garantir que o provider está presente
  useDataTableContext<object>()

  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-center justify-between gap-3",
        className
      )}
    >
      {searchComponent || <GlobalSearch {...globalSearchProps} />}
      <div className="flex items-center gap-2">
        {children}
        <ColumnToggle />
      </div>
    </div>
  )
}
