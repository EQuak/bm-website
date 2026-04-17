import { profilesSchema } from "@repo/db/schema"
import { z } from "zod/v4"

/**
 * Minimal invite form: email + name + role. Supabase sends the invite email;
 * the API creates the `profiles` row for this organization (no separate invites table).
 */
export const userInviteFormSchema = z.object({
  states: z.object({
    loading: z.boolean(),
    emailError: z.string().nullable().optional()
  }),
  data: z.object({
    email: z.string().email("A valid email is required"),
    firstName: profilesSchema.insert.shape.firstName,
    lastName: profilesSchema.insert.shape.lastName,
    phone: z.string(),
    aclRole: profilesSchema.insert.shape.aclRole
  })
})

export type UserInviteFormSchemaType = z.infer<typeof userInviteFormSchema>

export const userInviteFormInitialValues: UserInviteFormSchemaType = {
  states: {
    loading: false,
    emailError: null
  },
  data: {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    aclRole: "user"
  }
}
