import { createStore } from "zustand/vanilla"

export type ThemeState = {
  sidebarState: "full" | "collapsed" | "hidden" | "initial"
  headerState: "top" | "scrolled" | "hidden" | "initial"
}

export type ThemeActions = {
  setSidebarState: (state: "full" | "collapsed" | "hidden") => void
  setHeaderState: (state: "top" | "scrolled" | "hidden") => void
}

export type ThemeStore = ThemeState & ThemeActions

export const initThemeStore = (): ThemeState => {
  return {
    sidebarState: "initial",
    headerState: "initial"
  }
}

export const createThemeStore = ({ init }: { init: ThemeState }) => {
  return createStore<ThemeStore>((set) => ({
    sidebarState: init.sidebarState,
    headerState: init.headerState,
    setSidebarState: (state: "full" | "collapsed" | "hidden") =>
      set({ sidebarState: state }),
    setHeaderState: (state: "top" | "scrolled" | "hidden") =>
      set({ headerState: state })
  }))
}
