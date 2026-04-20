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
import { useRef, useState } from "react"
import type ReCAPTCHA from "react-google-recaptcha"
import { MarketingFirstSection } from "#/components/site/MarketingFirstSection"
import { MarketingHeroContainer } from "#/components/site/MarketingHeroContainer"
import { siteConfig } from "#/core/config/site"
import { env } from "#/env"
import { images } from "#/lib/consulting-images"
import { FormReCaptcha } from "./_components/FormReCaptcha"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [_captchaResetKey, setCaptchaResetKey] = useState(0)

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      company: "",
      message: ""
    },
    validate: {
      name: (v) => (v.trim().length < 2 ? "Please enter your name" : null),
      email: (v) =>
        /^\S+@\S+\.\S+$/.test(v) ? null : "Enter a valid email address",
      message: (v) =>
        v.trim().length < 20
          ? "Please share a bit more detail (20+ characters)"
          : null
    }
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const siteKey =
    env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ??
    (typeof process !== "undefined" &&
      (process.env as Record<string, string>).NEXT_PUBLIC_RECAPTCHA_SITE_KEY)

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
              Start with the vision—and what’s getting in the way
            </Title>
            <Text size="lg" c="gray.3" lh={1.7} maw={640}>
              Share the owner’s vision, what’s working, and what’s not. I’ll
              follow up within two business days with next steps—or a candid
              note if I’m not the right fit.
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
              onSubmit={form.onSubmit(async (values) => {
                setIsSubmitting(true)
                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values)
                  })

                  if (!res.ok) {
                    const data = (await res.json().catch(() => null)) as {
                      error?: {
                        message?: string
                        fieldErrors?: Record<string, string | undefined>
                      }
                    } | null

                    const fieldErrors = data?.error?.fieldErrors
                    if (fieldErrors) {
                      form.setErrors({
                        name: fieldErrors.name ?? null,
                        email: fieldErrors.email ?? null,
                        company: fieldErrors.company ?? null,
                        message: fieldErrors.message ?? null,
                        captchaToken: fieldErrors.captchaToken ?? null
                      })
                    }

                    showNotification({
                      title: "Couldn’t send your message",
                      message:
                        data?.error?.message ??
                        "Please review the form and try again.",
                      color: "red"
                    })
                    return
                  }

                  showNotification({
                    title: "Message sent",
                    message:
                      "Thanks — I’ll follow up within two business days.",
                    color: "meridian"
                  })
                  form.reset()
                  setCaptchaResetKey((k) => k + 1)
                } catch {
                  showNotification({
                    title: "Network error",
                    message: "Please try again in a moment.",
                    color: "red"
                  })
                } finally {
                  setIsSubmitting(false)
                }
              })}
            >
              <Stack gap="md">
                <TextInput
                  label="Name"
                  placeholder="Alex Rivera"
                  required
                  disabled={isSubmitting}
                  {...form.getInputProps("name")}
                />
                <TextInput
                  label="Work email"
                  placeholder="you@company.com"
                  required
                  type="email"
                  disabled={isSubmitting}
                  {...form.getInputProps("email")}
                />
                <TextInput
                  label="Company"
                  placeholder="Organization or team"
                  disabled={isSubmitting}
                  {...form.getInputProps("company")}
                />
                <Textarea
                  label="What should we know?"
                  placeholder="Owner vision, current reality, what’s working, what’s not, and what success looks like."
                  minRows={5}
                  required
                  disabled={isSubmitting}
                  {...form.getInputProps("message")}
                />

                {siteKey && (
                  <FormReCaptcha
                    ref={recaptchaRef}
                    siteKey={siteKey}
                    onToken={(token) => {
                      form.setFieldValue("captchaToken", token)
                      form.setFieldError("captchaToken", null)
                    }}
                  />
                )}
                <Button
                  type="submit"
                  size="md"
                  radius="md"
                  fullWidth
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
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
