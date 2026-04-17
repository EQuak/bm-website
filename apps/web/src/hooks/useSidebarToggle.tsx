import { useDisclosure } from "@repo/mantine-ui"
import { useEffect } from "react"

const BREAKPOINT = 1024

export function useSidebarToggle(initialState: boolean) {
  const [sidebarIsOpen, sidebarHandlers] = useDisclosure(initialState)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= BREAKPOINT) {
        if (sidebarIsOpen) {
          sidebarHandlers.close()
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [sidebarIsOpen, sidebarHandlers])

  return { sidebarIsOpen, sidebarHandlers }
}
