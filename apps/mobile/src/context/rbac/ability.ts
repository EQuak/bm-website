import { createAliasResolver, defineAbility } from "@casl/ability"

import type { Action, ModuleKey } from "@repo/db/acl"

const resolveAction = createAliasResolver({
  edit: ["update", "delete"],
  add: ["create"],
  view: ["read"]
})

export const userAbility = ({
  aclRole,
  isPlatformStaff = false
}: {
  isPlatformStaff?: boolean
  aclRole: {
    roleSlug: string
    permissions: {
      permissions: {
        actions: Partial<Record<Action, boolean>>
      }
      moduleKey: ModuleKey
    }[]
  }
  aclCustomPermissions?: {
    moduleKey: ModuleKey
    actions: Partial<Record<Action, boolean>>
  }[]
}) => {
  const ability = defineAbility(
    (can) => {
      if (isPlatformStaff || aclRole.roleSlug === "developer") {
        can("manage", "all")
      } else if (aclRole.permissions.length) {
        // Regular role based permissions
        aclRole.permissions.forEach(({ permissions, moduleKey }) => {
          const { actions } = permissions
          if (actions.view) can("view", moduleKey)
          if (actions.add) can("add", moduleKey)
          if (actions.edit) can("edit", moduleKey)
        })
      }

      can("view", "dashboard")
      can("view", "settings")
      can("view", "settings-profile")
    },
    { resolveAction }
  )
  return ability
}
