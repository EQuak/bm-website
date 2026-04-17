import type { CSSProperties } from "react"

export const iconStyle: CSSProperties = {
  mixBlendMode: "multiply"
}
export interface ErrorLogoProps {
  height?: number
  width?: number
  fill?: string
  title?: string
}

// error logos
export * from "./400-logo"
export * from "./401-logo"
export * from "./403-logo"
export * from "./404-logo"
export * from "./408-logo"
export * from "./429-logo"
export * from "./500-logo"
export * from "./502-logo"
export * from "./503-logo"
export * from "./504-logo"

// logos
export * from "./item-image-placeholder"
export * from "./logo"
