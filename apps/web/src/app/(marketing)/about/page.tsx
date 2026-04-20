"use client"

import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Title
} from "@repo/mantine-ui"
import { IconArrowRight, IconCircleCheck } from "@repo/mantine-ui/icons/index"
import Image from "next/image"
import Link from "next/link"

import { BmMonogramLogo } from "#/components/site/BmMonogramLogo"
import { MarketingFirstSection } from "#/components/site/MarketingFirstSection"
import { MarketingHeroContainer } from "#/components/site/MarketingHeroContainer"
import { siteConfig } from "#/core/config/site"
import { images } from "#/lib/consulting-images"

const principles = [
  {
    title: "Owner vision, made operational",
    body: "We translate what you want the business to become into priorities, roles, and rhythms people can actually run."
  },
  {
    title: "Honest assessment, no drama",
    body: "A clear read on what’s weak—process, leadership, or execution—without blame, and with a path forward."
  },
  {
    title: "Systems that reduce reliance",
    body: "Delegation, decision rights, and simple systems so the business runs for you—not because of you."
  }
] as const

export default function AboutPage() {
  return (
    <>
      <MarketingFirstSection bg="meridian.9" c="white">
        <MarketingHeroContainer>
          <Stack gap="xl">
            <Badge
              color="meridian"
              variant="filled"
              size="lg"
              radius="sm"
              tt="none"
              w="fit-content"
            >
              About
            </Badge>
            <Title
              order={1}
              fz={{ base: "2rem", md: "2.65rem" }}
              style={{ textWrap: "balance" as const }}
            >
              Building clarity, structure, and momentum—without losing the
              owner’s intent
            </Title>
            <Text size="lg" c="gray.3" lh={1.7} maw={640}>
              I partner with owners and executive teams to align on direction,
              uncover what’s holding execution back, strengthen what’s already
              working, and build practical solutions around how the owner wants
              to lead.
            </Text>
          </Stack>
        </MarketingHeroContainer>
      </MarketingFirstSection>

      <Container size="xl" py={{ base: 48, md: 72 }} px="md">
        <Grid gutter={{ base: 32, md: 48 }} align="center">
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
            <Stack gap="lg">
              <div>
                <Badge
                  color="meridian"
                  variant="light"
                  size="lg"
                  radius="sm"
                  mb="md"
                  w="fit-content"
                >
                  How I think
                </Badge>
                <Title order={2}>Philosophy</Title>
              </div>
              <Text c="dimmed" size="lg" lh={1.75}>
                Clarity is a multiplier. When goals, priorities, and roles are
                explicit, teams execute with less noise. I start with operating
                truth—how decisions get made and where work actually gets stuck—
                then build a plan your leaders can run without heroics.
              </Text>
              <List
                spacing="sm"
                size="md"
                icon={
                  <ThemeIcon
                    color="meridian"
                    variant="light"
                    radius="xl"
                    size={28}
                  >
                    <IconCircleCheck size={16} stroke={1.5} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  Alignment on direction before adding new initiatives
                </List.Item>
                <List.Item>
                  Clear ownership, delegation, and decision rights
                </List.Item>
                <List.Item>
                  Practical systems that fit the owner’s vision and role
                </List.Item>
              </List>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
            <Box
              pos="relative"
              style={{
                aspectRatio: "5 / 4",
                borderRadius: "var(--mantine-radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--mantine-shadow-xl)"
              }}
            >
              <Image
                src={images.team.src}
                alt="Blake Miller collaborating with clients in a workshop"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Container>

      <Box bg="gray.0" py={{ base: 48, md: 72 }} px="md">
        <Container size="md">
          <Stack gap="xs" mb="xl" maw={560} mx="auto" ta="center">
            <Badge
              color="meridian"
              variant="light"
              size="lg"
              radius="sm"
              mx="auto"
              w="fit-content"
            >
              Engagement model
            </Badge>
            <Title order={2}>How I engage</Title>
            <Text c="dimmed" size="sm" lh={1.65}>
              A repeatable arc—alignment, assessment, then building the systems
              and delegation that make execution durable.
            </Text>
          </Stack>
          <Timeline bulletSize={28} lineWidth={3} color="meridian">
            <Timeline.Item
              title="Alignment"
              bullet={
                <Text size="xs" fw={700}>
                  1
                </Text>
              }
            >
              <Text c="dimmed" size="sm" lh={1.65}>
                We clarify the owner’s vision and align leaders on goals,
                priorities, and what “good” looks like—so the work has a clear
                direction and tradeoffs are explicit.
              </Text>
            </Timeline.Item>
            <Timeline.Item
              title="Assessment"
              bullet={
                <Text size="xs" fw={700}>
                  2
                </Text>
              }
            >
              <Text c="dimmed" size="sm" lh={1.65}>
                An honest look at what’s breaking: operational weaknesses,
                leadership gaps, and where execution gets stuck—grounded in
                interviews, artifacts, and the numbers.
              </Text>
            </Timeline.Item>
            <Timeline.Item
              title="Build & embed"
              bullet={
                <Text size="xs" fw={700}>
                  3
                </Text>
              }
            >
              <Text c="dimmed" size="sm" lh={1.65}>
                Tailored solutions based on the owner’s role: systems,
                delegation, decision rights, and simple rhythms—embedded until
                the business can run with less day‑to‑day reliance on them.
              </Text>
            </Timeline.Item>
          </Timeline>
        </Container>
      </Box>

      <Container size="xl" py={{ base: 48, md: 72 }} px="md">
        <Stack gap="xl" align="center">
          <Stack gap="xs" ta="center" maw={560}>
            <Title order={2}>What you can expect</Title>
            <Text c="dimmed" size="sm" lh={1.65}>
              How I show up when we work together.
            </Text>
          </Stack>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" w="100%">
            {principles.map((p) => (
              <Paper
                key={p.title}
                p="lg"
                radius="lg"
                withBorder
                shadow="sm"
                style={{
                  borderTop: `${3}px solid var(--mantine-color-meridian-6)`
                }}
              >
                <Text fw={700} size="sm" mb="xs" c="gray.9">
                  {p.title}
                </Text>
                <Text size="sm" c="dimmed" lh={1.65}>
                  {p.body}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Box component="section" py={{ base: 56, md: 80 }} px="md" bg="white">
        <Container size="md">
          <Stack gap="xl">
            <Stack gap="md">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={0.8}>
                In brief
              </Text>
              <Title
                order={2}
                maw={540}
                style={{ textWrap: "balance" as const }}
              >
                Strategy, ops, and the politics in between
              </Title>
            </Stack>

            <Grid gutter={{ base: "xl", md: 48 }} align="flex-start">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Box
                  p="xl"
                  bg="gray.0"
                  style={{
                    borderRadius: "var(--mantine-radius-lg)",
                    border:
                      "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))"
                  }}
                >
                  <Stack gap="md" align="center">
                    <BmMonogramLogo size={80} />
                    <Stack gap={4} align="center" ta="center">
                      <Text fw={700} size="sm">
                        {siteConfig.name}
                      </Text>
                      <Text size="xs" c="dimmed" lh={1.5}>
                        {siteConfig.headline}
                      </Text>
                    </Stack>
                  </Stack>
                </Box>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="lg">
                  <Text c="dimmed" size="lg" lh={1.75}>
                    Most of my work sits where portfolios, revenue motion, and
                    transformation programs meet executive judgment—where the
                    spreadsheet is necessary but never sufficient.
                  </Text>
                  <Text c="dimmed" lh={1.75}>
                    I keep a light roster on purpose: fewer clients, deeper
                    presence in each. If the match isn&apos;t right or the
                    timing is off, I&apos;ll tell you plainly and help you find
                    a better next step where I can.
                  </Text>
                </Stack>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Box
        component="section"
        py={{ base: 56, md: 80 }}
        px="md"
        bg="meridian.9"
      >
        <Container size="md">
          <Stack gap="lg" align="flex-start" maw={560}>
            <Title order={2} c="white" style={{ textWrap: "balance" as const }}>
              Tell me what you&apos;re trying to move
            </Title>
            <Text c="gray.3" size="lg" lh={1.7}>
              A short note on context, timing, and what “good” looks like is
              enough to start. I&apos;ll reply with next steps—or a candid no if
              I&apos;m not the right person.
            </Text>
            <Button
              component={Link}
              href="/contact"
              size="md"
              radius="md"
              variant="white"
              color="dark"
              rightSection={<IconArrowRight size={18} />}
            >
              Start a conversation
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  )
}
