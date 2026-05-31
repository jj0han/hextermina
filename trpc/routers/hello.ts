import z from "zod"

import { baseProcedure, createTRPCRouter } from "../init"

const listSchema = z.object({
  text: z.string(),
})

export const helloRouter = createTRPCRouter({
  list: baseProcedure.input(listSchema).query((opts) => {
    return {
      greeting: `hello ${opts.input.text}`,
    }
  }),
})
