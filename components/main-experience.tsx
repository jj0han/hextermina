"use client"

import {
  ChevronDown,
  ChevronUp,
  GithubIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { MotionValue } from "motion/react"
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useRef } from "react"

import { useCursorHover } from "@/context/cursor-provider"
import { useLenis } from "@/context/lenis-provider"
import { useScrollContainer } from "@/context/scroll-container-provider"

import { TextScramble } from "./motion-primitives/text-scramble"
import { Button, buttonVariants } from "./ui/button"
import { ButtonGroup } from "./ui/button-group"
import {
  TypographyH1,
  TypographyLead,
  TypographyMuted,
  TypographySmall,
} from "./ui/typography"

const MAIN_SECTIONS = [
  {
    eyebrow: "Hextermina / drop 001",
    title: "Dark indie clothing from the other side of the gate.",
    description:
      "Main page template. Products, lookbook entries, and drop details when the collection is ready.",
  },
  {
    eyebrow: "Hextermina / drop 002",
    title: "Fragments from the gate, stitched for the night.",
    description:
      "Lookbook previews, sizing notes, and release timing will live here as the next drop takes shape.",
  },
] as const

type MainExperienceProps = {
  shouldReduceMotion: boolean
}

export function MainExperience({ shouldReduceMotion }: MainExperienceProps) {
  const { scrollRef } = useScrollContainer()
  const { scrollY } = useScroll({ container: scrollRef })
  const { nextSection, previousSection } = useLenis()

  const scrollProgress = useTransform(scrollY, (latest) => {
    const viewportHeight = scrollRef.current?.clientHeight ?? window.innerHeight

    if (viewportHeight <= 0) return 0

    return latest / viewportHeight
  })

  return (
    <div className="flex overflow-hidden">
      <ShurikenBackdrop shouldReduceMotion={shouldReduceMotion} />
      <div
        ref={scrollRef as React.RefObject<HTMLDivElement>}
        className="no-scrollbar min-w-0 scrollbar-none overflow-x-hidden overflow-y-scroll"
      >
        <div data-lenis-content>
          {MAIN_SECTIONS.map((section, index) => (
            <MainSection
              key={section.eyebrow}
              index={index}
              section={section}
              scrollProgress={scrollProgress}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
          <GithubSection
            index={2}
            scrollProgress={scrollProgress}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>
      </div>
      <div className="self-center p-4">
        <ButtonGroup orientation={"vertical"} className="self-center">
          <Button size={"icon"} variant={"secondary"} onClick={previousSection}>
            <HugeiconsIcon icon={ChevronUp} strokeWidth={2} />
          </Button>
          <Button size={"icon"} variant={"secondary"} onClick={nextSection}>
            <HugeiconsIcon icon={ChevronDown} strokeWidth={2} />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}

function ShurikenBackdrop({
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean
}) {
  const { scrollRef } = useScrollContainer()
  const { scrollY } = useScroll({ container: scrollRef })

  const rotate = useTransform(scrollY, [0, 2000], [0, 180])

  const smoothRotate = useSpring(rotate, {
    stiffness: 100,
    damping: 20,
  })

  return (
    <motion.div
      style={{ rotate: shouldReduceMotion ? 0 : smoothRotate }}
      className="pointer-events-none h-full w-1/2 max-w-2xl"
      aria-hidden
    >
      <Image
        alt=""
        width={300}
        height={300}
        src="/shuriken.svg"
        fetchPriority="high"
        loading="eager"
        className="h-full w-full opacity-3 invert select-none dark:invert-0"
      />
    </motion.div>
  )
}

type MainSectionProps = MainExperienceProps & {
  index: number
  section: (typeof MAIN_SECTIONS)[number]
  scrollProgress: MotionValue<number>
}

function MainSection({
  index,
  section,
  scrollProgress,
  shouldReduceMotion,
}: MainSectionProps) {
  const cursorContent = useMemo(() => <HoverCursorContent />, [])
  const cursorRef = useCursorHover(cursorContent)
  const ref = useRef<HTMLElement>(null)

  const opacity = useTransform(scrollProgress, (progress) => {
    if (shouldReduceMotion) return 1

    const distance = Math.abs(progress - index)

    if (distance >= 0.38) return 0
    if (distance <= 0.08) return 1

    return 1 - (distance - 0.08) / 0.3
  })

  const blur = useTransform(scrollProgress, (progress) => {
    if (shouldReduceMotion) return 0

    const distance = Math.abs(progress - index)

    if (distance >= 0.38) return 14
    if (distance <= 0.08) return 0

    return ((distance - 0.08) / 0.3) * 14
  })

  const smoothBlur = useSpring(blur, {
    stiffness: 200,
    damping: 20,
  })

  return (
    <motion.section
      ref={ref}
      data-snap-section
      className="relative z-10 flex h-svh w-full min-w-0 flex-col justify-center overflow-hidden"
    >
      <motion.div
        style={{
          opacity,
          filter: useMotionTemplate`blur(${smoothBlur}px)`,
        }}
        className="flex w-full max-w-6xl min-w-0 flex-col gap-8 p-4"
      >
        <TypographyMuted className="font-mono text-xs tracking-[0.4em] uppercase">
          <TextScramble as="label" duration={1.5}>
            {section.eyebrow}
          </TextScramble>
        </TypographyMuted>
        <div className="space-y-4" ref={cursorRef}>
          <TypographyH1>{section.title}</TypographyH1>
          <TypographyLead>{section.description}</TypographyLead>
        </div>
      </motion.div>
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
      <div className="inline-flex items-center space-x-1 text-primary-foreground">
        <TypographySmall>More</TypographySmall>
        <HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2} />
      </div>
    </motion.div>
  )
}

type GithubSectionProps = {
  index: number
  scrollProgress: MotionValue<number>
  shouldReduceMotion: boolean
}

function GithubSection({
  index,
  scrollProgress,
  shouldReduceMotion,
}: GithubSectionProps) {
  const cursorContent = useMemo(() => <HoverGithubContent />, [])
  const cursorRef = useCursorHover<HTMLAnchorElement>(cursorContent)
  const ref = useRef<HTMLElement>(null)

  const opacity = useTransform(scrollProgress, (progress) => {
    if (shouldReduceMotion) return 1

    const distance = Math.abs(progress - index)

    if (distance >= 0.38) return 0
    if (distance <= 0.08) return 1

    return 1 - (distance - 0.08) / 0.3
  })

  const blur = useTransform(scrollProgress, (progress) => {
    if (shouldReduceMotion) return 0

    const distance = Math.abs(progress - index)

    if (distance >= 0.38) return 14
    if (distance <= 0.08) return 0

    return ((distance - 0.08) / 0.3) * 14
  })

  const smoothBlur = useSpring(blur, {
    stiffness: 200,
    damping: 20,
  })

  return (
    <motion.section
      ref={ref}
      data-snap-section
      className="relative z-10 flex h-svh w-full min-w-0 flex-col justify-center overflow-hidden"
    >
      <motion.div
        style={{
          opacity,
          filter: useMotionTemplate`blur(${smoothBlur}px)`,
        }}
        className="ml-auto flex w-full max-w-6xl min-w-0 flex-col gap-8 p-4 md:pr-[clamp(1.5rem,8vw,4rem)]"
      >
        <div className="space-y-4">
          <TypographyH1>Hi,</TypographyH1>
          <TypographyLead>
            I created this project as a non-commercial, creative
            reinterpretation of the{" "}
            <Link
              href={"https://hextermina.com"}
              target="_blank"
              className="underline"
            >
              HEX TERMINA
            </Link>{" "}
            digital presence. It is not affiliated with, endorsed by, or
            intended for commercial use by the original brand.
          </TypographyLead>
        </div>
        <Link
          ref={cursorRef}
          href={"https://github.com/jj0han"}
          target="_blank"
          className={buttonVariants({
            variant: "secondary",
            className: "w-fit",
          })}
        >
          By jj0han
        </Link>
      </motion.div>
    </motion.section>
  )
}

function HoverGithubContent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      className="inline-flex w-full items-center justify-center"
    >
      <div className="inline-flex items-center space-x-1 text-primary-foreground">
        <TypographySmall>GitHub</TypographySmall>
        <HugeiconsIcon icon={GithubIcon} className="size-4" strokeWidth={2} />
      </div>
    </motion.div>
  )
}
