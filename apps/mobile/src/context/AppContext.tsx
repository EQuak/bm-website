"use client"

import type { RouterOutputs } from "@repo/api"
import type { Action, ModuleKey } from "@repo/db/acl"
import { createContext, useContext, useMemo } from "react"

import { api } from "#/trpc/react"
import { AbilityProvider } from "./rbac/AbilityProvider"

type SessionProfile = NonNullable<
  RouterOutputs["profiles"]["getSessionWorkspace"]
>

interface AppContextType {
  organizationId: string
  profile: SessionProfile
  isPlatformStaff: boolean
  isBetaUser: boolean
  permissions: RouterOutputs["aclsRoles"]["getAclsRolesPermissions"]
  customPermissions: {
    moduleKey: ModuleKey
    actions: Partial<Record<Action, boolean>>
  }[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile] = api.profiles.getSessionWorkspace.useSuspenseQuery(
    undefined,
    {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 15
    }
  )

  const [platformAccess] = api.platform.getAccess.useSuspenseQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })

  if (!profile) {
    throw new Error("AppProvider: no profile for signed-in user")
  }

  const organizationId = profile.organizationId

  const value = useMemo(
    () => ({
      organizationId,
      profile,
      isPlatformStaff: platformAccess.isPlatformStaff,
      isBetaUser: !!profile.preferences?.app.beta_features,
      permissions: profile._aclRole._permissions,
      customPermissions: profile.aclCustomPermissions ?? []
    }),
    [organizationId, platformAccess.isPlatformStaff, profile]
  )

  return (
    <AppContext.Provider value={value}>
      <AbilityProvider>{children}</AbilityProvider>
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
