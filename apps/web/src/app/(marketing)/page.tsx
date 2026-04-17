"use client"

import {
  BackgroundImage,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  List,
  Overlay,
  Paper,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from "@repo/mantine-ui"
import {
  IconArrowRight,
  IconBolt,
  IconChartDots,
  IconCircleCheck,
  IconUsers
} from "@repo/mantine-ui/icons/index"
import Image from "next/image"
import Link from "next/link"
import {
  HOME_HERO_MIN_HEIGHT_PX,
  MARKETING_HERO_PADDING_BOTTOM_PX,
  MARKETING_HERO_PADDING_TOP_PX,
  SITE_HEADER_HEIGHT_PX
} from "#/components/site/layout-constants"
import { MarketingHeroContainer } from "#/components/site/MarketingHeroContainer"
import { siteConfig } from "#/core/config/site"
import { images } from "#/lib/consulting-images"

const HOME_PROOF_STATS = [
  {
    label: "Years in practice",
    value: "12+",
    sub: "Strategy, ops & transformation"
  },
  {
    label: "Engagements led",
    value: "50+",
    sub: "As principal consultant"
  },
  {
    label: "Time to first insight",
    value: "2–4 wks",
    sub: "Typical discovery window"
  },
  {
    label: "Repeat & referral work",
    value: "Most",
    sub: "Of my business is from people I’ve worked with before"
  }
] as const

export default function HomePage() {
  return (
    <>
      <Box
        pos="relative"
        mih={HOME_HERO_MIN_HEIGHT_PX}
        style={{ marginTop: `-${SITE_HEADER_HEIGHT_PX}px` }}
      >
        <Image
          src={images.hero.src}
          alt={images.hero.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <Overlay
          gradient="linear-gradient(115deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.58) 45%, rgba(220,38,38,0.22) 100%)"
          opacity={1}
          zIndex={1}
        />
        <MarketingHeroContainer
          pos="relative"
          pt={MARKETING_HERO_PADDING_TOP_PX}
          pb={MARKETING_HERO_PADDING_BOTTOM_PX}
          style={{ zIndex: 2 }}
        >
          <Stack gap="xl">
            <Badge
              variant="light"
              color="gray"
              size="lg"
              radius="sm"
              w="fit-content"
              styles={{
                root: {
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.12)"
                }
              }}
            >
              Strategy · Transformation · Delivery
            </Badge>
            <Title
              order={1}
              c="white"
              maw={720}
              style={{ textWrap: "balance" as const }}
              fz={{ base: "2rem", sm: "2.5rem", md: "3rem" }}
            >
              Clarity for complex decisions. Momentum for what comes next.
            </Title>
            <Text size="lg" c="gray.2" maw={560} lh={1.65}>
              {siteConfig.tagline}
            </Text>
            <Group gap="md" mt="sm" wrap="wrap">
              <Button
                component={Link}
                href="/contact"
                size="lg"
                radius="md"
                rightSection={<IconArrowRight size={18} />}
              >
                Book a discovery call
              </Button>
              <Button
                component={Link}
                href="/services"
                size="lg"
                radius="md"
                variant="white"
                color="dark"
              >
                View services
              </Button>
            </Group>
          </Stack>
        </MarketingHeroContainer>
      </Box>

      <Box
        component="section"
        py={{ base: 48, md: 64 }}
        bg="white"
        style={{
          borderBottom:
            "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))"
        }}
      >
        <MarketingHeroContainer>
          <Stack gap="xl">
            <Stack gap="sm" maw={560}>
              <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                Proof points
              </Text>
              <Title
                order={2}
                fz={{ base: "1.35rem", md: "1.5rem" }}
                fw={700}
                lh={1.35}
              >
                A quick snapshot of how I work with teams—not a pitch deck
                appendix
              </Title>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
              {HOME_PROOF_STATS.map((stat) => (
                <Box
                  key={stat.label}
                  pl="md"
                  style={{
                    borderLeft: "4px solid var(--mantine-color-meridian-6)"
                  }}
                >
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    {stat.label}
                  </Text>
                  <Text
                    fz={{ base: "2.35rem", md: "2.65rem" }}
                    fw={800}
                    lh={1.05}
                    mt={10}
                    c="gray.9"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {stat.value}
                  </Text>
                  <Text size="sm" c="dimmed" mt="sm" lh={1.65} maw={260}>
                    {stat.sub}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>
        </MarketingHeroContainer>
      </Box>

      <Box component="section" py={{ base: 48, md: 64 }} bg="gray.0">
        <MarketingHeroContainer>
          <Grid gutter={{ base: "lg", md: 48 }} align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box
                pos="relative"
                style={{
                  aspectRatio: "4 / 3",
                  borderRadius: "var(--mantine-radius-lg)",
                  overflow: "hidden",
                  boxShadow: "var(--mantine-shadow-xl)"
                }}
              >
                <Image
                  src={images.strategy.src}
                  alt={images.strategy.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="md">
                <Badge
                  color="meridian"
                  variant="light"
                  size="lg"
                  radius="sm"
                  w="fit-content"
                >
                  How I work
                </Badge>
                <Title order={2}>Partnership, not paperwork factories</Title>
                <Text c="dimmed" size="lg" lh={1.7}>
                  I embed with your leadership team—facilitating tradeoffs,
                  pressure‑testing assumptions, and building playbooks your
                  operators can run without me on speed‑dial forever.
                </Text>
                <List
                  spacing="sm"
                  size="md"
                  center
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
                    Sprint‑based discovery with crisp decision gates
                  </List.Item>
                  <List.Item>
                    Executive‑ready narratives and measurable outcomes
                  </List.Item>
                  <List.Item>
                    Knowledge transfer baked into every engagement
                  </List.Item>
                </List>
                <Button
                  component={Link}
                  href="/about"
                  variant="light"
                  color="meridian"
                  size="md"
                  radius="md"
                  rightSection={<IconArrowRight size={16} />}
                  w="fit-content"
                >
                  About me
                </Button>
              </Stack>
            </Grid.Col>
          </Grid>
        </MarketingHeroContainer>
      </Box>

      <Box
        component="section"
        py={{ base: 56, md: 80 }}
        px="md"
        bg="white"
        style={{
          borderTop:
            "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))"
        }}
      >
        <Container size="xl">
          <Stack gap="xl" align="center" mb="xl">
            <Title
              order={2}
              ta="center"
              maw={640}
              style={{ textWrap: "balance" as const }}
            >
              Capabilities designed for real‑world constraints
            </Title>
            <Text ta="center" c="dimmed" maw={560}>
              From operating model redesign to portfolio governance—I bring
              structure without smothering the judgment that makes your business
              unique.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            {[
              {
                title: "Growth & GTM",
                body: "Segmentation, packaging, and sales motion design grounded in unit economics you can defend in the boardroom.",
                icon: IconChartDots
              },
              {
                title: "Operating cadence",
                body: "Rituals, metrics, and accountability loops that make strategy something teams execute weekly—not quarterly.",
                icon: IconBolt
              },
              {
                title: "Leadership alignment",
                body: "Executive workshops and decision rights that reduce thrash and accelerate high‑stakes calls.",
                icon: IconUsers
              }
            ].map((item) => {
              const CapabilityIcon = item.icon
              return (
                <Card
                  key={item.title}
                  padding="xl"
                  radius="lg"
                  withBorder
                  shadow="md"
                  style={{
                    background:
                      "linear-gradient(180deg, white 0%, var(--mantine-color-gray-0) 100%)"
                  }}
                >
                  <ThemeIcon
                    size={48}
                    radius="md"
                    variant="gradient"
                    mb="md"
                    gradient={{
                      from: "meridian.5",
                      to: "meridian.8",
                      deg: 135
                    }}
                  >
                    <CapabilityIcon size={26} stroke={1.5} />
                  </ThemeIcon>
                  <Title order={4} mb="sm">
                    {item.title}
                  </Title>
                  <Text size="sm" c="dimmed" lh={1.65}>
                    {item.body}
                  </Text>
                </Card>
              )
            })}
          </SimpleGrid>
        </Container>
      </Box>

      <BackgroundImage
        src={images.skyline.src}
        mih={{ base: 420, md: 440 }}
        pos="relative"
        style={{ backgroundPosition: "center" }}
      >
        <Overlay color="#0a0a0a" backgroundOpacity={0.78} zIndex={0} />
        <Container
          size="xl"
          pos="relative"
          py={{ base: 56, md: 72 }}
          style={{ zIndex: 1 }}
        >
          <Grid gutter={40} align="center">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="md">
                <Title
                  order={2}
                  c="white"
                  style={{ textWrap: "balance" as const }}
                >
                  A disciplined approach to ambiguous problems
                </Title>
                <Text c="gray.2" size="lg" lh={1.7}>
                  I combine analytical rigor with facilitation craft—so your
                  teams leave rooms aligned, energized, and clear on the next
                  three moves.
                </Text>
                <Group gap="md" wrap="wrap">
                  <Button
                    component={Link}
                    href="/services"
                    size="md"
                    variant="white"
                    color="dark"
                  >
                    Explore services
                  </Button>
                  <Button
                    component={Link}
                    href="/contact"
                    size="md"
                    variant="outline"
                    color="gray"
                    styles={{
                      root: {
                        borderColor: "rgba(255,255,255,0.45)",
                        color: "white",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" }
                      }
                    }}
                  >
                    Talk with me
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper radius="lg" p="xl" shadow="xl" withBorder>
                <Group
                  justify="space-between"
                  align="flex-start"
                  wrap="nowrap"
                  gap="md"
                >
                  <div>
                    <Text size="sm" c="dimmed" fw={600}>
                      Delivery confidence
                    </Text>
                    <Title order={3} mt={4}>
                      On‑time phases
                    </Title>
                    <Text size="sm" c="dimmed" mt="xs" maw={200}>
                      Milestone plans your teams can track on their own—without
                      a firm on retainer.
                    </Text>
                  </div>
                  <RingProgress
                    size={100}
                    thickness={10}
                    sections={[{ value: 88, color: "meridian.6" }]}
                    label={
                      <Text ta="center" fz="xs" fw={700} c="meridian.8">
                        88%
                      </Text>
                    }
                  />
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </BackgroundImage>

      <Box py={{ base: 56, md: 72 }} px="md" bg="white">
        <Container size="xl">
          <Grid gutter={{ base: "lg", md: 48 }} align="stretch">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Box
                pos="relative"
                h={{ base: 280, md: "100%" }}
                miw={0}
                style={{
                  borderRadius: "var(--mantine-radius-lg)",
                  overflow: "hidden",
                  minHeight: 320,
                  boxShadow: "var(--mantine-shadow-lg)"
                }}
              >
                <Image
                  src={images.workshop.src}
                  alt={images.workshop.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card padding="xl" radius="lg" withBorder shadow="sm" h="100%">
                <Text size="sm" fw={700} c="meridian.7" tt="uppercase">
                  Client voice
                </Text>
                <Title
                  order={3}
                  mt="xs"
                  mb="md"
                  style={{ textWrap: "balance" as const }}
                >
                  “{siteConfig.name} made the invisible work visible—in weeks,
                  not quarters.”
                </Title>
                <Text c="dimmed" lh={1.7} mb="lg">
                  CFO, Series C infrastructure software · Program to reset
                  planning cadence and portfolio governance across 6 product
                  lines.
                </Text>
                <Group
                  justify="space-between"
                  align="center"
                  wrap="wrap"
                  gap="md"
                >
                  <Text size="sm" fw={600}>
                    VP Strategy, Fortune 500 industrial
                  </Text>
                  <Button
                    component={Link}
                    href="/contact"
                    variant="light"
                    color="meridian"
                    radius="md"
                  >
                    See how I can help
                  </Button>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
