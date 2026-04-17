"use no memo"

import { ActionIcon, Menu } from "@mantine/core"
import { IconEye, IconEyeOff, IconSettings2 } from "@tabler/icons-react"
import type { Column } from "@tanstack/react-table"
import { useDataTableContext } from "./context"

export function ColumnToggle() {
  const { table } = useDataTableContext<object>()
  if (!table) return null

  // Acessar o estado de visibilidade - isso força re-render quando mudar
  // Criar uma string do estado para garantir que mudanças sejam detectadas
  const columnVisibility = table.getState().columnVisibility
  const visibilityState = JSON.stringify(columnVisibility)

  const allColumns = table
    .getAllColumns()
    .filter((c: Column<object, unknown>) => c.getCanHide())
  if (!allColumns.length) return null

  return (
    <Menu
      position="bottom-end"
      withArrow
      shadow="md"
      arrowOffset={10}
      arrowSize={8}
      classNames={{
        dropdown: "!border-mtn-primary-3 border",
        arrow: "!border-mtn-primary-3 !bg-mtn-primary-3 border"
      }}
      key={visibilityState}
    >
      <Menu.Target>
        <ActionIcon size={"input-xs"} variant="outline">
          <IconSettings2 className="size-4" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {allColumns.map((column: Column<object, unknown>) => {
          // Usar getIsVisible() do React Table - método oficial e confiável
          // Isso garante que a visibilidade está sempre sincronizada com o estado real
          const isVisible = column.getIsVisible()
          return (
            <Menu.Item
              key={`${column.id}-${isVisible}`}
              onClick={() => column.toggleVisibility()}
              fz="xs"
              c={isVisible ? "gray.7" : "gray.4"}
              rightSection={
                isVisible ? (
                  <IconEye size={14} className="text-mtn-gray-7" />
                ) : (
                  <IconEyeOff size={14} className="text-mtn-gray-3" />
                )
              }
            >
              {column.columnDef.header as string}
            </Menu.Item>
          )
        })}
      </Menu.Dropdown>
    </Menu>
  )
}
