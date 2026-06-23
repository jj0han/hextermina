"use client"

import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import { useMemo } from "react"

import { useCursorHover } from "@/context/cursor-provider"

import { TypographyH1, TypographyLead, TypographyMuted } from "./ui/typography"

type MainExperienceProps = {
  shouldReduceMotion: boolean
}

export function MainExperience({ shouldReduceMotion }: MainExperienceProps) {
  const cursorContent = useMemo(() => <HoverCursorContent />, [])
  const cursorRef = useCursorHover(cursorContent)

  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(16px)", scale: 0.98 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="mx-auto flex w-full max-w-5xl flex-col gap-8"
    >
      <TypographyMuted className="font-mono text-xs tracking-[0.4em] uppercase">
        Hextermina / drop 001
      </TypographyMuted>
      <div className="space-y-4" ref={cursorRef}>
        <TypographyH1>
          Dark indie clothing from the other side of the gate.
        </TypographyH1>
        <TypographyLead>
          Main page template. Replace this with products, lookbook entries, and
          drop details when the collection is ready.
        </TypographyLead>
      </div>
    </motion.section>
  )
}

function HoverCursorContent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      className="inline-flex w-full items-center justify-center"
    >
      <div className="inline-flex items-center text-sm text-primary-foreground">
        Mais{" "}
        <HugeiconsIcon
          icon={PlusSignIcon}
          className="ml-1 size-4"
          strokeWidth={2}
        />
      </div>
    </motion.div>
  )
}
