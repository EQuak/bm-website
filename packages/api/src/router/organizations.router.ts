import { TRPCError } from "@trpc/server"
import { z } from "zod/v4"

import { resolveWorkspaceOrganizationId } from "../funcs/organizations.funcs"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { isEffectivePlatformStaff } from "../utils/platform-staff"

const handleError = (functionName: string, error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error(
    `Error in ${functionName}: ` + JSON.stringify(errorMessage, null, 2)
  )
  throw error
}

export const organizationsRouter = createTRPCRouter({
  /**
   * Resolves URL slug → organization id (member must belong to org; platform staff: any slug).
   */
  resolveMemberOrganizationId: protectedProcedure
    .input(z.object({ organizationSlug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        const organizationId = await resolveWorkspaceOrganizationId(ctx.db, {
          userId: ctx.user.id,
          slug: input.organizationSlug,
          isPlatformStaff: isEffectivePlatformStaff(ctx),
          cookieHeader: ctx.headers.get("cookie")
        })
        if (!organizationId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have access to this workspace."
          })
        }
        return { organizationId }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        return handleError("resolveMemberOrganizationId", error)
      }
    })
})
