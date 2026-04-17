import { profilesSchema } from "@repo/db/schema"
import { z } from "zod/v4"

export const profilePageFormSchema = profilesSchema.select
  .omit({
    userId: true,
    preferences: true,
    organizationId: true
  })
  .extend({
    id: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    inactive: z.boolean().optional(),
    fullName: z.string().optional(),
    email: z.string().optional()
  })

export const profilePageFormSchemaUpdateValidation = profilesSchema.update

export type ProfilePageForm = z.infer<typeof profilePageFormSchema>

export const profilePageFormInitialValues: ProfilePageForm = {
  phone: "",
  firstName: "",
  lastName: "",
  avatar: "",
  email: "",
  aclRole: "",
  aclCustomPermissions: []
}

export type ProfilePageMode = "view" | "security" | "notifications" | undefined
