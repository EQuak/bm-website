"use no memo" // disables React Compiler just for this file/component

import { ScrollArea } from "@mantine/core"
import type { ReactNode } from "react"
import { cn } from "../utils"

interface TableRootProps {
  children: ReactNode
  className?: string
  height?: number | string
  useScrollArea?: boolean
}

export function TableRoot({
  children,
  className = "",
  height = "auto",
  useScrollArea = false
}: TableRootProps) {
  if (useScrollArea) {
    return (
      <ScrollArea
        className={cn(className)}
        style={{ height }}
        scrollbarSize={8}
        offsetScrollbars
      >
        {children}
      </ScrollArea>
    )
  }

  return (
    <div className={cn("relative overflow-auto", className)}>{children}</div>
  )
}
