"use client"

import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@repo/mantine-ui"
import Link from "next/link"
import type { ComponentType } from "react"

import { BmMonogramLogo } from "#/components/site/BmMonogramLogo"
import {
  LogoVariant1,
  LogoVariant2,
  LogoVariant3,
  LogoVariant4,
  LogoVariant5,
  LogoVariant6,
  LogoVariant7,
  LogoVariant8,
  LogoVariant9,
  LogoVariant10,
  LogoVariant11,
  LogoVariant12,
  LogoVariant13,
  LogoVariant14,
  LogoVariant15
} from "#/components/site/logo-lab/LogoVariants"
import { MarketingFirstSection } from "#/components/site/MarketingFirstSection"
import { MarketingHeroContainer } from "#/components/site/MarketingHeroContainer"

const BADGE_COLORS = [
  "red",
  "violet",
  "lime",
  "orange",
  "cyan",
  "teal",
  "grape",
  "yellow",
  "pink",
  "green",
  "indigo",
  "blue",
  "gray",
  "dark",
  "grape"
] as const

const concepts: {
  n: number
  title: string
  blurb: string
  Logo: ComponentType<{ size?: number }>
}[] = [
  {
    n: 1,
    title: "Diagonal split (warm)",
    blurb:
      "Coral / rose field vs wine triangle — B and M on contrasting sides.",
    Logo: LogoVariant1
  },
  {
    n: 2,
    title: "Squircle (violet)",
    blurb: "Lavender to indigo gradient; soft superellipse.",
    Logo: LogoVariant2
  },
  {
    n: 3,
    title: "Wireframe (neon)",
    blurb: "Zinc black tile; hollow BM in electric lime stroke.",
    Logo: LogoVariant3
  },
  {
    n: 4,
    title: "Hex (sunset)",
    blurb: "Amber → orange hex; dark brown BM.",
    Logo: LogoVariant4
  },
  {
    n: 5,
    title: "Stacked (ocean)",
    blurb: "Sky to deep blue; icy B over airy M.",
    Logo: LogoVariant5
  },
  {
    n: 6,
    title: "Double frame (terracotta)",
    blurb: "Cream card, brick rules, split B | M.",
    Logo: LogoVariant6
  },
  {
    n: 7,
    title: "Venn (cyan × violet)",
    blurb: "Overlapping circles; BM on the blend.",
    Logo: LogoVariant7
  },
  {
    n: 8,
    title: "Midnight + gold",
    blurb: "Navy disc, thin gold ring, gold wordmark.",
    Logo: LogoVariant8
  },
  {
    n: 9,
    title: "Pink pill",
    blurb: "Horizontal capsule; hot pink gradient.",
    Logo: LogoVariant9
  },
  {
    n: 10,
    title: "Forest + mint",
    blurb: "Deep green tile; soft mint BM.",
    Logo: LogoVariant10
  },
  {
    n: 11,
    title: "Sunburst + ink",
    blurb: "Indigo field, yellow rays, white hub, plum BM.",
    Logo: LogoVariant11
  },
  {
    n: 12,
    title: "Offset layers",
    blurb: "Sand card behind teal tile — depth without skew.",
    Logo: LogoVariant12
  },
  {
    n: 13,
    title: "Ring + split letters",
    blurb: "Minimal ring; B in blue, M in orange on white.",
    Logo: LogoVariant13
  },
  {
    n: 14,
    title: "Brutalist bar",
    blurb: "Black square, white BM, red rule (poster energy).",
    Logo: LogoVariant14
  },
  {
    n: 15,
    title: "Lavender cloud",
    blurb: "Soft purple wash; deep plum BM.",
    Logo: LogoVariant15
  }
]

export default function LogoLabPage() {
  return (
    <>
      <MarketingFirstSection bg="gray.0">
        <MarketingHeroContainer>
          <Title order={1} mb="xs">
            Logo lab
          </Title>
          <Text c="dimmed" size="lg" lh={1.65} maw={620}>
            Fifteen marks — each uses a different palette and layout idea. The
            live site currently uses{" "}
            <Text span fw={600}>
              #14
            </Text>{" "}
            (brutalist black / red rule). Ask for another number to swap the
            header. Route:{" "}
            <Text span fw={600} c="meridian.8">
              /logo-lab
            </Text>
            .
          </Text>
          <Button
            component={Link}
            href="/"
            variant="light"
            color="meridian"
            mt="md"
            radius="md"
          >
            Back to home
          </Button>
        </MarketingHeroContainer>
      </MarketingFirstSection>

      <Container size="xl" py={{ base: 32, md: 48 }} px="md">
        <Card withBorder radius="lg" p="lg" mb="xl" shadow="sm">
          <Text size="sm" fw={700} c="dimmed" tt="uppercase" mb="sm">
            Live header mark (variant 14)
          </Text>
          <Group align="center" gap="md" wrap="wrap">
            <BmMonogramLogo size={40} />
            <Text size="sm" c="dimmed" maw={400}>
              This is the same component as in the site shell, at the real
              header size (~40px). Card #14 below is the same design, larger.
            </Text>
          </Group>
        </Card>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {concepts.map(({ n, title, blurb, Logo }) => (
            <Card
              key={n}
              withBorder
              radius="lg"
              padding="lg"
              shadow="sm"
              style={{
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Badge
                size="xl"
                variant="filled"
                color={BADGE_COLORS[(n - 1) % BADGE_COLORS.length]}
                circle
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  fontSize: "1rem",
                  minWidth: 40,
                  height: 40
                }}
              >
                {n}
              </Badge>
              <Stack gap="md" align="center" pt={8}>
                <Box
                  p="xl"
                  style={{
                    borderRadius: "var(--mantine-radius-md)",
                    background:
                      "linear-gradient(145deg, var(--mantine-color-gray-0) 0%, white 100%)"
                  }}
                >
                  <Logo size={140} />
                </Box>
                <div style={{ textAlign: "center", width: "100%" }}>
                  <Text fw={700} size="lg">
                    {title}
                  </Text>
                  <Text size="sm" c="dimmed" mt={6} lh={1.55}>
                    {blurb}
                  </Text>
                </div>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        <Divider my="xl" />

        <Text size="sm" c="dimmed" ta="center">
          Tip: check at ~40px — that matches the real header logo size.
        </Text>
      </Container>
    </>
  )
}
