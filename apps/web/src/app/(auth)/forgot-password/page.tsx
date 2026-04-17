"use client"

import {
  Button,
  Center,
  mtnZodResolver,
  Stack,
  Text,
  TextInput,
  Title,
  useForm
} from "@repo/mantine-ui"
import {
  IconArrowLeft,
  IconLogin2,
  IconMail
} from "@repo/mantine-ui/icons/index"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod/v4"

import { api } from "#/trpc/react"
import { getBaseUrl } from "#/utils/urls"
import { LogoIcon } from "../../../assets/icons"
import Layout from "../_components/Layout"
import RedirectCard from "../_components/RedirectCard"

const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Enter a valid email address"
  })
})

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const forgotPassword = api.auth.forgotPassword.useMutation()

  const forgotPasswordForm = useForm({
    initialValues: {
      email: ""
    },
    mode: "controlled",
    validate: mtnZodResolver(forgotPasswordSchema),
    enhanceGetInputProps: () => ({
      disabled: loading
    })
  })

  const handleForgotPassword = async (
    values: z.infer<typeof forgotPasswordSchema>
  ) => {
    try {
      setLoading(true)

      const redirectTo = getBaseUrl() + "/auth/confirm?next=/reset-password"

      await forgotPassword.mutateAsync({
        email: values.email.trim(),
        redirectTo
      })
      router.push(`?${new URLSearchParams({ status: "success" }).toString()}`)
    } catch {
      // Supabase does not reveal whether the email exists; generic handling only
    } finally {
      setLoading(false)
    }
  }
  const status = searchParams.get("status")

  if (status === "success") {
    return (
      <RedirectCard
        title="Success"
        description="You will receive an email with your password shortly"
        subDescription="If you do not receive an email, please contact support."
        href="/login"
        buttonText="Back to Login"
        buttonIcon={<IconArrowLeft />}
      />
    )
  }

  return (
    <Layout>
      <form onSubmit={forgotPasswordForm.onSubmit(handleForgotPassword)}>
        <Stack gap={"xl"}>
          <Center>
            <LogoIcon width={220} />
          </Center>
          <Stack gap={"xs"}>
            <Title order={3} ta={"center"}>
              Forgot Password?
            </Title>
            <Text ta={"center"}>
              Enter your email below to request an account password reset.
            </Text>
          </Stack>
          <Stack gap={"sm"}>
            <TextInput
              withAsterisk
              classNames={{
                label: "flex w-fit flex-row justify-between gap-0.5"
              }}
              label={
                <Text pb={"4px"} fz={"sm"} fw={700}>
                  Email
                </Text>
              }
              placeholder="you@example.com"
              leftSection={<IconMail size={20} stroke={1.5} />}
              {...forgotPasswordForm.getInputProps("email")}
            />
            <Button
              rightSection={<IconLogin2 size={22} stroke={1.5} />}
              type="submit"
              loading={loading}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </form>
    </Layout>
  )
}
