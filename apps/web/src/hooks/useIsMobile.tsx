import { useLayoutEffect, useState } from "react"

/**
 * Hook to detect if the current viewport is mobile-sized
 * @param breakpoint - Width in pixels below which is considered mobile (default: 500)
 * @returns boolean indicating if viewport is mobile-sized
 */
export const useIsMobile = (breakpoint = 500): boolean => {
  const [isMobile, setIsMobile] = useState(false)

  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= breakpoint)

    checkMobile() // Run on mount
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [breakpoint])

  return isMobile
}
