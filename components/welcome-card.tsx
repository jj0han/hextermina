"use client"
import {
  CancelCircleIcon,
  CheckCircle,
  ExternalLink,
  GithubIcon,
  Moon02Icon,
  PaintBrush04Icon,
  Refresh03Icon,
  ShadcnIcon,
  Sun01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
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
  TypographyLead,
  TypographyMuted,
} from "@/components/ui/typography"
import { useTRPC } from "@/trpc/client"

import { Spinner } from "./ui/spinner"

export function WelcomeCard() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const trpc = useTRPC()
  const { data, status, refetch, isRefetching } = useQuery(
    trpc.hello.list.queryOptions({ text: "world" })
  )

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
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="w-full max-w-xl space-y-8">
        <div className="w-full space-y-6">
          <TypographyH1>Project ready!</TypographyH1>
          <TypographyLead>
            You may now start building. We&apos;ve already added the components
            for you.
          </TypographyLead>
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
                <Button
                  size="icon"
                  onClick={toggleTheme}
                  title="Toggle light/dark mode"
                  role="listitem"
                >
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
                  aria-label="Visit the github page"
                  role="listitem"
                  className={buttonVariants({ size: "icon" })}
                >
                  <HugeiconsIcon icon={ExternalLink} strokeWidth={2} />
                </Link>
              </ItemActions>
            </Item>
            <Item variant="outline">
              <ItemMedia variant="icon">
                <HugeiconsIcon icon={ShadcnIcon} strokeWidth={2} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Shadcn/ui</ItemTitle>
                <ItemDescription>
                  Build your own design system and apply on this template.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Link
                  href="https://ui.shadcn.com"
                  target="_blank"
                  aria-label="Visit the documentation for Shadcn/ui"
                  role="listitem"
                  className={buttonVariants({ size: "icon" })}
                >
                  <HugeiconsIcon icon={ExternalLink} strokeWidth={2} />
                </Link>
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>
        <Item variant="muted">
          <ItemMedia variant="image">
            <HugeiconsIcon
              icon={status === "success" ? CheckCircle : CancelCircleIcon}
              className={
                status === "success" ? "text-green-600" : "text-destructive"
              }
              strokeWidth={2}
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Prefetch query test</ItemTitle>
            <ItemDescription>data: {data?.greeting}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              title="Refetch query test"
              onClick={async () => await refetch()}
              size="icon"
            >
              {isRefetching ? (
                <Spinner />
              ) : (
                <HugeiconsIcon icon={Refresh03Icon} strokeWidth={2} />
              )}
            </Button>
          </ItemActions>
        </Item>
        <TypographyMuted>
          Made by{" "}
          <Link
            href="https://github.com/jj0han"
            target="_blank"
            className={buttonVariants({ variant: "link", className: "px-0!" })}
          >
            jj0han
          </Link>
        </TypographyMuted>
      </div>
    </main>
  )
}
