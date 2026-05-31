import { initTRPC } from "@trpc/server"
import superjson from "superjson"
/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  void opts.headers
  // const user = await auth(opts.headers);
  return { userId: "user_123" }
}
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
  })
// Base router and procedure helpers
export const createTRPCRouter = t.router
export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure

/**
 * Protected (authenticated) procedure
 * @see https://trpc.io/docs/procedures

  Example:

  const userIsAuthed = t.middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session },
      },
    });
  });

  export const authedProcedure = t.procedure.use(userIsAuthed);
*/
