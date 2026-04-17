import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Logo lab",
  robots: { index: false, follow: false }
}

export default function LogoLabLayout({ children }: { children: ReactNode }) {
  return children
}
