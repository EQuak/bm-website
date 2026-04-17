"use client"

import { Button, Flex, Stack, Text, Title } from "@repo/mantine-ui"
import { IconLogin2, IconUserPlus } from "@repo/mantine-ui/icons/index"
import Link from "next/link"

import { LogoIcon } from "#/assets/icons"
import { siteConfig } from "#/core/config/site"

export default function Welcome() {
  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-mtn-gray-0">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,120,120,0.12),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-svh max-w-md flex-col items-center justify-center px-6 py-16 sm:max-w-lg sm:px-8">
        <div className="w-full rounded-2xl border border-mtn-gray-3 bg-white/90 p-8 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:p-10">
          <Stack gap="xl" align="center">
            <div className="-mx-1 w-full max-w-full overflow-x-auto overflow-y-visible px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <LogoIcon width={400} />
            </div>

            <Stack gap="xs" align="center" ta="center">
              <Title
                order={1}
                fz="clamp(1.5rem,4vw,1.875rem)"
                fw={700}
                lh={1.2}
              >
                Welcome
              </Title>
              <Text fz="sm" c="dimmed" maw={340} lh={1.55}>
                Sign in to continue to {siteConfig.name}, or create an account
                to get started.
              </Text>
            </Stack>

            <Flex
              direction={{ base: "column", sm: "row" }}
              gap="sm"
              w="100%"
              justify="stretch"
            >
              <Button
                component={Link}
                href="/sign-up"
                prefetch={false}
                variant="default"
                size="md"
                radius="md"
                className="h-11 flex-1 border border-mtn-gray-4 bg-white font-semibold transition-colors hover:bg-mtn-gray-0"
                leftSection={<IconUserPlus size={18} stroke={1.5} />}
              >
                Sign up
              </Button>
              <Button
                component={Link}
                href="/login"
                prefetch={false}
                variant="filled"
                color="dark"
                size="md"
                radius="md"
                className="h-11 flex-1 font-semibold"
                leftSection={<IconLogin2 size={18} stroke={1.5} />}
              >
                Log in
              </Button>
            </Flex>
          </Stack>
        </div>
      </div>
    </main>
  )
}
