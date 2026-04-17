import { z } from "zod"

export const appInstanceFormSchema = z.object({
  data: z.object({
    operations: z.object({
      maintenanceMode: z.boolean(),
      secureMode: z.boolean(),
      emailNotificationEnable: z.boolean()
    }),
    email: z.object({
      resendEnabled: z.boolean(),
      resendFromEmail: z.string().email().or(z.literal("")),
      resendDomain: z.string(),
      resendSmtpHost: z.string(),
      resendSmtpPort: z.number().min(1).max(65535).optional(),
      resendSmtpUser: z.string(),
      resendSmtpPass: z.string(),
      resendRateLimit: z.number().min(1).max(20),
      resendApiKey: z.string().optional()
    })
  })
})

export type AppInstanceFormType = z.infer<typeof appInstanceFormSchema>

export const appInstanceFormInitialValues: AppInstanceFormType = {
  data: {
    operations: {
      maintenanceMode: false,
      secureMode: false,
      emailNotificationEnable: true
    },
    email: {
      resendEnabled: false,
      resendFromEmail: "",
      resendDomain: "",
      resendSmtpHost: "",
      resendSmtpPort: undefined,
      resendSmtpUser: "",
      resendSmtpPass: "",
      resendRateLimit: 2,
      resendApiKey: ""
    }
  }
}
