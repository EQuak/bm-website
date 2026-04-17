"use client"

import dynamic from "next/dynamic"

const ReactGrabLazy = dynamic(
  () =>
    import("#/components/dev/ReactGrab").then((m) => ({
      default: m.ReactGrab
    })),
  { ssr: false }
)

/** Loads react-grab in the browser during `next dev` only. */
export function DevReactGrabRoot() {
  if (process.env.NODE_ENV !== "development") {
    return null
  }
  return <ReactGrabLazy />
}
