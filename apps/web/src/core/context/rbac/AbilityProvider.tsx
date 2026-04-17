"use client"

import { useMemo } from "react"

import { useApp } from "../AppContext"
import { userAbility } from "./ability"
import { AbilityContext } from "./RBACContext"

export const AbilityProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { profile, permissions, customPermissions, isPlatformStaff } = useApp()

  const ability = useMemo(
    () =>
      userAbility({
        isPlatformStaff,
        aclRole: {
          roleSlug: profile.aclRole,
          permissions: permissions ?? []
        },
        aclCustomPermissions: customPermissions
      }),
    [isPlatformStaff, permissions, customPermissions, profile.aclRole]
  )
  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}
