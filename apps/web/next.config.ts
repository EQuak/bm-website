import type { NextConfig } from "next"

const config: NextConfig = {
  reactStrictMode: true,
  compress: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@repo/tailwind",
    "@repo/mantine-ui",
    "@repo/db",
    "@repo/api"
  ],

  images: {
    remotePatterns: [
      { hostname: "randomuser.me" },
      { hostname: "cwergvogslzhnsjhfofx.supabase.co" },
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
