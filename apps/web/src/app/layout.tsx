import "#/styles/globals.css"

import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { headers } from "next/headers"
import { cloakSSROnlySecret } from "ssr-only-secrets"
import { ThemeProvider } from "#/providers/theme-provider"
import { TRPCReactProvider } from "#/trpc/react"

export const metadata: Metadata = {
  title: "App Template",
  description: "App Template"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookie = new Headers(await headers()).get("cookie")
  const encryptedCookie = await cloakSSROnlySecret(
    cookie ?? "",
    "SECRET_CLIENT_COOKIE_VAR"
  )
  return (
    <html
      lang="en"
      data-mantine-color-scheme="light"
      data-scroll-behavior="smooth"
      className="scrollbar-thin scrollbar-track-mtn-gray-1 scrollbar-thumb-mtn-gray-4 hover:scrollbar-thumb-mtn-gray-5 active:scrollbar-thumb-mtn-primary-filled h-full"
      suppressHydrationWarning
      suppressContentEditableWarning
    >
      <body
        className="min-h-dvh bg-mtn-gray-1"
        suppressContentEditableWarning
        suppressHydrationWarning
      >
        <TRPCReactProvider ssrOnlySecret={encryptedCookie}>
          <ThemeProvider>{children}</ThemeProvider>
        </TRPCReactProvider>
        {process.env.NODE_ENV === "production" && process.env.VERCEL ? (
          <Analytics />
        ) : null}
      </body>
    </html>
  )
}
