"use client"

import { useEffect } from "react"

/** Keep in sync with `react-grab` in apps/web/package.json devDependencies. */
const REACT_GRAB_VERSION = "0.1.32"
const STYLESHEET_HREF = `https://unpkg.com/react-grab@${REACT_GRAB_VERSION}/dist/styles.css`

/**
 * Dev-only: hover UI and ⌘C / Ctrl+C to copy element context for coding agents.
 * Styles load from unpkg so Tailwind v4–built `dist/styles.css` is not piped through this app’s Tailwind v3 PostCSS (which errors on `@layer base`).
 * @see https://react-grab.com
 */
export function ReactGrab() {
  useEffect(() => {
    const id = "react-grab-stylesheet"
    if (!document.getElementById(id)) {
      const link = document.createElement("link")
      link.id = id
      link.rel = "stylesheet"
      link.href = STYLESHEET_HREF
      link.crossOrigin = "anonymous"
      document.head.appendChild(link)
    }
    void import("react-grab")
  }, [])

  return null
}
