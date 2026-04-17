import type { MantineColorsTuple } from "@repo/mantine-ui"
import {
  createTheme,
  DEFAULT_THEME,
  mergeMantineTheme,
  NavLink
} from "@repo/mantine-ui"
import { Plus_Jakarta_Sans } from "next/font/google"

/**
 * Brand accent — matches the live BM mark: red rule (#dc2626) on black.
 * `meridian.6` is the stripe red; `meridian.9` is near‑black for dark bands.
 */
const meridian: MantineColorsTuple = [
  "#fff5f5",
  "#fee2e2",
  "#fecaca",
  "#fca5a5",
  "#f87171",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#7f1d1d",
  "#0a0a0a"
] as const

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

let defaultTheme = createTheme({
  fontFamily: sans.style.fontFamily,
  headings: {
    fontFamily: sans.style.fontFamily,
    fontWeight: "600",
    sizes: {
      h1: { fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: "1.15" },
      h2: { fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: "1.25" },
      h3: { fontSize: "1.25rem", lineHeight: "1.35" }
    }
  },
  cursorType: "pointer",
  primaryColor: "meridian",
  defaultRadius: "md",
  colors: {
    meridian
  },
  components: {
    NavLink: NavLink.extend({
      defaultProps: {
        classNames: {
          root: "rounded-lg",
          section: "data-[position=left]:mr-2",
          label: "font-medium"
        }
      }
    })
  }
})

defaultTheme = mergeMantineTheme(DEFAULT_THEME, defaultTheme)

export { defaultTheme }
