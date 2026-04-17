"use client"

import type { CardProps } from "@repo/mantine-ui"
import { Card } from "@repo/mantine-ui"
import { cn } from "@repo/mantine-ui/utils/cn"

export default function Layout({
  children,
  cardProps
}: {
  children: React.ReactNode
  cardProps?: CardProps
}) {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-mtn-gray-1 p-3 sm:p-4">
      <Card
        padding="xl"
        radius="lg"
        withBorder
        {...cardProps}
        className={cn(
          "w-full max-w-[440px] border-mtn-gray-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)]",
          cardProps?.className
        )}
      >
        {children}
      </Card>
    </main>
  )
}
