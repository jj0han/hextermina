"use client"
import { AnimatePresence, motion } from "motion/react"

import { Cursor } from "@/components/motion-primitives/cursor"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AudioProvider } from "@/context/audio-provider"
import { CursorProvider, useCursor } from "@/context/cursor-provider"
import { LocalStorageProvider } from "@/context/local-storage-provider"
import { ThemeProvider } from "@/context/theme-provider"
import { cursorPath } from "@/utils/clipPaths"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LocalStorageProvider>
        <AudioProvider>
          <CursorProvider>
            <Cursor
              variants={{
                initial: { scale: 0.3, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.3, opacity: 0 },
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.15,
              }}
              springConfig={{ damping: 25, stiffness: 300, restDelta: 0.001 }}
            >
              <MorphingCursor />
            </Cursor>
            <TooltipProvider>{children}</TooltipProvider>
          </CursorProvider>
        </AudioProvider>
      </LocalStorageProvider>
    </ThemeProvider>
  )
}

function MorphingCursor() {
  const { isIdle, isHovering, hoveringElement, cursorContent } = useCursor()

  const cursor = {
    rest: "circle(0% at 0% 0%)",
    default: "circle(50% at 50% 50%)",
    tooltip: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    hover: cursorPath,
  }

  const isClickCursor = hoveringElement === "button" || hoveringElement === "a"

  return (
    <motion.div
      animate={
        isIdle && !isHovering
          ? "rest"
          : isClickCursor && !isHovering
            ? "hover"
            : isHovering
              ? "tooltip"
              : "default"
      }
      variants={{
        rest: { width: 0, height: 0 },
        default: { clipPath: cursor.default, width: 16, height: 16 },
        hover: { clipPath: cursor.hover, width: 16, height: 16 },
        tooltip: { clipPath: cursor.tooltip, width: 80, height: 32 },
      }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="flex items-center justify-center rounded-full bg-primary/40 backdrop-blur-md"
    >
      <AnimatePresence>{isHovering && cursorContent}</AnimatePresence>
    </motion.div>
  )
}
