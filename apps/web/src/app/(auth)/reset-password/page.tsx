"use client"

import {
  Button,
  Center,
  mtnZodResolver,
  PasswordInput,
  Stack,
  Text,
  Title,
  useDisclosure,
  useForm
} from "@repo/mantine-ui"
import { PasswordMeter } from "@repo/mantine-ui/components"
import {
  IconArrowLeft,
  IconLock,
  IconLogin2
} from "@repo/mantine-ui/icons/index"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod/v4"
import { LogoIcon } from "../../../assets/icons"
import Layout from "../_components/Layout"
import RedirectCard from "../_components/RedirectCard"
import { authActions } from "../_funcs"

const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[\w$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    "Invalid password"
  )

const changePasswordSchema = z
  .object({
    repeatPassword: passwordSchema.min(1, "New Password is required"),
    newPassword: passwordSchema.min(1, "New Password is required")
  })
  .refine((data) => data.repeatPassword === data.newPassword, {
    path: ["repeatPassword"],
    message: "Passwords do not match"
  })

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [revealPassword, { toggle: onVisibilityChange }] = useDisclosure(false)

  const resetPasswordForm = useForm({
    initialValues: {
      newPassword: "",
      repeatPassword: ""
    },
    mode: "controlled",
    validate: mtnZodResolver(changePasswordSchema),
    enhanceGetInputProps: () => ({
      disabled: loading
    })
  })

  const handleResetPassword = async (
    values: z.infer<typeof changePasswordSchema>
  ) => {
    try {
      setLoading(true)
      await authActions.resetPassword({
        password: values.newPassword
      })
      router.push(`?${new URLSearchParams({ status: "success" }).toString()}`)
    } catch (error) {
      if (error instanceof Error) {
        resetPasswordForm.setFieldError("password", error.message)
      }
    } finally {
      setLoading(false)
    }
  }
  const status = searchParams.get("status")

  if (status === "success") {
    return (
      <RedirectCard
        title="Success"
        description="You have successfully changed your password"
        href="/login"
        buttonText="Go to Home Page"
        buttonIcon={<IconArrowLeft />}
      />
    )
  }

  return (
    <Layout>
      <form onSubmit={resetPasswordForm.onSubmit(handleResetPassword)}>
        <Stack gap={"xl"}>
          <Center>
            <LogoIcon width={220} />
          </Center>
          <Stack gap={"xs"}>
            <Title order={3} ta={"center"}>
              Reset password
            </Title>
            <Text ta={"center"}>
              Fill in the fields below to reset your password.
            </Text>
          </Stack>
          <Stack gap={"sm"}>
            <Stack gap={"4px"}>
              <PasswordMeter
                {...resetPasswordForm.getInputProps("newPassword")}
                key={resetPasswordForm.key("newPassword")}
                label="New password"
                placeholder="New password"
                leftSection={<IconLock />}
                visible={revealPassword}
                requirements={{
                  lower: true,
                  upper: true,
                  number: true,
                  symbol: true,
                  length: 8
                }}
                onVisibilityChange={onVisibilityChange}
              />
              <PasswordInput
                label="Repeat Password"
                placeholder="Repeat Password"
                visible={revealPassword}
                onVisibilityChange={onVisibilityChange}
                leftSection={<IconLock />}
                onFocus={(e) => e.target.select()}
                key={resetPasswordForm.key("repeatPassword")}
                {...resetPasswordForm.getInputProps("repeatPassword")}
              />
            </Stack>
          </Stack>

          <Button
            rightSection={<IconLogin2 size={22} stroke={1.5} />}
            type="submit"
            loading={loading}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Layout>
  )
}
