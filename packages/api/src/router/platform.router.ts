import { systemSettingsSchema } from "@repo/db/schema"
import { z } from "zod/v4"
import { listAllOrganizationsForPlatform } from "../funcs/organizations.funcs"
import {
  getAllProfilesAlphabeticallyForPlatform,
  getMasterUserListForPlatform
} from "../funcs/profiles.funcs"
import {
  getSystemSettings,
  updateSystemSettings
} from "../funcs/system/system_settings.funcs"
import {
  createTRPCRouter,
  platformProcedure,
  protectedProcedure
} from "../trpc"
import { isEffectivePlatformStaff } from "../utils/platform-staff"

const handleError = (functionName: string, error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error(
    `Error in ${functionName}: ` + JSON.stringify(errorMessage, null, 2)
  )
  throw error
}

export const platformRouter = createTRPCRouter({
  /** For layouts and nav: whether the auth user may use platform-only tools. */
  getAccess: protectedProcedure.query(({ ctx }) => {
    return {
      isPlatformStaff: isEffectivePlatformStaff(ctx),
      userId: ctx.user.id
    }
  }),

  /**
   * Cross-tenant profile list for impersonation UI (name + org).
   * @protectedPlatform
   */
  profilesForImpersonationPicker: platformProcedure.query(async ({ ctx }) => {
    try {
      return await getAllProfilesAlphabeticallyForPlatform(ctx.db)
    } catch (error) {
      return handleError("profilesForImpersonationPicker", error)
    }
  }),

  listOrganizations: platformProcedure.query(async ({ ctx }) => {
    try {
      return await listAllOrganizationsForPlatform(ctx.db)
    } catch (error) {
      return handleError("listOrganizations", error)
    }
  }),

  listMasterUsers: platformProcedure.query(async ({ ctx }) => {
    try {
      return await getMasterUserListForPlatform(ctx.db)
    } catch (error) {
      return handleError("listMasterUsers", error)
    }
  }),

  /**
   * App-instance config: maintenance, secure mode, email provider, etc.
   * Backed by `system_settings` for the default organization row.
   */
  appInstanceSettings: createTRPCRouter({
    get: platformProcedure.query(async ({ ctx }) => {
      try {
        return await getSystemSettings(ctx.db)
      } catch (error) {
        return handleError("appInstanceSettings.get", error)
      }
    }),
    update: platformProcedure
      .input(
        systemSettingsSchema.update.extend({
          clearApiKey: z.boolean().optional()
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          return await updateSystemSettings(ctx.db, input)
        } catch (error) {
          return handleError("appInstanceSettings.update", error)
        }
      })
  })
})
