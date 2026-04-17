"use client"

import { Container, type ContainerProps } from "@repo/mantine-ui"
import type { ReactNode } from "react"

export type MarketingHeroContainerProps = Omit<
  ContainerProps,
  "size" | "px"
> & {
  children: ReactNode
}

/**
 * One horizontal grid for every marketing hero: `size="xl"` + `px="md"`.
 * Keeps lead pills and titles aligned with the home and services image heroes.
 */
export function MarketingHeroContainer({
  children,
  ...props
}: MarketingHeroContainerProps) {
  return (
    <Container size="xl" px="md" {...props}>
      {children}
    </Container>
  )
}
