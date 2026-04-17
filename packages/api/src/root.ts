import { createTRPCRouter, publicProcedure } from "./trpc"

export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => "Hello, world!")
})

export type AppRouter = typeof appRouter
