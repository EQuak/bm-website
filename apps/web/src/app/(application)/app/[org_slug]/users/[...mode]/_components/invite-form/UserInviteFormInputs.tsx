"use client"

import type { UseFormReturnType } from "@repo/mantine-ui"
import { Fieldset, Group, Select, Stack, TextInput } from "@repo/mantine-ui"
import { useRBAC } from "#/core/context/rbac/useRBAC"
import { api } from "#/trpc/react"
import type { UserInviteFormSchemaType } from "./form.types"
import type { useAsyncEmailValidation } from "./hooks/useFormValidation"

type AsyncEmailValidation = ReturnType<typeof useAsyncEmailValidation>

export default function UserInviteFormInputs({
  form,
  asyncEmail
}: {
  form: UseFormReturnType<UserInviteFormSchemaType>
  asyncEmail: AsyncEmailValidation
}) {
  const ability = useRBAC()

  const { emailError, validateEmail, clearEmailError } = asyncEmail

  const canInvite = ability.can("add", "users")
  const [roles] = api.aclsRoles.getAllAclsRoles.useSuspenseQuery()

  const roleOptions = (roles ?? []).map((role) => ({
    value: role.slug,
    label: role.name
  }))

  return (
    <Stack gap="md" py="md">
      <Fieldset legend="Invite user">
        <Stack>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="user@company.com"
            type="email"
            autoComplete="email"
            {...form.getInputProps("data.email")}
            key={form.key("data.email")}
            disabled={!canInvite}
            onBlur={(e) => {
              form.getInputProps("data.email").onBlur?.(e)
              void validateEmail(e.currentTarget.value.trim())
            }}
            onChange={(e) => {
              clearEmailError()
              form.getInputProps("data.email").onChange?.(e)
            }}
            error={form.errors["data.email"] ?? emailError ?? undefined}
          />
          <TextInput
            label="Phone"
            placeholder="+1 …"
            type="tel"
            autoComplete="tel"
            {...form.getInputProps("data.phone")}
            key={form.key("data.phone")}
            disabled={!canInvite}
          />
          <Group grow>
            <TextInput
              withAsterisk
              label="First name"
              placeholder="John"
              {...form.getInputProps("data.firstName")}
              key={form.key("data.firstName")}
              disabled={!canInvite}
            />
            <TextInput
              withAsterisk
              label="Last name"
              placeholder="Doe"
              {...form.getInputProps("data.lastName")}
              key={form.key("data.lastName")}
              disabled={!canInvite}
            />
          </Group>
          <Select
            withAsterisk
            label="Role"
            placeholder="Select a role"
            data={roleOptions}
            {...form.getInputProps("data.aclRole")}
            key={form.key("data.aclRole")}
            disabled={!canInvite}
          />
        </Stack>
      </Fieldset>
    </Stack>
  )
}
