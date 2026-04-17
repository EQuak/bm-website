"use client"

import {
  Button,
  Center,
  mtnZodResolver,
  PinInput,
  Stack,
  Text,
  Title,
  useForm
} from "@repo/mantine-ui"
import { IconLogin2 } from "@repo/mantine-ui/icons/index"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { z } from "zod/v4"
import { DEFAULT_LANDING_PATH } from "#/core/config/routes"
import { createClient } from "#/utils/supabase/client"
import { LogoIcon } from "../../../assets/icons"
import Layout from "../_components/Layout"

export default function OneTimeCodeLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const credential = searchParams.get("credential") ?? ""
  const token = searchParams.get("token") ?? ""
  const next = searchParams.get("next") ?? DEFAULT_LANDING_PATH

  const schema = z.object({
    oneTimeCode: z.string().min(6, "One-time code is required"),
    credential: z.email("Invalid email")
  })
  const form = useForm({
    initialValues: {
      credential: credential,
      oneTimeCode: token
    } as { credential: string; oneTimeCode: string },
    mode: "controlled",
    validate: mtnZodResolver(schema)
  })

  const handleOneTimeCodeLogin = async (values: typeof form.values) => {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: values.credential,
        token: values.oneTimeCode,
        type: "email"
      })
      if (error) {
        form.setFieldError("oneTimeCode", error.message)
        console.error(error)
      } else {
        router.push(next ?? DEFAULT_LANDING_PATH)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
        form.setFieldError("oneTimeCode", error.message)
      }
    }
  }

  useEffect(() => {
    if (credential) {
      form.initialize({
        credential: credential,
        oneTimeCode: token
      })
    }
  }, [credential, token])

  useEffect(() => {
    if (form.values.oneTimeCode.length === 6) {
      handleOneTimeCodeLogin(form.values)
    }
  }, [form.values.oneTimeCode])

  useEffect(() => {
    const data = schema.safeParse(form.values)
    if (data.success) {
      form.setSubmitting(true)
      handleOneTimeCodeLogin(data.data)
    }
  }, [form.values])

  return (
    <Layout>
      <form onSubmit={form.onSubmit(handleOneTimeCodeLogin)}>
        <Stack gap={"xl"}>
          <Center>
            <LogoIcon width={220} />
          </Center>
          <Stack gap={"xs"}>
            <Title order={3} ta={"center"}>
              One-time Code Login
            </Title>
            <Text ta={"center"}>Enter your one-time code to login.</Text>
          </Stack>
          <Stack gap={"sm"}>
            <Stack gap={"4px"} align="center" justify="center">
              <PinInput
                length={6}
                type="number"
                oneTimeCode
                {...form.getInputProps("oneTimeCode")}
              />
            </Stack>
            <Button
              rightSection={<IconLogin2 size={22} stroke={1.5} />}
              type="submit"
              loading={form.submitting}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </form>
    </Layout>
  )
}
