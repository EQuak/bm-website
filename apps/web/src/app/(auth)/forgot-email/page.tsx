"use client"

import { Button, Center, Stack, Text, Title } from "@repo/mantine-ui"
import { IconArrowLeft } from "@repo/mantine-ui/icons/index"
import { useRouter } from "next/navigation"
import { LogoIcon } from "../../../assets/icons"
import Layout from "../_components/Layout"

export default function ForgotEmail() {
  const router = useRouter()

  return (
    <Layout>
      <Stack gap={"xl"}>
        <Center>
          <LogoIcon width={220} />
        </Center>
        <Stack gap={"xs"}>
          <Title order={3} ta={"center"}>
            Forgot Email
          </Title>
          <Text ta={"center"}>
            If you have forgotten your email, please contact support at
            contact@company.com
          </Text>
        </Stack>
        <Button
          variant={"outline"}
          onClick={() => router.push("/login")}
          leftSection={<IconArrowLeft />}
        >
          Back to Login
        </Button>
      </Stack>
    </Layout>
  )
}
