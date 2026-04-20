"use client"

import { Box, Text } from "@repo/mantine-ui"
import Script from "next/script"
import { useEffect, useId, useRef, useState } from "react"

import { env } from "#/env"

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: string | HTMLElement,
        parameters: {
          sitekey: string
          callback?: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: () => void
          theme?: "light" | "dark"
          size?: "normal" | "compact"
        }
      ) => number
      reset: (opt_widget_id?: number) => void
      ready?: (cb: () => void) => void
    }
  }
}

type CaptchaWidgetProps = {
  /** Called when a new token is issued */
  onToken: (token: string) => void
  /** Called when token expires or widget errors */
  onInvalid: (reason: "expired" | "error") => void
  /** Inline error message to display under the widget */
  error?: string | null
  /** Disable interaction (e.g. while submitting) */
  disabled?: boolean
  /** Bump this to force a reset after submit */
  resetKey?: string | number
}

export function CaptchaWidget({
  onToken,
  onInvalid,
  error,
  disabled,
  resetKey
}: CaptchaWidgetProps) {
  const containerId = useId()
  const [isReady, setIsReady] = useState(false)
  const widgetIdRef = useRef<number | null>(null)
  const [, setWidgetId] = useState<number | null>(null)

  const onTokenRef = useRef(onToken)
  const onInvalidRef = useRef(onInvalid)

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    onInvalidRef.current = onInvalid
  }, [onInvalid])

  useEffect(() => {
    const grecaptcha = window.grecaptcha
    if (!isReady || !grecaptcha || typeof grecaptcha.render !== "function")
      return

    const container = document.getElementById(containerId)
    if (!container) return

    // Guard against React dev/StrictMode double-effects and re-renders.
    if (widgetIdRef.current !== null) return

    const id = grecaptcha.render(container, {
      sitekey: env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      theme: "light",
      callback: (token) => onTokenRef.current(token),
      "expired-callback": () => onInvalidRef.current("expired"),
      "error-callback": () => onInvalidRef.current("error")
    })

    widgetIdRef.current = id
    setWidgetId(id)

    return () => {
      try {
        // In StrictMode, this cleanup runs between the double-invoked effects.
        // Reset + clear container so re-rendering into the same element is safe.
        grecaptcha.reset(id)
      } catch {
        // ignore
      }
      widgetIdRef.current = null
      setWidgetId(null)
      if (container) container.innerHTML = ""
    }
  }, [containerId, isReady])

  useEffect(() => {
    const grecaptcha = window.grecaptcha
    if (!grecaptcha || typeof grecaptcha.reset !== "function") return
    if (widgetIdRef.current === null) return
    grecaptcha.reset(widgetIdRef.current)
  }, [resetKey])

  return (
    <Box>
      <Script
        src="https://www.google.com/recaptcha/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setIsReady(true)}
      />
      <Box
        id={containerId}
        style={{
          minHeight: 66,
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? "none" : "auto"
        }}
      />
      {error ? (
        <Text size="sm" c="red" mt={6}>
          {error}
        </Text>
      ) : null}
    </Box>
  )
}
