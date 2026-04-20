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
    title: "Goal alignment & priorities",
    summary:
      "Get clear on direction, tradeoffs, and what stops now—so teams execute the same plan, not five versions of it.",
    icon: IconChartInfographic,
    bullets: [
      "Leadership alignment sessions",
      "Priority and roadmap clarity",
      "Decision-making and tradeoff framework"
    ]
  },
  {
    title: "Operations assessment & fixes",
    summary:
      "Identify operational weaknesses and leadership gaps, then fix the few things that unlock execution.",
    icon: IconHierarchy,
    bullets: [
      "Workflow and handoff diagnosis",
      "Roles, accountability, and ownership",
      "Simple operating rhythm (weekly/monthly)"
    ]
  },
  {
    title: "Strengths-led growth",
    summary:
      "Double down on what’s already working—then strengthen the systems around it to scale without chaos.",
    icon: IconUsersGroup,
    bullets: [
      "Packaging and offer clarity",
      "Sales execution and pipeline discipline",
      "Customer retention and expansion levers"
    ]
  },
  {
    title: "Delegation & systems",
    summary:
      "Build the structure required for the business to rely less on the owner every day—without losing the owner’s intent.",
    icon: IconBuildingSkyscraper,
    bullets: [
      "Decision rights and escalation paths",
      "Leadership team operating cadence",
      "Delegation plan and handoff systems"
    ]
  },
  {
    title: "Tools that support the system",
    summary:
      "Right-size tools and reporting to reinforce your operating system—not add more complexity.",
    icon: IconCpu,
    bullets: [
      "Reporting that matches decision cadence",
      "Lightweight systems and automations",
      "Tool selection and implementation guidance"
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
              "linear-gradient(90deg, rgba(11,45,92,0.92) 0%, rgba(11,45,92,0.55) 55%, rgba(47,111,179,0.2) 100%)"
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
              Practical support to build a business that runs with less friction
            </Title>
            <Text c="gray.2" size="lg" lh={1.65}>
              Every engagement is tailored around the owner’s vision and role.
              Sometimes that means improving execution with the owner deeply
              involved. Other times it means building the structure, delegation,
              and systems required to rely on them less every day.
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
                  <Accordion.Control>Embedded implementation</Accordion.Control>
                  <Accordion.Panel>
                    <Text c="dimmed" size="sm" lh={1.65}>
                      I work alongside you and your team (on-site or remote) to
                      implement systems, delegation, and rhythm until the new
                      way of operating sticks.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="sprints">
                  <Accordion.Control>
                    Owner & leadership sprints
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text c="dimmed" size="sm" lh={1.65}>
                      High‑intensity sessions (1–3 days) to align on goals and
                      priorities, surface what’s weak, and leave with a clear
                      plan—roles, owners, and next steps.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="advisory">
                  <Accordion.Control>Advisory support</Accordion.Control>
                  <Accordion.Panel>
                    <Text c="dimmed" size="sm" lh={1.65}>
                      An on‑call partner for owners and executives—pressure‑test
                      decisions, spot risks early, and keep priorities tight
                      when the week is noisy.
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
