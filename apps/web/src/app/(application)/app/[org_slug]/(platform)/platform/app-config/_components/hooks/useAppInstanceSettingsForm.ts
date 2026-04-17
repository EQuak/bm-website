import { useForm } from "@tanstack/react-form"
import { useEffect } from "react"
import { api } from "#/trpc/react"
import { appInstanceFormInitialValues } from "../appInstanceForm.types"

export function useAppInstanceSettingsForm() {
  const [settings] = api.platform.appInstanceSettings.get.useSuspenseQuery()

  const form = useForm({
    defaultValues: appInstanceFormInitialValues,
    onSubmit: async () => {
      // Individual controls persist via mutations
    }
  })

  useEffect(() => {
    if (!settings) return

    form.setFieldValue(
      "data.operations.maintenanceMode",
      settings.maintenanceMode ?? false
    )
    form.setFieldValue(
      "data.operations.secureMode",
      settings.secureMode ?? false
    )
    form.setFieldValue(
      "data.operations.emailNotificationEnable",
      settings.emailNotificationEnable ?? true
    )
    form.setFieldValue(
      "data.email.resendEnabled",
      Boolean(settings.resendEnabled)
    )
    form.setFieldValue(
      "data.email.resendFromEmail",
      settings.resendFromEmail || ""
    )
    form.setFieldValue("data.email.resendDomain", settings.resendDomain || "")
    form.setFieldValue(
      "data.email.resendSmtpHost",
      settings.resendSmtpHost || ""
    )
    form.setFieldValue(
      "data.email.resendSmtpPort",
      settings.resendSmtpPort ?? undefined
    )
    form.setFieldValue(
      "data.email.resendSmtpUser",
      settings.resendSmtpUser || ""
    )
    form.setFieldValue("data.email.resendSmtpPass", "")
    form.setFieldValue(
      "data.email.resendRateLimit",
      settings.resendRateLimit ?? settings.rateLimit ?? 2
    )
    form.setFieldValue("data.email.resendApiKey", "")
  }, [settings])

  return { form, settings }
}

export type AppInstanceSettingsFormApi = ReturnType<
  typeof useAppInstanceSettingsForm
>["form"]
