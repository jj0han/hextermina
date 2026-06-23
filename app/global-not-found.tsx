// Import global styles and fonts
import "./globals.css"

import { RouteBlockIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Metadata } from "next"
import { Geist_Mono, Inter, Oxanium } from "next/font/google"

import { buttonVariants } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ThemeProvider } from "@/context/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const oxaniumHeading = Oxanium({
  subsets: ["latin"],
  variable: "--font-heading",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
}

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        oxaniumHeading.variable,
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={RouteBlockIcon} strokeWidth={2} />
                </EmptyMedia>
                <EmptyTitle>404 - Page Not Found</EmptyTitle>
                <EmptyDescription>This page does not exist.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                {/*Link component does not work inside a global-not-found*/}
                {/*eslint-disable-next-line*/}
                <a href="/" className={buttonVariants()}>
                  Go back
                </a>
              </EmptyContent>
            </Empty>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
