import type { RefObject } from "react"
import { createContext, useContext, useRef } from "react"

type ScrollContainerContextProps = {
  scrollRef: RefObject<HTMLElement | null>
}

const ScrollContainerContext =
  createContext<ScrollContainerContextProps | null>(null)

export function ScrollContainerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const scrollRef = useRef<HTMLElement | null>(null)

  return (
    <ScrollContainerContext.Provider value={{ scrollRef }}>
      {children}
    </ScrollContainerContext.Provider>
  )
}

export function useScrollContainer() {
  const context = useContext(ScrollContainerContext)

  if (!context) {
    throw new Error(
      "useScrollContainer must be used within a ScrollContainerProvider"
    )
  }

  return context
}
