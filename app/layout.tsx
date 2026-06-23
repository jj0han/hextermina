import "./globals.css"

import type { Metadata } from "next"
import { Geist_Mono, Inter, Oxanium } from "next/font/google"

import { cn } from "@/lib/utils"
import { TRPCReactProvider } from "@/trpc/client"

import Providers from "./providers"

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
  title: "Hex Termina",
  description: "Divine Dogma",
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
        oxaniumHeading.variable,
        fontMono.variable,
        "font-sans",
        inter.variable
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
