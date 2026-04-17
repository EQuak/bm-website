"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useStore } from "zustand"
import { LoaderSkeleton } from "#/core/components/LoaderSkeleton"
import type { ThemeState, ThemeStore } from "#/stores/theme-store"
import { createThemeStore } from "#/stores/theme-store"

export type ThemeStoreApi = ReturnType<typeof createThemeStore>

export const ThemeStoreContext = createContext<ThemeStoreApi | undefined>(
  undefined
)

export interface ThemeStoreProviderProps {
  children: ReactNode
}

export const ThemeStoreProvider = ({ children }: ThemeStoreProviderProps) => {
  const storeRef = useRef<ThemeStoreApi>(null)
  const [isLoading, setIsLoading] = useState(true)

  const initThemeStore = {
    sidebarState: "initial",
    headerState: "initial"
  } satisfies ThemeState

  if (!storeRef.current) {
    storeRef.current = createThemeStore({ init: initThemeStore })
  }

  const themeStore = storeRef.current

  useEffect(() => {
    const handleSidebarState = () => {
      if (window.innerWidth > 1023) {
        themeStore.setState({ sidebarState: "full" })
        return
      }
      if (window.innerWidth > 768 && window.innerWidth < 1024) {
        themeStore.setState({ sidebarState: "collapsed" })
        return
      }

      themeStore.setState({ sidebarState: "hidden" })
      return
    }

    const handleHeaderState = () => {
      if (window.innerWidth > 1023) {
        themeStore.setState({ headerState: "hidden" })
        return
      }

      if (window.scrollY < 20) {
        themeStore.setState({ headerState: "top" })
        return
      }

      themeStore.setState({ headerState: "scrolled" })
    }

    const handleEvents = () => {
      handleSidebarState()
      handleHeaderState()
    }

    handleEvents()
    setIsLoading(false)

    window.addEventListener("resize", handleEvents)
    window.addEventListener("scroll", handleEvents)

    return () => {
      window.removeEventListener("resize", handleEvents)
      window.removeEventListener("scroll", handleEvents)
    }
  }, [themeStore])

  if (isLoading) {
    return <LoaderSkeleton />
  }

  return (
    <ThemeStoreContext.Provider value={themeStore}>
      {children}
    </ThemeStoreContext.Provider>
  )
}

export const useThemeStore = <T,>(selector: (store: ThemeStore) => T): T => {
  const themeStoreContext = useContext(ThemeStoreContext)

  if (!themeStoreContext) {
    throw new Error(`useThemeStore must be used within ThemeStoreProvider`)
  }

  return useStore(themeStoreContext, selector)
}
