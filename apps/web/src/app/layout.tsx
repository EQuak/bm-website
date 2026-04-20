import "#/styles/globals.css"

import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"

import { DevReactGrabRoot } from "#/components/dev/DevReactGrabRoot"
import { siteConfig } from "#/core/config/site"
import { ThemeProvider } from "#/providers/theme-provider"
import { TRPCReactProvider } from "#/trpc/react"

const metadataBase = siteConfig.url?.startsWith("http")
  ? new URL(siteConfig.url)
  : new URL("http://localhost:3000")

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: [{ url: "/bm-logo-cropped.png", type: "image/png" }],
    apple: [{ url: "/bm-logo-cropped.png", type: "image/png" }]
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    siteName: siteConfig.name,
    images: [
      {
        url: "/bm-logo-cropped.png",
        width: 820,
        height: 520,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.tagline,
    images: ["/bm-logo-cropped.png"]
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
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
        <TRPCReactProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TRPCReactProvider>
        <DevReactGrabRoot />
        {process.env.NODE_ENV === "production" && process.env.VERCEL ? (
          <Analytics />
        ) : null}
      </body>
    </html>
  )
}
