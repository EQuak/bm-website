"use client"

import {
  Alert,
  Button,
  Group,
  mtnZodResolver,
  notifications,
  PasswordInput,
  Stack,
  Tabs,
  useForm
} from "@repo/mantine-ui"
import { PasswordMeter } from "@repo/mantine-ui/components/password-meter"
import { IconLock, IconReplace } from "@repo/mantine-ui/icons/index"
import { useState } from "react"
import { z } from "zod/v4"
import { api } from "#/trpc/react"
import type { ProfilePageMode } from "../profile-view-tab/profilePage.type"

type SecurityForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{8,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long"
  )

const validationSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: passwordSchema.min(8, "Must be at least 8 characters"),
    confirmPassword: passwordSchema.min(8, "Must be at least 8 characters")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

export function SecurityTab({
  value
}: {
  value: NonNullable<ProfilePageMode>
}) {
  const [revealPassword, setRevealPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useForm<SecurityForm>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validate: mtnZodResolver(validationSchema),
    enhanceGetInputProps: () => ({
      readOnly: loading
    })
  })

  const updateUserPassword = api.auth.updateUserPassword.useMutation()

  const onVisibilityChange = () => {
    setRevealPassword((prev) => !prev)
  }

  const handleSubmit = async (values: SecurityForm) => {
    try {
      setLoading(true)
      const parsedValues = validationSchema.safeParse(values)
      if (!parsedValues.success) {
        throw new Error(parsedValues.error.message)
      }
      await updateUserPassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })

      notifications.show({
        title: "Password updated",
        message: "Your password has been updated",
        color: "teal"
      })

      form.reset()
    } catch (error) {
      if (error instanceof Error) {
        form.setFieldError("currentPassword", error.message)
        notifications.show({
          title: "Error",
          message: error.message,
          color: "red"
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs.Panel value={value}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack align="flex-start">
          <Alert
            color="orange"
            title="Warning"
            className="w-[25rem] max-md:w-full"
          >
            Changing your password WILL NOT log you out. If you need to force
            logged out from all devices, contact support.
          </Alert>
          <PasswordInput
            className="w-[25rem] max-md:w-full"
            {...form.getInputProps("currentPassword")}
            leftSection={<IconLock size={18} />}
            label="Current Password"
            placeholder="Current Password"
          />
          <Stack gap={0} align="flex-start" w={"100%"}>
            <Group className="w-[25rem] max-md:w-full" align="stretch">
              <PasswordMeter
                {...form.getInputProps("newPassword")}
                className="w-[25rem] max-md:w-full"
                label="New Password"
                placeholder="New Password"
                leftSection={<IconLock size={18} />}
                visible={revealPassword}
                requirements={{
                  lower: true,
                  upper: true,
                  number: true,
                  length: 8
                }}
                onVisibilityChange={onVisibilityChange}
              />
            </Group>
            <PasswordInput
              className="w-[25rem] max-md:w-full"
              label="Confirm New Password"
              placeholder="Confirm New Password"
              visible={revealPassword}
              onVisibilityChange={onVisibilityChange}
              leftSection={<IconLock size={18} />}
              onFocus={(e) => e.target.select()}
              {...form.getInputProps("confirmPassword")}
            />
          </Stack>
          <Button
            type="submit"
            loading={loading}
            rightSection={<IconReplace size={18} />}
          >
            Change Password
          </Button>
        </Stack>
      </form>
    </Tabs.Panel>
  )
}
