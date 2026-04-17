"use client"

import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  showNotification,
  Text,
  Textarea,
  TextInput,
  Title,
  useForm
} from "@repo/mantine-ui"
import {
  IconBrandLinkedin,
  IconMail,
  IconMapPin,
  IconPhone
} from "@repo/mantine-ui/icons/index"
import Link from "next/link"
import { MarketingFirstSection } from "#/components/site/MarketingFirstSection"
import { MarketingHeroContainer } from "#/components/site/MarketingHeroContainer"
import { siteConfig } from "#/core/config/site"
import { images } from "#/lib/consulting-images"

export default function ContactPage() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      company: "",
      message: ""
    },
    validate: {
      name: (v) => (v.trim().length < 2 ? "Please enter your name" : null),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Valid email required"),
      message: (v) =>
        v.trim().length < 12 ? "Tell us a bit more (12+ characters)" : null
    }
  })

  return (
    <Stack component="article" gap={0} w="100%" maw="100%" bg="gray.0">
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
              Contact
            </Badge>
            <Title
              order={1}
              fz={{ base: "2rem", md: "2.65rem" }}
              style={{ textWrap: "balance" as const }}
            >
              Let&apos;s start with the problem—not the proposal
            </Title>
            <Text size="lg" c="gray.3" lh={1.7} maw={640}>
              Share context on what you are trying to change. I&apos;ll follow
              up within two business days with next steps—or a candid note if
              I&apos;m not the right fit.
            </Text>
          </Stack>
        </MarketingHeroContainer>
      </MarketingFirstSection>

      <Container size="xl" py={{ base: 48, md: 72 }} px="md" mx="auto" w="100%">
        <Grid gutter={{ base: 32, md: 48 }} align="center">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper
              radius="lg"
              p={0}
              withBorder
              shadow="lg"
              style={{ overflow: "hidden" }}
            >
              <Box
                pos="relative"
                h={{ base: 220, sm: 260 }}
                style={{
                  backgroundImage: `url(${images.handshake.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />
              <Stack gap="lg" p="xl">
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Direct
                  </Text>
                  <Button
                    component="a"
                    href={`mailto:${siteConfig.email}`}
                    variant="subtle"
                    color="meridian"
                    px={0}
                    leftSection={<IconMail size={18} />}
                  >
                    {siteConfig.email}
                  </Button>
                </div>
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Phone
                  </Text>
                  <Text fw={500}>
                    <IconPhone
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: 8 }}
                    />
                    {siteConfig.phone}
                  </Text>
                </div>
                <div>
                  <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                    Location
                  </Text>
                  <Text size="sm" lh={1.6}>
                    <IconMapPin
                      size={16}
                      style={{ verticalAlign: "top", marginRight: 8 }}
                    />
                    {siteConfig.address.line1}
                    {siteConfig.address.line2 ? (
                      <>
                        <br />
                        {siteConfig.address.line2}
                      </>
                    ) : null}
                    <br />
                    {[
                      siteConfig.address.city,
                      siteConfig.address.region,
                      siteConfig.address.postal
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                </div>
                <Button
                  component={Link}
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  variant="light"
                  color="meridian"
                  leftSection={<IconBrandLinkedin size={18} />}
                >
                  Connect on LinkedIn
                </Button>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper
              component="form"
              radius="lg"
              p={{ base: "lg", md: "xl" }}
              withBorder
              shadow="sm"
              onSubmit={form.onSubmit(() => {
                showNotification({
                  title: "Thanks — I received your note",
                  message:
                    "This demo site does not send email yet. Wire your API route or Resend integration here.",
                  color: "meridian"
                })
                form.reset()
              })}
            >
              <Stack gap="md">
                <TextInput
                  label="Name"
                  placeholder="Alex Rivera"
                  required
                  {...form.getInputProps("name")}
                />
                <TextInput
                  label="Work email"
                  placeholder="you@company.com"
                  required
                  type="email"
                  {...form.getInputProps("email")}
                />
                <TextInput
                  label="Company"
                  placeholder="Organization or team"
                  {...form.getInputProps("company")}
                />
                <Textarea
                  label="What should we know?"
                  placeholder="Context, timing, stakeholders, and what success looks like."
                  minRows={5}
                  required
                  {...form.getInputProps("message")}
                />
                <Button type="submit" size="md" radius="md" fullWidth>
                  Send message
                </Button>
                <Text size="xs" c="dimmed">
                  By submitting, you agree I may store your details to respond
                  to this inquiry.
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </Stack>
  )
}
