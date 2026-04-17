import { z } from "zod/v4"

import {
  adminUpdateUserEmail,
  adminUpdateUserPassword,
  forgotPassword,
  inactiveUser,
  reactivateUser,
  updateUserPassword
} from "../funcs/auth.funcs"
import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "../trpc"

export const authRouter = createTRPCRouter({
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        redirectTo: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return forgotPassword(ctx.supabase, input)
    }),

  inactiveUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        alsoBan: z.boolean().optional(),
        reason: z.string().optional(),
        notifyUser: z.boolean().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return inactiveUser(ctx.db, input)
    }),
  reactivateUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        appUrl: z.string(),
        notifyUser: z.boolean().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return reactivateUser(ctx.db, input)
    }),
  updateUserPassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return updateUserPassword(ctx.db, ctx.supabase, {
        userId: ctx.user.id,
        ...input
      })
    }),
  adminUpdateUserPassword: adminProtectedProcedure
    .input(
      z.object({
        userId: z.string(),
        newPassword: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return adminUpdateUserPassword(ctx.db, ctx.supabaseAdmin, input)
    }),
  adminUpdateUserEmail: adminProtectedProcedure
    .input(
      z.object({
        userId: z.string(),
        newEmail: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return adminUpdateUserEmail(ctx.db, ctx.supabaseAdmin, input)
    })
})
