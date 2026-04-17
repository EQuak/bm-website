import { z } from "zod/v4"
import {
  getOrgGeneralSettings,
  updateOrgGeneralSettings
} from "../../funcs/system/system_settings.funcs"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import { handleError } from "../../utils/handleError"

const orgGeneralSettingsUpdateSchema = z.object({
  globalNotificationEnable: z.boolean()
})

export const systemSettingsRouter = createTRPCRouter({
  /** Organization-facing: in-app notification toggle only. */
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getOrgGeneralSettings(ctx.db)
    } catch (error) {
      handleError("systemSettings.get", error)
      return null
    }
  }),
  update: protectedProcedure
    .input(orgGeneralSettingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await updateOrgGeneralSettings(ctx.db, input)
      } catch (error) {
        handleError("systemSettings.update", error)
        throw error
      }
    })
})
