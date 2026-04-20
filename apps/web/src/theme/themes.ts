import type { MantineColorsTuple } from "@repo/mantine-ui"
import {
  createTheme,
  DEFAULT_THEME,
  mergeMantineTheme,
  NavLink
} from "@repo/mantine-ui"
import { Plus_Jakarta_Sans } from "next/font/google"

/**
 * Brand accent — matched to `public/bm-logo.png` (navy + mid blue + blue-gray).
 * `meridian.6` is the primary accent; `meridian.9` is the deep navy for dark bands.
 */
const meridian: MantineColorsTuple = [
  "#f2f6fb",
  "#e6eef8",
  "#c9d9ef",
  "#a9c2e6",
  "#7fa3d6",
  "#5e89c8",
  "#2f6fb3",
  "#1f5591",
  "#143b66",
  "#0b2d5c"
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
