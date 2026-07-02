"use client"
import type { DOMMotionComponents, MotionProps } from "motion/react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  label: motion.label,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
  strong: motion.strong,
  em: motion.em,
  code: motion.code,
} as const

type MotionElementTag = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>

export type TextScrambleProps = {
  children: string
  duration?: number
  speed?: number
  characterSet?: string
  as?: MotionElementTag
  className?: string
  trigger?: boolean
  onScrambleComplete?: () => void
} & MotionProps

const defaultChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = "p",
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const MotionTag = motionElements[Component]
  const [scrambledText, setScrambledText] = useState<string | null>(null)
  const displayText =
    trigger && scrambledText !== null ? scrambledText : children

  useEffect(() => {
    if (!trigger) return

    const steps = duration / speed
    let step = 0

    const interval = setInterval(() => {
      let scrambled = ""
      const progress = step / steps

      for (let i = 0; i < children.length; i++) {
        if (children[i] === " ") {
          scrambled += " "
          continue
        }

        if (progress * children.length > i) {
          scrambled += children[i]
        } else {
          scrambled +=
            characterSet[Math.floor(Math.random() * characterSet.length)]
        }
      }

      setScrambledText(scrambled)
      step++

      if (step > steps) {
        clearInterval(interval)
        setScrambledText(null)
        onScrambleComplete?.()
      }
    }, speed * 1000)

    return () => clearInterval(interval)
  }, [trigger, children, duration, speed, characterSet, onScrambleComplete])

  return (
    <MotionTag className={className} {...props}>
      {displayText}
    </MotionTag>
  )
}
