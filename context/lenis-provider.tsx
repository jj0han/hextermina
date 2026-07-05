"use client"

import "lenis/dist/lenis.css"

import Lenis, { type LenisOptions } from "lenis"
import Snap, { type SnapOptions } from "lenis/snap"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useScrollContainer } from "@/context/scroll-container-provider"

const LENIS_CONTENT_SELECTOR = "[data-lenis-content]"
const SNAP_SECTION_SELECTOR = "[data-snap-section]"

type ScrollToOptions = Parameters<Lenis["scrollTo"]>[1]

type LenisContextValue = {
  // lenis: Lenis | null
  // snap: Snap | null
  isReady: boolean
  setEnabled: (enabled: boolean) => void
  scrollTo: (
    target: Parameters<Lenis["scrollTo"]>[0],
    options?: ScrollToOptions
  ) => void
  goToSection: (index: number) => void
  nextSection: () => void
  previousSection: () => void
}

const LenisContext = createContext<LenisContextValue | null>(null)

type LenisProviderProps = {
  children: React.ReactNode
  lenisOptions?: LenisOptions
  snapOptions?: SnapOptions
}

function getScrollElements(wrapper: HTMLElement) {
  const content = wrapper.querySelector<HTMLElement>(LENIS_CONTENT_SELECTOR)
  const sections = content?.querySelectorAll<HTMLElement>(SNAP_SECTION_SELECTOR)

  if (!content || !sections?.length) return null

  return { content, sections }
}

export function LenisProvider({
  children,
  lenisOptions,
  snapOptions,
}: LenisProviderProps) {
  const { scrollRef } = useScrollContainer()

  const lenisRef = useRef<Lenis | null>(null)
  const snapRef = useRef<Snap | null>(null)
  const enabledRef = useRef(false)

  const [isReady, setIsReady] = useState(false)

  const teardown = useCallback(() => {
    snapRef.current?.stop()
    snapRef.current = null

    lenisRef.current?.destroy()
    lenisRef.current = null

    setIsReady(false)
  }, [])

  const init = useCallback(() => {
    const wrapper = scrollRef.current
    if (!wrapper || !enabledRef.current) return false

    const elements = getScrollElements(wrapper)
    if (!elements) return false

    teardown()

    const lenis = new Lenis({
      wrapper,
      content: elements.content,
      eventsTarget: wrapper,
      autoRaf: true,
      smoothWheel: true,
      duration: 1.4,
      ...lenisOptions,
    })

    const snap = new Snap(lenis, {
      type: "mandatory",
      duration: 1.4,
      debounce: 150,
      ...snapOptions,
    })

    snap.addElements(Array.from(elements.sections), { align: "center" })

    lenisRef.current = lenis
    snapRef.current = snap
    setIsReady(true)

    return true
  }, [lenisOptions, snapOptions, scrollRef, teardown])

  const setEnabled = useCallback(
    (enabled: boolean) => {
      enabledRef.current = enabled

      if (!enabled) {
        teardown()
        return
      }

      let cancelled = false
      let attempts = 0

      const tryInit = () => {
        if (cancelled || !enabledRef.current) return

        if (init()) return

        attempts += 1
        if (attempts < 30) {
          requestAnimationFrame(tryInit)
        }
      }

      requestAnimationFrame(tryInit)

      return () => {
        cancelled = true
      }
    },
    [init, teardown]
  )

  useEffect(() => {
    return () => {
      teardown()
    }
  }, [teardown])

  const scrollTo = useCallback(
    (target: Parameters<Lenis["scrollTo"]>[0], options?: ScrollToOptions) => {
      const lenis = lenisRef.current

      if (lenis) {
        lenis.scrollTo(target, options)
        return
      }

      const wrapper = scrollRef.current

      if (typeof target === "number") {
        wrapper?.scrollTo({
          top: target,
          behavior: options?.immediate ? "auto" : "smooth",
        })
        return
      }

      if (target instanceof HTMLElement) {
        target.scrollIntoView({
          behavior: options?.immediate ? "auto" : "smooth",
          block: "start",
        })
      }
    },
    [scrollRef]
  )

  const goToSection = useCallback((index: number) => {
    snapRef.current?.goTo(index)
  }, [])

  const nextSection = useCallback(() => {
    snapRef.current?.next()
  }, [])

  const previousSection = useCallback(() => {
    snapRef.current?.previous()
  }, [])

  const value = useMemo<LenisContextValue>(
    () => ({
      // lenis: lenisRef.current,
      // snap: snapRef.current,
      isReady,
      setEnabled,
      scrollTo,
      goToSection,
      nextSection,
      previousSection,
    }),
    [isReady, setEnabled, scrollTo, goToSection, nextSection, previousSection]
  )

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
}

export function useLenis() {
  const context = useContext(LenisContext)

  if (!context) {
    throw new Error("useLenis must be used within a LenisProvider")
  }

  return context
}

// Call this from any page to turn Lenis on/off.
export function useLenisActivation(enabled: boolean) {
  const { setEnabled } = useLenis()

  useEffect(() => {
    const cleanup = setEnabled(enabled)
    return cleanup
  }, [enabled, setEnabled])
}
