"use client"

import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import { useTheme } from "next-themes"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useTRPC } from "@/trpc/client"

import { Button } from "./ui/button"

export function WelcomeCard() {
  const { theme, setTheme } = useTheme()
  const trpc = useTRPC()
  const greeting = useQuery(trpc.hello.list.queryOptions({ text: "world" }))

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm min-w-0">
        <Card>
          <CardHeader>
            <CardTitle>Project ready!</CardTitle>
            <CardDescription>
              <p>You may now add components and start building.</p>
              <p>We&apos;ve already added the button component for you.</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            Prefetching TRPC query: {greeting.data?.greeting}
          </CardContent>
          <CardFooter>
            <Button
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <HugeiconsIcon icon={Sun01Icon} strokeWidth={2} />
              ) : (
                <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} />
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
