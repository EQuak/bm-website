import { useForm } from "@tanstack/react-form"
import { useEffect } from "react"
import { api } from "#/trpc/react"
import { settingsFormInitialValues } from "../form.types"

export function useSettingsForm() {
  const { data: settings } = api.system.settings.get.useQuery()

  const form = useForm({
    defaultValues: settingsFormInitialValues,
    onSubmit: async () => {
      // Toggles persist immediately via mutations
    }
  })

  useEffect(() => {
    if (!settings) return

    form.setFieldValue(
      "data.general.globalNotificationEnable",
      settings.globalNotificationEnable ?? true
    )
  }, [settings])

  return { form, settings }
}

export type SettingsFormApi = ReturnType<typeof useSettingsForm>["form"]
