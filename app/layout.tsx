import "./globals.css"

import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import { cn } from "@/lib/utils"
import { TRPCReactProvider } from "@/trpc/client"

import Providers from "./providers"

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontHeading = Geist({
  variable: "--font-heading",
  subsets: ["latin"],
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Starter Next",
  description: "By jj0han",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontHeading.variable,
        fontMono.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body>
        <TRPCReactProvider>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
