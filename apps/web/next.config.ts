import type { NextConfig } from "next"

const config: NextConfig = {
  reactStrictMode: true,
  compress: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@repo/tailwind", "@repo/mantine-ui", "@repo/api"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { hostname: "127.0.0.1" },
      { hostname: "localhost" }
    ]
  },
  experimental: {
    authInterrupts: true,
    browserDebugInfoInTerminal: true
  },
  /** We already do linting and typechecking as separate tasks in CI */
  typescript: { ignoreBuildErrors: true }
}

export default config
