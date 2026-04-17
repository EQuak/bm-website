"use client"

import {
  Alert,
  Anchor,
  Button,
  Flex,
  mtnZodResolver,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  useForm
} from "@repo/mantine-ui"
import { IconLock, IconLogin2, IconMail } from "@repo/mantine-ui/icons/index"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { z } from "zod/v4"

import { DEFAULT_LANDING_PATH } from "#/core/config/routes"
import { LogoIcon } from "../../../assets/icons"
import Layout from "../_components/Layout"
import { authActions } from "../_funcs"

const loginSchema = z.object({
  credential: z
    .string()
    .min(1, { message: "Email is required" })
    .trim()
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Enter a valid email address"
    }),
  password: z.string().min(1, { message: "Password is required" })
})

const linkClassName =
  "text-mtn-dark-6 text-sm font-medium no-underline hover:text-mtn-dark-8 hover:underline"

const inputClassNames = {
  input: "h-10 rounded-lg",
  label: "pb-0.5 text-sm font-semibold"
} as const

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email")
  const errorParam = searchParams.get("error")
  const noProfileError = errorParam === "no_profile"
  const signInError = Boolean(errorParam && !noProfileError)
  const passwordRef = useRef<HTMLInputElement>(null)

  const loginForm = useForm({
    initialValues: {
      credential: "",
      password: ""
    },
    mode: "controlled",
    validate: mtnZodResolver(loginSchema),
    enhanceGetInputProps: () => ({
      disabled: loading
    })
  })

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true)
    const { error } = await authActions.login({ ...values })
    if (error) {
      setLoading(false)
      if (
        error === "Invalid login credentials" ||
        error === "Wrong credentials"
      ) {
        loginForm.setFieldError(
          "credential",
          "Wrong credentials, check your email and password and try again"
        )
      } else if (
        error === "Email is required" ||
        error === "Enter a valid email address"
      ) {
        loginForm.setFieldError("credential", error)
      } else {
        loginForm.setFieldError(
          "credential",
          "Something went wrong, contact support"
        )
      }
    } else {
      router.replace(DEFAULT_LANDING_PATH)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (emailParam) {
      loginForm.initialize({
        credential: emailParam,
        password: ""
      })
      passwordRef.current?.focus()
    }
  }, [emailParam])

  return (
    <Layout>
      <Stack gap="md">
        <div className="-mx-1 w-[calc(100%+0.5rem)] max-w-none overflow-x-auto overflow-y-visible px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <LogoIcon width={400} />
        </div>

        <Stack gap={4} align="center">
          <Title order={2} fz="1.25rem" fw={700} ta="center" lh={1.2}>
            Welcome back
          </Title>
          <Text fz="sm" c="dimmed" ta="center" maw={320} lh={1.45}>
            Sign in with your email and password.
          </Text>
        </Stack>

        {noProfileError ? (
          <Alert
            color="orange"
            variant="light"
            radius="md"
            py="xs"
            title="Profile not found"
          >
            Your account is signed in but has no profile in the system. Contact
            an administrator, or sign out and use a different account.
          </Alert>
        ) : null}

        {signInError ? (
          <Alert
            color="red"
            variant="light"
            radius="md"
            py="xs"
            title="Sign-in failed"
          >
            Try again or use your email and password below.
          </Alert>
        ) : null}

        <form
          onSubmit={loginForm.onSubmit(handleLogin)}
          autoComplete="new-password"
        >
          <Stack gap="sm">
            <Stack gap={6}>
              <TextInput
                withAsterisk
                variant="filled"
                size="sm"
                classNames={inputClassNames}
                label="Email"
                placeholder="you@company.com"
                leftSection={<IconMail size={18} stroke={1.5} />}
                {...loginForm.getInputProps("credential")}
                autoComplete="email"
              />
            </Stack>

            <Stack gap={6}>
              <PasswordInput
                ref={passwordRef}
                withAsterisk
                variant="filled"
                size="sm"
                classNames={{
                  ...inputClassNames,
                  innerInput: "rounded-lg"
                }}
                label="Password"
                placeholder="Password"
                leftSection={<IconLock size={18} stroke={1.5} />}
                {...loginForm.getInputProps("password")}
                autoComplete="current-password"
              />
              <Flex justify="flex-end">
                <Anchor
                  className={linkClassName}
                  component={Link}
                  href="/forgot-password"
                >
                  Forgot password?
                </Anchor>
              </Flex>
            </Stack>

            <Button
              type="submit"
              fullWidth
              size="sm"
              radius="md"
              fw={600}
              mt={4}
              rightSection={<IconLogin2 size={20} stroke={1.5} />}
              variant="filled"
              color="dark"
              loading={loading}
            >
              Log in
            </Button>
          </Stack>
        </form>

        <Text ta="center" fz="sm" c="dimmed" pt={2}>
          Don&apos;t have an account?{" "}
          <Anchor component={Link} href="/sign-up" className={linkClassName}>
            Sign up
          </Anchor>
        </Text>
      </Stack>
    </Layout>
  )
}
