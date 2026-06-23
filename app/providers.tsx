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
  const { isHovering, hoveringElement, cursorContent } = useCursor()

  const cursor = {
    default: "circle(50% at 50% 50%)",
    tooltip: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    hover: cursorPath,
  }

  return (
    <motion.div
      animate={
        hoveringElement === "button"
          ? "hover"
          : isHovering
            ? "tooltip"
            : "default"
      }
      variants={{
        default: { clipPath: cursor.default, width: 16, height: 16 },
        hover: { clipPath: cursor.hover, width: 16, height: 16 },
        tooltip: { clipPath: cursor.tooltip, width: 80, height: 32 },
      }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="flex items-center justify-center rounded-lg bg-primary/40 backdrop-blur-md"
    >
      <AnimatePresence>{isHovering && cursorContent}</AnimatePresence>
    </motion.div>
  )
}
