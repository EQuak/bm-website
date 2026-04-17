import { z } from "zod"

/** Organization settings: in-app notifications only (see Platform → App configuration for the rest). */
export const settingsFormSchema = z.object({
  data: z.object({
    general: z.object({
      globalNotificationEnable: z.boolean()
    })
  })
})

export type SettingsFormType = z.infer<typeof settingsFormSchema>

export const settingsFormInitialValues: SettingsFormType = {
  data: {
    general: {
      globalNotificationEnable: true
    }
  }
}
