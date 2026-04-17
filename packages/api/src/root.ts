import { aclsRolesRouter } from "./router/acls_roles.router"
import { authRouter } from "./router/auth.router"
import { organizationsRouter } from "./router/organizations.router"
import { platformRouter } from "./router/platform.router"
import { profilesRouter } from "./router/profiles.router"
import { systemSettingsRouter } from "./router/system/system_settings.router"
import { createTRPCRouter, publicProcedure } from "./trpc"

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return "Hello, world!"
  }),
  profiles: profilesRouter,
  platform: platformRouter,
  organizations: organizationsRouter,
  auth: authRouter,
  aclsRoles: aclsRolesRouter,
  system: {
    settings: systemSettingsRouter
  }
})

// export type definition of API
export type AppRouter = typeof appRouter
