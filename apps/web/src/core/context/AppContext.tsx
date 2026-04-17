"use client"

import type { RouterOutputs } from "@repo/api"
import type { Action, ModuleKey } from "@repo/db/acl"
import { createContext, useContext, useMemo } from "react"

import { api } from "#/trpc/react"
import { AbilityProvider } from "./rbac/AbilityProvider"

interface AppContextType {
  orgSlug: string
  organizationId: string
  profile: NonNullable<RouterOutputs["profiles"]["getProfileByUserLogged"]>
  /** Supabase `app_metadata.platform_staff` or PLATFORM_STAFF_USER_IDS */
  isPlatformStaff: boolean
  isBetaUser: boolean
  permissions: RouterOutputs["aclsRoles"]["getAclsRolesPermissions"]
  customPermissions: {
    moduleKey: ModuleKey
    actions: Partial<Record<Action, boolean>>
  }[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({
  children,
  orgSlug,
  organizationId
}: {
  children: React.ReactNode
  orgSlug: string
  organizationId: string
}) {
  const [profile] = api.profiles.getProfileByUserLogged.useSuspenseQuery(
    { organizationId },
    {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 60, // 1 hour - prevent refetches
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false
    }
  )

  const [platformAccess] = api.platform.getAccess.useSuspenseQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })

  const value = useMemo(
    () => ({
      orgSlug,
      organizationId,
      profile: profile!,
      isPlatformStaff: platformAccess.isPlatformStaff,
      isBetaUser: !!profile?.preferences?.app.beta_features,
      permissions: profile?._aclRole._permissions,
      customPermissions: profile?.aclCustomPermissions ?? []
    }),
    [orgSlug, organizationId, platformAccess.isPlatformStaff, profile]
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
