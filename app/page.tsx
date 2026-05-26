import { WelcomeCard } from "@/components/welcome-card"
import { HydrateClient, prefetch, trpc } from "@/trpc/server"

export default async function Page() {
  await prefetch(trpc.hello.list.queryOptions({ text: "world" }))

  return (
    <HydrateClient>
      <WelcomeCard />
    </HydrateClient>
  )
}
