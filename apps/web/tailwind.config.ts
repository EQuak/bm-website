import mantinePreset from "@repo/mantine-ui/tailwind.config"
import type { Config } from "tailwindcss"

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  presets: [mantinePreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/mantine-ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [require("tailwind-scrollbar")]
} satisfies Config
