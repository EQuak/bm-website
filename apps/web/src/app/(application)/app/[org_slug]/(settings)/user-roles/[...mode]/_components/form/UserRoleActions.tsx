import type { Action, ModuleKey } from "@repo/db/acl"
import { Modules } from "@repo/db/acl"
import type { UseFormReturnType } from "@repo/mantine-ui"
import { Checkbox, Stack, Table } from "@repo/mantine-ui"
import React from "react"
import type { UserRoleFormSchemaType } from "./form.type"

type ModuleWithChildren = (typeof Modules)[number] & {
  children: ModuleWithChildren[]
}

const ACTION_COLUMNS: { action: Action; label: string }[] = [
  { action: "view", label: "View/List" },
  { action: "add", label: "Add" },
  { action: "edit", label: "Edit" }
]

const organizeModules = (): ModuleWithChildren[] => {
  const moduleMap = new Map<ModuleKey, ModuleWithChildren>(
    Modules.map((module) => [module.moduleKey, { ...module, children: [] }])
  )

  const rootModules: ModuleWithChildren[] = []
  for (const mod of moduleMap.values()) {
    if (mod.parentModuleKey === null) {
      rootModules.push(mod)
    } else {
      const parent = moduleMap.get(mod.parentModuleKey)
      if (parent) {
        parent.children.push(mod)
      }
    }
  }

  return rootModules
}

function actionEnabled(
  actions: Record<string, boolean> | undefined,
  key: Action
): boolean {
  return actions?.[key] ?? false
}

export default function UserRoleActions({
  form,
  mode
}: {
  form: UseFormReturnType<UserRoleFormSchemaType>
  mode: "create" | "edit" | "view" | "list"
}) {
  const isDisabled = mode === "view"

  const organizedModules = organizeModules()

  const findPermission = (moduleKey: ModuleKey) => {
    return form.values.data.permissions.find((p) => p.moduleKey === moduleKey)
      ?.permissions
  }

  const updatePermission = (
    moduleKey: ModuleKey,
    update: (
      current: (typeof form.values.data.permissions)[number]
    ) => (typeof form.values.data.permissions)[number]
  ) => {
    const permissions = [...form.values.data.permissions]
    const index = permissions.findIndex((p) => p.moduleKey === moduleKey)
    if (index >= 0) {
      const current = permissions[index]
      if (current) {
        permissions[index] = update(current)
        form.setFieldValue("data.permissions", permissions)
      }
    }
  }

  const updateActionPermission = (
    moduleKey: ModuleKey,
    action: Action,
    checked: boolean
  ) => {
    updatePermission(moduleKey, (currentPermission) => {
      const a = currentPermission.permissions.actions
      return {
        ...currentPermission,
        permissions: {
          actions: {
            view: action === "view" ? checked : Boolean(a.view),
            add: action === "add" ? checked : Boolean(a.add),
            edit: action === "edit" ? checked : Boolean(a.edit)
          }
        }
      }
    })
  }

  const renderActionCells = (module: ModuleWithChildren) =>
    ACTION_COLUMNS.map(({ action }) => (
      <Table.Td key={action} style={{ textAlign: "center" }}>
        {module.actions.includes(action) ? (
          <Checkbox
            disabled={isDisabled}
            checked={actionEnabled(
              findPermission(module.moduleKey)?.actions,
              action
            )}
            onChange={(event) =>
              updateActionPermission(
                module.moduleKey,
                action,
                event.currentTarget.checked
              )
            }
            styles={{
              root: { display: "flex", justifyContent: "center" }
            }}
          />
        ) : null}
      </Table.Td>
    ))

  return (
    <Stack>
      <div className="overflow-x-auto">
        <Table>
          <Table.Thead>
            <Table.Tr style={{ backgroundColor: "#f1f5f9" }}>
              <Table.Th style={{ minWidth: 120, width: 120 }}>Title</Table.Th>
              {ACTION_COLUMNS.map(({ action, label }) => (
                <Table.Th
                  key={action}
                  style={{
                    minWidth: 80,
                    width: 80,
                    textAlign: "center"
                  }}
                >
                  {label}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {organizedModules.map((module) => (
              <React.Fragment key={module.moduleKey}>
                <Table.Tr>
                  <Table.Td fw="bold">{module.title}</Table.Td>
                  {renderActionCells(module)}
                </Table.Tr>
                {module.children.map((child) => (
                  <Table.Tr
                    key={child.moduleKey}
                    style={{ backgroundColor: "#f9fafb" }}
                  >
                    <Table.Td pl="xl">{child.title}</Table.Td>
                    {renderActionCells(child)}
                  </Table.Tr>
                ))}
              </React.Fragment>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </Stack>
  )
}
