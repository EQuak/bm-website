import { aclsRolesSchema, profilesSchema } from "@repo/db/schema"
import { TRPCError } from "@trpc/server"
import { z } from "zod/v4"

import {
  checkEmailExists,
  createProfile,
  getAllProfiles,
  getAllProfilesAlphabetically,
  getAllProfilesByRoleSlug,
  getLatestUserProfile,
  getPendingInviteProfiles,
  getProfileById,
  getProfileByProfileId,
  getProfileByUserId,
  getProfilesWithSearchAndFiltersInfinite,
  inviteUserToOrganization,
  updateProfile
} from "../funcs/profiles.funcs"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { isEffectivePlatformStaff } from "../utils/platform-staff"
import { assertUserInOrganization } from "./org-membership"

const organizationIdInput = z.object({
  organizationId: z.string().uuid()
})

const handleError = (functionName: string, error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error(
    `Error in ${functionName}: ` + JSON.stringify(errorMessage, null, 2)
  )
  throw error
}

export const profilesRouter = createTRPCRouter({
  /** Post-login bootstrap: latest profile (any org) for redirect to `/app/{slug}/…`. */
  getSessionWorkspace: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getLatestUserProfile(ctx.db, ctx.user.id)
    } catch (error) {
      return handleError("getSessionWorkspace", error)
    }
  }),

  getAllProfiles: protectedProcedure
    .input(organizationIdInput)
    .query(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        return await getAllProfiles(ctx.db, input)
      } catch (error) {
        return handleError("getAllProfiles", JSON.stringify(error, null, 2))
      }
    }),

  getPendingInviteProfiles: protectedProcedure
    .input(organizationIdInput)
    .query(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        return await getPendingInviteProfiles(ctx.db, input)
      } catch (error) {
        return handleError("getPendingInviteProfiles", error)
      }
    }),

  getAllProfilesAlphabetically: protectedProcedure
    .input(organizationIdInput)
    .query(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        return await getAllProfilesAlphabetically(ctx.db, input)
      } catch (error) {
        return handleError(
          "getAllProfilesAlphabetically",
          JSON.stringify(error, null, 2)
        )
      }
    }),

  getProfilesWithSearchAndFiltersInfinite: protectedProcedure
    .input(
      organizationIdInput.extend({
        searchText: z.string().optional(),
        roleSlug: z.string().optional(),
        limit: z.number().optional(),
        cursor: z.number().optional(),
        inactive: z.boolean().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        return await getProfilesWithSearchAndFiltersInfinite(ctx.db, input)
      } catch (error) {
        handleError("getProfilesWithSearchAndFiltersInfinite", error)
      }
    }),

  getAllProfilesByRoleSlug: protectedProcedure
    .input(
      organizationIdInput.extend({
        roleSlug: aclsRolesSchema.select.shape.slug
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        return await getAllProfilesByRoleSlug(ctx.db, input)
      } catch (error) {
        return handleError("getAllProfilesByRoleSlug", error)
      }
    }),

  getProfileById: protectedProcedure
    .input(
      organizationIdInput.extend({
        id: profilesSchema.select.shape.id
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        return await getProfileById(ctx.db, ctx.supabase, input)
      } catch (error) {
        return handleError("getProfileById", error)
      }
    }),

  getProfileByUserId: protectedProcedure
    .input(
      organizationIdInput.extend({
        userId: z.string().uuid()
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        return await getProfileByUserId(ctx.db, input)
      } catch (error) {
        return handleError("getProfileByUserId", error)
      }
    }),

  getProfileByUserLogged: protectedProcedure
    .input(organizationIdInput)
    .query(async ({ ctx, input }) => {
      try {
        const cookieHeader = ctx.headers.get("cookie") ?? ""
        const impersonationMatch = cookieHeader.match(
          /dev_impersonation=([^;]+)/
        )

        if (impersonationMatch) {
          const cookieValue = decodeURIComponent(impersonationMatch[1] ?? "")
          const [realUserId, impersonatedProfileId] = cookieValue.split(":")

          if (realUserId === ctx.user.id && impersonatedProfileId) {
            const impersonatedProfile = await getProfileByProfileId(ctx.db, {
              id: impersonatedProfileId
            })
            if (impersonatedProfile) {
              if (impersonatedProfile.organizationId === input.organizationId) {
                return impersonatedProfile
              }
              if (isEffectivePlatformStaff(ctx)) {
                return impersonatedProfile
              }
            }
          }
        }

        let profile = await getProfileByUserId(ctx.db, {
          userId: ctx.user.id,
          organizationId: input.organizationId
        })

        if (!profile && isEffectivePlatformStaff(ctx)) {
          profile = await getLatestUserProfile(ctx.db, ctx.user.id)
        }

        if (!profile) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not a member of this organization."
          })
        }
        return profile
      } catch (error) {
        if (error instanceof TRPCError) throw error
        return handleError("getProfileByUserLogged", error)
      }
    }),

  getRealProfile: protectedProcedure
    .input(organizationIdInput)
    .query(async ({ ctx, input }) => {
      try {
        return await getProfileByUserId(ctx.db, {
          userId: ctx.user.id,
          organizationId: input.organizationId
        })
      } catch (error) {
        return handleError("getRealProfile", error)
      }
    }),

  checkEmailExists: protectedProcedure
    .input(
      organizationIdInput.extend({
        email: z.string().email()
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        return await checkEmailExists(ctx.db, input)
      } catch (error) {
        return handleError("checkEmailExists", error)
      }
    }),

  createProfile: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        sendEmail: z.boolean(),
        appUrl: z.string().url(),
        organizationId: z.string().uuid(),
        profile: profilesSchema.insert.omit({
          userId: true,
          organizationId: true,
          preferences: true
        })
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        const { email, password, sendEmail, appUrl, organizationId, profile } =
          input
        return await createProfile(ctx.db, {
          email,
          password,
          sendEmail,
          appUrl,
          profile: {
            ...profile,
            organizationId
          }
        })
      } catch (error) {
        return handleError("createProfile", error)
      }
    }),

  inviteUser: protectedProcedure
    .input(
      z.object({
        organizationId: z.string().uuid(),
        appUrl: z.string().url(),
        email: z.string().email(),
        firstName: profilesSchema.insert.shape.firstName,
        lastName: profilesSchema.insert.shape.lastName,
        phone: z.string().trim().optional(),
        aclRole: z.string().min(1, "Role is required")
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        return await inviteUserToOrganization(ctx.db, ctx.supabaseAdmin, input)
      } catch (error) {
        return handleError("inviteUser", error)
      }
    }),

  updateProfile: protectedProcedure
    .input(
      organizationIdInput.extend({
        where: z.object({
          id: profilesSchema.select.shape.id
        }),
        data: profilesSchema.update
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await assertUserInOrganization(
          ctx.db,
          ctx.user.id,
          input.organizationId,
          {
            isPlatformStaff: isEffectivePlatformStaff(ctx),
            cookieHeader: ctx.headers.get("cookie")
          }
        )
        const { organizationId, where, data } = input
        return await updateProfile(ctx.db, { where, organizationId, data })
      } catch (error) {
        return handleError("updateProfile", error)
      }
    })
})
