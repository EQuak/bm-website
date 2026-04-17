import { Button, Center, Stack, Text, Title } from "@repo/mantine-ui"
import Link from "next/link"

import { LogoIcon } from "#/assets/icons"
import Layout from "./Layout"

interface RedirectCardProps {
  title: "Success" | "Error"
  description: string
  href: string
  buttonText: string
  subDescription?: string
  buttonIcon?: React.ReactElement
}

export default function RedirectCard({
  title,
  description,
  href,
  buttonText,
  subDescription,
  buttonIcon
}: RedirectCardProps) {
  return (
    <Layout>
      <Stack gap={"xl"}>
        <Center>
          <LogoIcon width={220} />
        </Center>
        <Stack gap={"xs"}>
          <Title
            order={3}
            ta={"center"}
            c={title === "Error" ? "red" : "green"}
          >
            {title}
          </Title>
          <Text ta={"center"}>{description}</Text>
          {subDescription && (
            <Text c="dimmed" size={"sm"} ta={"center"}>
              {subDescription}
            </Text>
          )}
        </Stack>
        <Stack gap={"sm"}>
          <Button href={href} component={Link} leftSection={buttonIcon}>
            {buttonText}
          </Button>
        </Stack>
      </Stack>
    </Layout>
  )
}
