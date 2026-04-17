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
    title: "Ground truth first",
    body: "Interviews, artifacts, and numbers—so recommendations match how decisions really get made."
  },
  {
    title: "Direct, kind feedback",
    body: "Clear tradeoffs and honest reads on risk. No vague “it depends” without a path to decide."
  },
  {
    title: "Built to outlast me",
    body: "Rituals, owners, and metrics your teams can run without a retainer—transfer is part of the scope."
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
              Experience in the arena—not just the slide deck
            </Title>
            <Text size="lg" c="gray.3" lh={1.7} maw={640}>
              From first workshop to final readout, the same person stays in the
              room with you: clear ownership, fewer handoffs, and no surprise
              substitutions once work is underway.
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
                Strategy fails when it floats above reality. I start from
                operating truth—how decisions get made, where work really
                happens, and what your customers experience—then design
                interventions your organization can sustain.
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
                  Decisions and forums over anonymous slide stacks
                </List.Item>
                <List.Item>
                  Actionable within weeks—not a 200‑slide “strategy” nobody runs
                </List.Item>
                <List.Item>
                  Explicit tradeoffs: what we&apos;re optimizing for, and what
                  we&apos;re not
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
              A repeatable arc—fast learning, sharp choices, then activation
              alongside your operators.
            </Text>
          </Stack>
          <Timeline bulletSize={28} lineWidth={3} color="meridian">
            <Timeline.Item
              title="Immersion"
              bullet={
                <Text size="xs" fw={700}>
                  1
                </Text>
              }
            >
              <Text c="dimmed" size="sm" lh={1.65}>
                Stakeholder interviews, artifact review, and quantitative
                baselines—compressed into a tight calendar so I learn fast
                without freezing your teams.
              </Text>
            </Timeline.Item>
            <Timeline.Item
              title="Synthesis & options"
              bullet={
                <Text size="xs" fw={700}>
                  2
                </Text>
              }
            >
              <Text c="dimmed" size="sm" lh={1.65}>
                I pressure‑test scenarios with your leaders, quantify tradeoffs,
                and converge on a recommended path with explicit decision
                rights.
              </Text>
            </Timeline.Item>
            <Timeline.Item
              title="Activation"
              bullet={
                <Text size="xs" fw={700}>
                  3
                </Text>
              }
            >
              <Text c="dimmed" size="sm" lh={1.65}>
                Playbooks, rituals, and metrics—implemented alongside your
                operators until the new cadence feels native.
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
