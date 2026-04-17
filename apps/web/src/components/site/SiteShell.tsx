"use client"

import {
  Anchor,
  AppShell,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  rem,
  Stack,
  Text,
  Title,
  useDisclosure
} from "@repo/mantine-ui"
import { IconMail, IconPhone } from "@repo/mantine-ui/icons/index"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { siteConfig } from "#/core/config/site"

import { BmMonogramLogo } from "./BmMonogramLogo"
import { SITE_HEADER_HEIGHT_PX } from "./layout-constants"

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" }
] as const

function NavLinks({
  onNavigate,
  orientation = "horizontal"
}: {
  onNavigate?: () => void
  orientation?: "horizontal" | "vertical"
}) {
  const pathname = usePathname()
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)

  const horizontal = orientation === "horizontal"

  const links = nav.map((item) => {
    const active =
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    const hovered = hoveredHref === item.href
    const color =
      active && hovered
        ? "var(--mantine-color-meridian-8)"
        : active
          ? "var(--mantine-color-meridian-7)"
          : hovered
            ? "var(--mantine-color-meridian-8)"
            : "var(--mantine-color-dimmed)"

    return (
      <Box
        key={item.href}
        component={Link}
        href={item.href}
        prefetch={false}
        onClick={onNavigate}
        fz="sm"
        fw={600}
        style={{
          color,
          cursor: "pointer",
          textDecoration: "none",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          transition: "color 0.15s ease, border-color 0.15s ease",
          ...(horizontal
            ? {
                display: "flex",
                alignItems: "center",
                alignSelf: "stretch",
                // Spacing lives inside each link so the cursor stays pointer between labels
                paddingInline: "var(--mantine-spacing-md)",
                paddingBottom: rem(4),
                borderBottom: active
                  ? `${rem(2)} solid var(--mantine-color-meridian-6)`
                  : `${rem(2)} solid transparent`
              }
            : {
                display: "flex",
                alignItems: "center",
                width: "100%",
                paddingBlock: "var(--mantine-spacing-sm)",
                paddingInline: rem(4),
                borderRadius: "var(--mantine-radius-sm)",
                backgroundColor: active
                  ? "light-dark(var(--mantine-color-meridian-0), rgba(220, 38, 38, 0.12))"
                  : undefined
              })
        }}
        onPointerEnter={() => setHoveredHref(item.href)}
        onPointerLeave={() => setHoveredHref(null)}
      >
        {item.label}
      </Box>
    )
  })

  if (orientation === "vertical") {
    return <Stack gap={0}>{links}</Stack>
  }

  return (
    <Group
      gap={0}
      visibleFrom="md"
      justify="flex-end"
      align="stretch"
      wrap="nowrap"
      style={{ alignSelf: "stretch" }}
    >
      {links}
    </Group>
  )
}

function SiteFooter() {
  return (
    <Box
      component="footer"
      py={{ base: "xl", md: 56 }}
      px="md"
      style={{
        borderTop:
          "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))"
      }}
      bg="gray.0"
    >
      <Container size="xl">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="xl">
          <Stack gap="sm" maw={360}>
            <Group gap="xs" align="center">
              <BmMonogramLogo size={36} />
              <Title order={4}>{siteConfig.name}</Title>
            </Group>
            <Text size="sm" c="dimmed" lh={1.65}>
              {siteConfig.tagline}
            </Text>
          </Stack>

          <Stack gap="sm">
            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
              Contact
            </Text>
            <Group gap="xs" wrap="nowrap">
              <IconMail
                size={16}
                stroke={1.5}
                color="var(--mantine-color-meridian-6)"
              />
              <Anchor
                size="sm"
                href={`mailto:${siteConfig.email}`}
                underline="hover"
              >
                {siteConfig.email}
              </Anchor>
            </Group>
            <Group gap="xs" wrap="nowrap">
              <IconPhone
                size={16}
                stroke={1.5}
                color="var(--mantine-color-meridian-6)"
              />
              <Text size="sm">{siteConfig.phone}</Text>
            </Group>
          </Stack>

          <Stack gap="xs">
            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
              Explore
            </Text>
            <Stack gap={6}>
              {nav.map((item) => (
                <Anchor
                  key={item.href}
                  component={Link}
                  href={item.href}
                  size="sm"
                  c="dimmed"
                  underline="hover"
                >
                  {item.label}
                </Anchor>
              ))}
            </Stack>
          </Stack>
        </Group>

        <Divider my="lg" />

        <Group justify="space-between" wrap="wrap" gap="md">
          <Text size="xs" c="dimmed">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </Text>
          <Anchor
            component={Link}
            href={siteConfig.social.linkedin}
            size="xs"
            c="dimmed"
            target="_blank"
            rel="noreferrer"
            underline="hover"
          >
            LinkedIn
          </Anchor>
        </Group>
      </Container>
    </Box>
  )
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false)

  return (
    <>
      <AppShell
        header={{ height: SITE_HEADER_HEIGHT_PX }}
        padding={0}
        styles={{
          main: {
            // Clear fixed header so inner pages match landing text inset
            paddingTop: `${SITE_HEADER_HEIGHT_PX}px`,
            paddingBottom: 0,
            minHeight: `calc(100dvh - ${SITE_HEADER_HEIGHT_PX}px)`
          }
        }}
      >
        <AppShell.Header
          withBorder
          style={{
            backdropFilter: "saturate(180%) blur(12px)",
            backgroundColor: "rgba(255, 255, 255, 0.88)"
          }}
        >
          <Container size="xl" px="md" h="100%">
            <Group
              h="100%"
              justify="space-between"
              wrap="nowrap"
              align="stretch"
            >
              <Group gap="sm" wrap="nowrap" align="center">
                <BmMonogramLogo size={40} />
                <Box
                  component={Link}
                  href="/"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Title
                    order={3}
                    fz={{ base: "1.05rem", sm: "1.2rem" }}
                    fw={700}
                    lh={1.2}
                  >
                    {siteConfig.name}
                  </Title>
                  <Text size="xs" c="dimmed" visibleFrom="sm" lineClamp={1}>
                    {siteConfig.headline}
                  </Text>
                </Box>
              </Group>

              <NavLinks />

              <Group gap="sm" wrap="nowrap" align="center">
                <Button
                  component={Link}
                  href="/contact"
                  visibleFrom="md"
                  radius="md"
                  size="sm"
                >
                  Let&apos;s talk
                </Button>
                <Burger
                  opened={drawerOpened}
                  onClick={toggleDrawer}
                  hiddenFrom="md"
                  size="sm"
                  aria-label="Open navigation"
                />
              </Group>
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Main>{children}</AppShell.Main>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          position="right"
          size="100%"
          padding="xl"
          title="Menu"
          hiddenFrom="md"
          zIndex={400}
        >
          <Stack gap="xl" mt="md">
            <NavLinks orientation="vertical" onNavigate={closeDrawer} />
            <Button
              component={Link}
              href="/contact"
              size="md"
              radius="md"
              fullWidth
              onClick={closeDrawer}
            >
              Start a conversation
            </Button>
          </Stack>
        </Drawer>
      </AppShell>

      <SiteFooter />
    </>
  )
}
