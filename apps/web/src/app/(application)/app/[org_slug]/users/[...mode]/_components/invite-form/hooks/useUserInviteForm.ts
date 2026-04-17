"use client"

import { mtnZodResolver, notifications, useForm } from "@repo/mantine-ui"
import { useWorkspaceRouter } from "#/hooks/useWorkspaceRouter"
import { api } from "#/trpc/react"
import { getBaseUrl } from "#/utils/urls"
import {
  type UserInviteFormSchemaType,
  userInviteFormInitialValues,
  userInviteFormSchema
} from "../form.types"
import { useAsyncEmailValidation } from "./useFormValidation"

export function useUserInviteForm(organizationId: string) {
  const router = useWorkspaceRouter()
  const utils = api.useUtils()
  const inviteUser = api.profiles.inviteUser.useMutation()

  const asyncEmail = useAsyncEmailValidation(utils, organizationId)

  const form = useForm<UserInviteFormSchemaType>({
    mode: "uncontrolled",
    initialValues: userInviteFormInitialValues,
    validate: mtnZodResolver(userInviteFormSchema)
  })

  const onSubmit = form.onSubmit(async (values) => {
    if (asyncEmail.emailError) {
      form.setFieldValue("states.emailError", asyncEmail.emailError)
      notifications.show({
        title: "Email unavailable",
        message: asyncEmail.emailError,
        color: "red"
      })
      return
    }

    const email = values.data.email.trim().toLowerCase()
    const check = await utils.profiles.checkEmailExists.fetch({
      email,
      organizationId
    })
    if (check.exists) {
      const msg = check.employeeName
        ? `This email is already registered to ${check.employeeName}`
        : "This email is already registered in this organization."
      form.setFieldValue("states.emailError", msg)
      notifications.show({ title: "Cannot invite", message: msg, color: "red" })
      return
    }

    form.setFieldValue("states.emailError", null)
    form.setFieldValue("states.loading", true)

    try {
      const appUrl = getBaseUrl()
      const phone = values.data.phone?.trim() ?? ""

      await inviteUser.mutateAsync({
        organizationId,
        appUrl,
        email,
        firstName: values.data.firstName.trim(),
        lastName: values.data.lastName.trim(),
        phone: phone.length > 0 ? phone : undefined,
        aclRole: values.data.aclRole ?? ""
      })

      await utils.profiles.getAllProfiles.invalidate({ organizationId })

      notifications.show({
        title: "Invite sent",
        message: `An invitation email was sent to ${email}.`,
        color: "green"
      })

      form.reset()
      router.workspacePush("/users/list")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send invitation."
      notifications.show({
        title: "Invite failed",
        message,
        color: "red"
      })
    } finally {
      form.setFieldValue("states.loading", false)
    }
  })

  return {
    form,
    asyncEmail,
    isLoading: form.getValues().states.loading || inviteUser.isPending || false,
    onSubmit
  }
}
