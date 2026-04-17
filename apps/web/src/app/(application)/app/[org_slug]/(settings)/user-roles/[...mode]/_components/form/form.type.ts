import type { RouterOutputs } from "@repo/api"
import { Modules } from "@repo/db/acl"
import { aclsRolesPermissionsSchema, aclsRolesSchema } from "@repo/db/schema"
import { z } from "zod/v4"

const DEFAULT_PERMISSIONS = {
  actions: { view: false, add: false, edit: false }
}

const BASE_MODULES = Object.values(Modules).map((module) => ({
  moduleKey: module.moduleKey,
  title: module.title,
  parentModuleKey: module.parentModuleKey,
  permissions: { ...DEFAULT_PERMISSIONS }
}))

// Base schemas
export const userRoleFormSchema = z.object({
  states: z.object({
    loading: z.boolean()
  }),
  data: z.object({
    role: aclsRolesSchema.select.omit({
      id: true,
      createdAt: true,
      updatedAt: true
    }),
    permissions: z.array(
      aclsRolesPermissionsSchema.select.omit({
        createdAt: true,
        updatedAt: true
      })
    )
  })
})

// Validation schemas
export const userRoleFormSchemaValidationCreate = userRoleFormSchema.extend({
  data: z.object({
    role: aclsRolesSchema.insert,
    permissions: z.array(aclsRolesPermissionsSchema.insert)
  })
})

export const userRoleFormSchemaValidationEdit = userRoleFormSchema.extend({
  data: z.object({
    role: aclsRolesSchema.update,
    permissions: z.array(aclsRolesPermissionsSchema.update)
  })
})

// Type definitions
export type UserRoleFormSchemaType = z.infer<typeof userRoleFormSchema> & {
  states: {
    loading: boolean
    userRole?: NonNullable<RouterOutputs["aclsRoles"]["getAclsRoleBySlug"]>
    permissions?: NonNullable<
      RouterOutputs["aclsRoles"]["getAclsRolesPermissions"]
    >
  }
}

// Initial values
export const userRoleFormInitialValues = {
  states: {
    loading: false
  },
  data: {
    role: {
      isVisible: true,
      name: "",
      slug: ""
    },
    permissions: BASE_MODULES.map((module) => ({
      ...module,
      roleSlug: null
    }))
  }
} satisfies UserRoleFormSchemaType
