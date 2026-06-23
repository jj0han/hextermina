"use client"

import { Headphones } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"
import { useEffect } from "react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty"

type HeadphonesNoticeProps = {
  onCompleteAction: () => void
  durationMs?: number
}

export function HeadphonesNotice({
  onCompleteAction,
  durationMs = 2600,
}: HeadphonesNoticeProps) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const timeoutId = window.setTimeout(onCompleteAction, durationMs)

    return () => window.clearTimeout(timeoutId)
  }, [durationMs, onCompleteAction])

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <HugeiconsIcon icon={Headphones} strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>Better experience with headphones</EmptyTitle>
          <EmptyDescription>
            Turn your volume on and use headphones before crossing the gate.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </motion.div>
  )
}
