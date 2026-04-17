"use client"

import {
  Anchor,
  Button,
  Group,
  mtnZodResolver,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  useForm
} from "@repo/mantine-ui"
import {
  IconBuilding,
  IconCheck,
  IconLock,
  IconUser,
  IconUserPlus,
  IconX
} from "@repo/mantine-ui/icons/index"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod/v4"

import { DEFAULT_LANDING_PATH } from "#/core/config/routes"
import { LogoIcon } from "../../../assets/icons"
import Layout from "../_components/Layout"
import { authActions } from "../_funcs"
import { PasswordStrengthBlock } from "./_components/PasswordStrengthBlock"

const passwordFieldSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "At least 8 characters" })
  .regex(/[a-z]/, { message: "Include a lowercase letter" })
  .regex(/[A-Z]/, { message: "Include an uppercase letter" })
  .regex(/[0-9]/, { message: "Include a number" })

const signUpSchema = z
  .object({
    companyName: z
      .string()
      .min(1, { message: "Company name is required" })
      .trim()
      .min(2, { message: "Company name must be at least 2 characters" })
      .max(200, { message: "Company name is too long" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .trim()
      .email({ message: "Invalid email" }),
    password: passwordFieldSchema,
    confirmPassword: z.string().min(1, { message: "Confirm your password" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

const linkClassName =
  "text-mtn-dark-6 text-sm font-medium no-underline hover:text-mtn-dark-8 hover:underline"

const inputClassNames = {
  input: "h-10 rounded-lg",
  label: "pb-0.5 text-sm font-semibold"
} as const

export default function SignUpPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const signUpForm = useForm({
    initialValues: {
      companyName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: "controlled",
    validate: mtnZodResolver(signUpSchema),
    enhanceGetInputProps: () => ({
      disabled: loading
    })
  })

  const password = signUpForm.values.password
  const confirmPassword = signUpForm.values.confirmPassword
  const confirmHasInput = confirmPassword.length > 0
  const passwordsMatch = confirmHasInput && password === confirmPassword

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setLoading(true)
    try {
      const { email, password: pw, companyName } = values
      const user = await authActions.signUp({
        email,
        password: pw,
        companyName
      })
      if (!user) {
        signUpForm.setFieldError(
          "email",
          "Something went wrong, contact support"
        )
      } else {
        router.replace(DEFAULT_LANDING_PATH)
      }
    } catch {
      signUpForm.setFieldError("email", "Something went wrong, contact support")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Stack gap="md">
        <div className="-mx-1 w-[calc(100%+0.5rem)] max-w-none overflow-x-auto overflow-y-visible px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <LogoIcon width={400} />
        </div>

        <Stack gap={4} align="center">
          <Title order={2} fz="1.25rem" fw={700} ta="center" lh={1.2}>
            Create your account
          </Title>
          <Text fz="sm" c="dimmed" ta="center" maw={320} lh={1.45}>
            Enter your company name, email, and password to get started.
          </Text>
        </Stack>

        <form onSubmit={signUpForm.onSubmit(handleSignUp)} autoComplete="off">
          <Stack gap="sm">
            <TextInput
              withAsterisk
              variant="filled"
              size="sm"
              classNames={inputClassNames}
              label="Company name"
              placeholder="Acme Inc."
              leftSection={<IconBuilding size={18} stroke={1.5} />}
              {...signUpForm.getInputProps("companyName")}
              autoComplete="organization"
            />

            <TextInput
              withAsterisk
              variant="filled"
              size="sm"
              classNames={inputClassNames}
              label="Email"
              placeholder="you@company.com"
              leftSection={<IconUser size={18} stroke={1.5} />}
              {...signUpForm.getInputProps("email")}
              autoComplete="email"
            />

            <PasswordStrengthBlock
              withAsterisk
              variant="filled"
              size="sm"
              classNames={{
                ...inputClassNames,
                innerInput: "rounded-lg"
              }}
              label="Password"
              placeholder="Create a strong password"
              leftSection={<IconLock size={18} stroke={1.5} />}
              {...signUpForm.getInputProps("password")}
              key={signUpForm.key("password")}
              autoComplete="new-password"
            />

            <Stack gap={6}>
              <PasswordInput
                withAsterisk
                variant="filled"
                size="sm"
                classNames={{
                  ...inputClassNames,
                  innerInput: "rounded-lg"
                }}
                label="Confirm password"
                placeholder="Confirm password"
                leftSection={<IconLock size={18} stroke={1.5} />}
                {...signUpForm.getInputProps("confirmPassword")}
                key={signUpForm.key("confirmPassword")}
                autoComplete="new-password"
              />
              {confirmHasInput ? (
                <Group gap={8}>
                  {passwordsMatch ? (
                    <>
                      <IconCheck
                        size={16}
                        stroke={2}
                        className="text-green-600"
                      />
                      <Text size="sm" c="green.7" fw={500}>
                        Passwords match
                      </Text>
                    </>
                  ) : (
                    <>
                      <IconX size={16} stroke={2} className="text-red-500" />
                      <Text size="sm" c="red.7" fw={500}>
                        Passwords do not match
                      </Text>
                    </>
                  )}
                </Group>
              ) : null}
            </Stack>

            <Button
              fullWidth
              type="submit"
              size="sm"
              radius="md"
              fw={600}
              mt={4}
              rightSection={<IconUserPlus size={20} stroke={1.5} />}
              variant="filled"
              color="dark"
              loading={loading}
            >
              Sign up
            </Button>
          </Stack>
        </form>

        <Text ta="center" fz="sm" c="dimmed" pt={2}>
          Already have an account?{" "}
          <Anchor component={Link} href="/login" className={linkClassName}>
            Log in
          </Anchor>
        </Text>
      </Stack>
    </Layout>
  )
}
