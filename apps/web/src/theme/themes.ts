import type { MantineColorsTuple } from "@repo/mantine-ui"
import {
  createTheme,
  DEFAULT_THEME,
  Fieldset,
  mergeMantineTheme,
  NavLink
} from "@repo/mantine-ui"
import { Figtree } from "next/font/google"

const wine: MantineColorsTuple = [
  "#F5F5F5",
  "#E0E0E0",
  "#BDBDBD",
  "#9E9E9E",
  "#757575",
  "#393939",
  "#2D2D2D",
  "#212121",
  "#151515",
  "#0A0A0A"
] as const

const sans = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
})

let defaultTheme = createTheme({
  fontFamily: sans.style.fontFamily,
  cursorType: "pointer",
  primaryColor: "wine",
  colors: {
    wine
  },
  components: {
    NavLink: NavLink.extend({
      defaultProps: {
        classNames: {
          root: "p-0 py-2 rounded-md overflow-hidden",
          section:
            "w-[40px] flex items-centerdata-[position=right]:lg:flex data-[position=right]:justify-end data-[position=right]:w-[16px] data-[position=right]:mr-2 justify-center mx-0",
          label: "opacity-100 ml-2 text-[16px]",
          children: "opacity-100 block",
          chevron: "opacity-100 block"
        }
      }
    }),
    FieldSet: Fieldset.extend({
      defaultProps: {
        classNames: {
          root: "asdasd"
        }
      }
    })
  }
})

defaultTheme = mergeMantineTheme(DEFAULT_THEME, defaultTheme)

export { defaultTheme }
