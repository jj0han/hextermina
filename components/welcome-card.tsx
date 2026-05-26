"use client"
import {
  ExternalLink,
  GithubIcon,
  Moon02Icon,
  PaintBrush04Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  TypographyH1,
  TypographyInlineCode,
  TypographyLead,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography"
import { useTRPC } from "@/trpc/client"

import { Badge } from "./ui/badge"

export function WelcomeCard() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const trpc = useTRPC()
  const greeting = useQuery(trpc.hello.list.queryOptions({ text: "world" }))

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Avoid hydration mismatch by only rendering on the client because of the theme toggle
  useEffect(() => {
    //eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg min-w-0 space-y-6">
        <TypographyH1>Project ready!</TypographyH1>
        <TypographyLead>
          You may now start building. We&apos;ve already added the components
          for you.
        </TypographyLead>
        <Card>
          <CardHeader>
            <CardTitle>Prefetch query test</CardTitle>
            <Badge
              variant={greeting.status === "success" ? "default" : "secondary"}
            >
              {greeting.status}
            </Badge>
          </CardHeader>
          <CardContent className="flex gap-2">
            <TypographyP>data:</TypographyP>
            <TypographyInlineCode>
              {greeting.data?.greeting}
            </TypographyInlineCode>
          </CardContent>
        </Card>
        <ItemGroup>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={PaintBrush04Icon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Theme</ItemTitle>
              <ItemDescription>
                Toggle between light and dark mode.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="icon" onClick={toggleTheme}>
                <HugeiconsIcon
                  icon={theme === "dark" ? Sun01Icon : Moon02Icon}
                  strokeWidth={2}
                />
              </Button>
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Visit the documentation</ItemTitle>
              <ItemDescription>Learn how to get started.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Link
                href="https://github.com/jj0han/starter-next"
                target="_blank"
                className={buttonVariants({ size: "icon" })}
              >
                <HugeiconsIcon icon={ExternalLink} strokeWidth={2} />
              </Link>
            </ItemActions>
          </Item>
        </ItemGroup>
        <TypographyMuted>Made by jj0han</TypographyMuted>
      </div>
    </div>
  )
}
