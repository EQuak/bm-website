import { z } from "zod/v4"

// Define module keys
const moduleKeys = [
  "dashboard",
  "users",
  "settings",
  "settings-user-roles"
] as const
export const moduleOptions = z.enum(moduleKeys)
export type ModuleKey = z.infer<typeof moduleOptions>

export type ExtraPermission = {
  name: string
  value: string
}

export type Module = {
  moduleKey: ModuleKey
  title: string
  parentModuleKey: ModuleKey | null
  actions: Action[]
}

export const Modules: Module[] = [
  {
    moduleKey: "dashboard",
    title: "Dashboard",
    parentModuleKey: null,
    actions: ["view"]
  },
  {
    moduleKey: "users",
    title: "Users",
    parentModuleKey: null,
    actions: ["view", "add", "edit"]
  },
  {
    moduleKey: "settings",
    title: "Settings",
    parentModuleKey: null,
    actions: ["view"]
  },
  {
    moduleKey: "settings-user-roles",
    title: "User roles",
    parentModuleKey: "settings",
    actions: ["view", "add", "edit"]
  }
]

// Define the action types
const actions = ["view", "add", "edit"] as const
export const actionSchema = z.enum(actions)
export type Action = z.infer<typeof actionSchema>

// Define the permission structure
export const permissionSchema = z.object({
  actions: z.record(actionSchema, z.boolean()).or(z.object()).default({})
})

export type Permission = z.infer<typeof permissionSchema>

export const test_rbac_schema = z.object({
  roleSlug: z.string(),
  permissions: z
    .array(
      z.object({
        permission: moduleOptions,
        actions: actionSchema.array()
      })
    )
    .optional()
    .default([])
})

export type RBAC = z.infer<typeof test_rbac_schema>

export const app_preferences = z
  .object({
    theme: z.object({
      colorSchema: z.enum(["light", "dark", "system"]).nullable()
    }),
    app: z.object({
      accent_color: z.string().nullable(),
      beta_features: z.boolean().default(false)
    })
  })
  .nullish()
  .default({
    theme: {
      colorSchema: "system"
    },
    app: {
      beta_features: false,
      accent_color: null
    }
  })

export type AppPreferences = z.infer<typeof app_preferences>
