import { useEffect, useState } from "react"

export function useIsScrolledOverY({ y }: { y: number }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > y)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [y])

  return scrolled
}
