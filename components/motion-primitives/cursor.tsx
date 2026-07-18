"use client"
import type { SpringOptions, Transition, Variant } from "motion/react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react"
import type { Dispatch, RefObject, SetStateAction } from "react"
import React, { useEffect, useRef, useState } from "react"

import { useCursor } from "@/context/cursor-provider"
import { cn } from "@/lib/utils"

export const handlePositionChange = (
  ref: RefObject<HTMLDivElement | null>,
  setIsHovering: Dispatch<SetStateAction<boolean>>,
  { x, y }: { x: number; y: number }
) => {
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect()
    const isInside =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    setIsHovering(isInside)
  }
}

export type CursorProps = {
  children: React.ReactNode
  className?: string
  springConfig?: SpringOptions
  attachToParent?: boolean
  transition?: Transition
  variants?: {
    initial: Variant
    animate: Variant
    exit: Variant
  }
  onPositionChangeAction?: (x: number, y: number) => void
}

export function Cursor({
  children,
  className,
  springConfig,
  attachToParent,
  variants,
  transition,
}: CursorProps) {
  const { handlePositionChange: onPositionChangeAction } = useCursor()
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(!attachToParent)

  useEffect(() => {
    if (typeof window !== "undefined") {
      cursorX.set(window.innerWidth / 2)
      cursorY.set(window.innerHeight / 2)
    }
  }, [cursorX, cursorY])

  useEffect(() => {
    if (!attachToParent) {
      document.body.style.cursor = "none"
    } else {
      document.body.style.cursor = "auto"
    }

    const updatePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      onPositionChangeAction?.(e.clientX, e.clientY)
    }

    document.addEventListener("mousemove", updatePosition)
    document.addEventListener("mouseover", updatePosition)

    return () => {
      document.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mouseover", updatePosition)
    }
  }, [cursorX, cursorY, onPositionChangeAction, attachToParent])

  const cursorXSpring = useSpring(cursorX, springConfig || { duration: 0 })
  const cursorYSpring = useSpring(cursorY, springConfig || { duration: 0 })

  useEffect(() => {
    const handleVisibilityChange = (visible: boolean) => {
      setIsVisible(visible)
    }

    if (attachToParent && cursorRef.current) {
      const parent = cursorRef.current.parentElement
      if (parent) {
        parent.addEventListener("mouseenter", () => {
          parent.style.cursor = "none"
          handleVisibilityChange(true)
        })
        parent.addEventListener("mouseleave", () => {
          parent.style.cursor = "auto"
          handleVisibilityChange(false)
        })
      }
    }

    const ref = cursorRef.current
    return () => {
      if (attachToParent && ref) {
        const parent = ref?.parentElement
        if (parent) {
          parent.removeEventListener("mouseenter", () => {
            parent.style.cursor = "none"
            handleVisibilityChange(true)
          })
          parent.removeEventListener("mouseleave", () => {
            parent.style.cursor = "auto"
            handleVisibilityChange(false)
          })
        }
      }
    }
  }, [attachToParent])

  return (
    <motion.div
      ref={cursorRef}
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-2147483647",
        className
      )}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={transition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
