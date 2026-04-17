"use client"

import { useContext } from "react"

import { AbilityContext } from "./RBACContext"

export const useRBAC = () => {
  if (typeof AbilityContext === "undefined") {
    throw new Error("useRBAC must be used within an AbilityProvider")
  }

  return useContext(AbilityContext)
}
