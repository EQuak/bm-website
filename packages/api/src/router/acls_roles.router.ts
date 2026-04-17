import type { ModuleKey } from "@repo/db/acl"
import { aclsRolesSchema } from "@repo/db/schema"
import { z } from "zod/v4"

import {
  addAclsRole,
  createAclsRolePermissions,
  getAclsRoleBySlug,
  getAclsRoles,
  getAclsRolesPermissions,
  updateAclsRolePermissions
} from "../funcs/acls_roles.funcs"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { handleError } from "../utils/handleError"

export const aclsRolesRouter = createTRPCRouter({
  getAclsRoleBySlug: protectedProcedure
    .input(z.object({ slug: aclsRolesSchema.select.shape.slug }))
    .query(async ({ ctx, input }) => {
      try {
        return await getAclsRoleBySlug(ctx.db, input)
      } catch (error) {
        handleError("getAclsRoleBySlug", error)
      }
    }),
  addAclsRole: protectedProcedure
    .input(aclsRolesSchema.insert)
    .mutation(async ({ ctx, input }) => {
      try {
        return await addAclsRole(ctx.db, input)
      } catch (error) {
        handleError("addAclsRole", error)
      }
    }),
  getAllAclsRoles: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getAclsRoles(ctx.db)
    } catch (error) {
      handleError("getAllAclsRoles", error)
    }
  }),
  getAclsRolesPermissions: protectedProcedure
    .input(z.object({ roleSlug: aclsRolesSchema.select.shape.slug }))
    .query(async ({ ctx, input }) => {
      try {
        return await getAclsRolesPermissions(ctx.db, input)
      } catch (error) {
        handleError("getAclsRolesPermissions", error)
      }
    }),
  updateAclsRolePermissions: protectedProcedure
    .input(
      z.object({
        roleSlug: aclsRolesSchema.select.shape.slug,
        permissions: z.array(
          z.object({
            moduleKey: z.custom<ModuleKey>(),
            permissions: z.object({
              actions: z.object({
                view: z.boolean(),
                add: z.boolean(),
                edit: z.boolean()
              })
            })
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await updateAclsRolePermissions(ctx.db, input)
      } catch (error) {
        handleError("updateAclsRolePermissions", error)
      }
    }),
  createAclsRolePermissions: protectedProcedure
    .input(
      z.object({
        roleSlug: aclsRolesSchema.select.shape.slug,
        permissions: z.array(
          z.object({
            moduleKey: z.custom<ModuleKey>(),
            title: z.string(),
            parentModuleKey: z.custom<ModuleKey>().nullish(),
            permissions: z.object({
              actions: z.object({
                view: z.boolean(),
                add: z.boolean(),
                edit: z.boolean()
              })
            })
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await createAclsRolePermissions(ctx.db, input)
      } catch (error) {
        handleError("createAclsRolePermissions", error)
      }
    })
})
