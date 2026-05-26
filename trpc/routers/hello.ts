import z from "zod"

import { baseProcedure, createTRPCRouter } from "../init"

export const helloRouter = createTRPCRouter({
  list: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      }
    }),
})
