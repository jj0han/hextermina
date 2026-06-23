"use client"

import { GithubIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion } from "motion/react"
import Link from "next/link"
import { useMemo } from "react"

import { useCursorHover } from "@/context/cursor-provider"

import { buttonVariants } from "./ui/button"
import { TypographyH1, TypographyLead, TypographyMuted } from "./ui/typography"

type MainExperienceProps = {
  shouldReduceMotion: boolean
}

export function MainExperience({ shouldReduceMotion }: MainExperienceProps) {
  const cursorContent = useMemo(() => <HoverCursorContent />, [])
  const cursorRef = useCursorHover(cursorContent)
  const gitContent = useMemo(() => <HoverGitContent />, [])
  const gitRef = useCursorHover<HTMLAnchorElement>(gitContent)

  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(16px)", scale: 0.98 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="mx-auto flex w-full max-w-4xl flex-col gap-8"
    >
      <TypographyMuted className="font-mono text-xs tracking-[0.4em] uppercase">
        Hextermina / drop 001
      </TypographyMuted>
      <div className="space-y-4" ref={cursorRef}>
        <TypographyH1>
          Dark indie clothing from the other side of the gate.
        </TypographyH1>
        <TypographyLead>
          Main page template. Products, lookbook entries, and drop details when
          the collection is ready.
        </TypographyLead>
      </div>
      <TypographyMuted>
        This project is a non-commercial, creative reinterpretation of the{" "}
        <Link
          href={"https://hextermina.com"}
          target="_blank"
          className="underline"
        >
          HEX TERMINA
        </Link>{" "}
        digital presence. It is not affiliated with, endorsed by, or intended
        for commercial use by the original brand.
      </TypographyMuted>
      <Link
        ref={gitRef}
        href={"https://github.com/jj0han/hextermina"}
        target="_blank"
        className={buttonVariants({ className: "w-fit", variant: "secondary" })}
      >
        Made by jj0han
      </Link>
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
        More{" "}
        <HugeiconsIcon
          icon={PlusSignIcon}
          className="ml-1 size-4"
          strokeWidth={2}
        />
      </div>
    </motion.div>
  )
}

function HoverGitContent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      className="inline-flex w-full items-center justify-center"
    >
      <div className="inline-flex items-center text-sm text-primary-foreground">
        Github <HugeiconsIcon icon={GithubIcon} className="ml-1 size-4" />
      </div>
    </motion.div>
  )
}
