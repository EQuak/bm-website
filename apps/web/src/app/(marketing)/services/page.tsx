"use client"

import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  List,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@repo/mantine-ui"
import {
  IconArrowRight,
  IconBuildingSkyscraper,
  IconChartInfographic,
  IconCircleCheck,
  IconCpu,
  IconHierarchy,
  IconUsersGroup
} from "@repo/mantine-ui/icons/index"
import Image from "next/image"
import Link from "next/link"
import {
  MARKETING_HERO_PADDING_BOTTOM_PX,
  MARKETING_HERO_PADDING_TOP_PX,
  SITE_HEADER_HEIGHT_PX
} from "#/components/site/layout-constants"
import { MarketingHeroContainer } from "#/components/site/MarketingHeroContainer"
import { images } from "#/lib/consulting-images"

const offerings = [
  {
    title: "Corporate & business unit strategy",
    summary:
      "Where to play, how to win, and what to stop doing—grounded in markets, capabilities, and capital reality.",
    icon: IconChartInfographic,
    bullets: [
      "Portfolio & synergy reviews",
      "Competitive positioning & narrative",
      "Investment thesis support for M&A"
    ]
  },
  {
    title: "Operating model & governance",
    summary:
      "Decision rights, interfaces, and cadence that reduce coordination tax and speed up execution.",
    icon: IconHierarchy,
    bullets: [
      "RACI modernization & forum design",
      "Planning & budgeting rhythm",
      "Shared services / center of excellence design"
    ]
  },
  {
    title: "Revenue operations & GTM",
    summary:
      "Pipeline mechanics, forecasting discipline, and packaging that aligns sales, marketing, and success.",
    icon: IconUsersGroup,
    bullets: [
      "Segmentation & ICP refresh",
      "Pricing & packaging experiments",
      "Forecast & coverage diagnostics"
    ]
  },
  {
    title: "Transformation program leadership",
    summary:
      "Executive PMO, risk dashboards, and stakeholder choreography for programs too big to manage informally.",
    icon: IconBuildingSkyscraper,
    bullets: [
      "Stage‑gate governance",
      "Benefits tracking & value assurance",
      "Change heatmaps & adoption plans"
    ]
  },
  {
    title: "Technology & data advisory",
    summary:
      "Vendor selection, architecture guardrails, and analytics roadmaps that match ambition to maintainability.",
    icon: IconCpu,
    bullets: [
      "Requirements & RFP shaping",
      "Integration sequencing",
      "Analytics operating model"
    ]
  }
] as const

export default function ServicesPage() {
  return (
    <>
      <Box
        pos="relative"
        mih={{ base: 320, md: 380 }}
        style={{ marginTop: `-${SITE_HEADER_HEIGHT_PX}px` }}
      >
        <Image
          src={images.focus.src}
          alt={images.focus.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <Box
          pos="absolute"
          inset={0}
          style={{
            background:
              "linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 55%, rgba(220,38,38,0.2) 100%)"
          }}
        />
        <MarketingHeroContainer
          pos="relative"
          pt={MARKETING_HERO_PADDING_TOP_PX}
          pb={MARKETING_HERO_PADDING_BOTTOM_PX}
          style={{ zIndex: 1 }}
        >
          <Stack gap="xl" maw={720}>
            <Badge
              variant="filled"
              color="meridian"
              size="lg"
              radius="sm"
              w="fit-content"
            >
              Services
            </Badge>
            <Title
              order={1}
              c="white"
              fz={{ base: "2rem", md: "2.75rem" }}
              style={{ textWrap: "balance" as const }}
            >
              Hands‑on support for the decisions that shape your trajectory
            </Title>
            <Text c="gray.2" size="lg" lh={1.65}>
              Every engagement is tailored—mix and match modules, or ask me to
              design something bespoke for a critical moment (IPO readiness,
              post‑merger integration, a new CEO transition, and more).
            </Text>
            <Button
              component={Link}
              href="/contact"
              size="md"
              radius="md"
              variant="white"
              color="dark"
              w="fit-content"
              rightSection={<IconArrowRight size={16} />}
            >
              Discuss scope
            </Button>
          </Stack>
        </MarketingHeroContainer>
      </Box>

      <Container size="xl" py={{ base: 48, md: 64 }} px="md">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {offerings.map((service) => {
            const SvcIcon = service.icon
            return (
              <Card
                key={service.title}
                padding="xl"
                radius="lg"
                withBorder
                shadow="sm"
                h="100%"
              >
                <ThemeIcon
                  size={48}
                  radius="md"
                  variant="light"
                  color="meridian"
                  mb="md"
                >
                  <SvcIcon size={26} stroke={1.5} />
                </ThemeIcon>
                <Title order={3} mb="sm">
                  {service.title}
                </Title>
                <Text c="dimmed" mb="md" lh={1.65}>
                  {service.summary}
                </Text>
                <List
                  spacing="xs"
                  size="sm"
                  center
                  icon={
                    <ThemeIcon
                      color="meridian"
                      variant="light"
                      size={22}
                      radius="xl"
                    >
                      <IconCircleCheck size={14} stroke={1.5} />
                    </ThemeIcon>
                  }
                >
                  {service.bullets.map((b) => (
                    <List.Item key={b}>{b}</List.Item>
                  ))}
                </List>
              </Card>
            )
          })}
        </SimpleGrid>
      </Container>

      <Box bg="gray.0" py={{ base: 48, md: 64 }} px="md">
        <Container size="xl">
          <Grid gutter={{ base: "lg", md: 40 }} align="center">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Box
                pos="relative"
                style={{
                  aspectRatio: "1 / 1",
                  borderRadius: "var(--mantine-radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--mantine-shadow-md)"
                }}
              >
                <Image
                  src={images.detail.src}
                  alt={images.detail.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Title order={2} mb="md">
                Ways of working
              </Title>
              <Accordion
                variant="separated"
                radius="md"
                defaultValue="embedded"
              >
                <Accordion.Item value="embedded">
                  <Accordion.Control>Embedded teams</Accordion.Control>
                  <Accordion.Panel>
                    <Text c="dimmed" size="sm" lh={1.65}>
                      For complex programs I work alongside your PMO—typically
                      2–4 days per week on‑site or remote, with clear exit
                      criteria.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="sprints">
                  <Accordion.Control>Executive sprints</Accordion.Control>
                  <Accordion.Panel>
                    <Text c="dimmed" size="sm" lh={1.65}>
                      High‑intensity workshops (1–3 days) I facilitate to unlock
                      a specific decision: pricing reset, portfolio cut, or
                      leadership team charter.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="advisory">
                  <Accordion.Control>Advisory retainers</Accordion.Control>
                  <Accordion.Panel>
                    <Text c="dimmed" size="sm" lh={1.65}>
                      For CEOs and CFOs navigating a volatile year—an on‑call
                      sounding board, prep for board or investor moments, and
                      light‑touch diagnostics from me directly.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
