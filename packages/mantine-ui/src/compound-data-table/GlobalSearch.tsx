"use no memo"

import { TextInput } from "@mantine/core"
import { useEffect, useState } from "react"
import { cn } from "../utils/cn"
import { useDataTableContext } from "./context"

export function GlobalSearch({
  className,
  placeholder = "Search..."
}: {
  className?: string
  placeholder?: string
}) {
  const { table } = useDataTableContext<object>()
  const [value, setValue] = useState<string>(() => {
    return (table.getState().globalFilter as string) ?? ""
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(value)
    }, 300)
    return () => clearTimeout(timeout)
  }, [value, table])

  return (
    <TextInput
      placeholder={placeholder}
      size="xs"
      className={cn("w-full max-w-[180px] md:max-w-[220px]", className)}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
