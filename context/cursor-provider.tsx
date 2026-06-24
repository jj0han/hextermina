import type { ReactNode, RefCallback } from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

type CursorTarget = {
  element: HTMLElement
  content: ReactNode
}

type CursorContextProps = {
  isIdle: boolean
  isHovering: boolean
  hoveringElement: string | undefined
  cursorContent: ReactNode | null
  handlePositionChange: (x: number, y: number) => void
  registerCursorTarget: (
    id: string,
    element: HTMLElement,
    content: ReactNode
  ) => void
  updateCursorTarget: (id: string, content: ReactNode) => void
  unregisterCursorTarget: (id: string) => void
}

export const CursorContext = createContext<CursorContextProps | null>(null)

export function CursorProvider({ children }: { children: ReactNode }) {
  const activeTargetIdRef = useRef<string | null>(null)
  const targetsRef = useRef(new Map<string, CursorTarget>())
  const [isHovering, setIsHovering] = useState(false)
  const [isIdle, setIsIdle] = useState(true)
  const [hoveringElement, setHoveringElement] = useState<string | undefined>()
  const [cursorContent, setCursorContent] = useState<ReactNode | null>(null)

  const clearActiveTarget = useCallback(() => {
    activeTargetIdRef.current = null
    setIsHovering(false)
    setCursorContent(null)
  }, [])

  const registerCursorTarget = useCallback(
    (id: string, element: HTMLElement, content: ReactNode) => {
      targetsRef.current.set(id, { element, content })

      if (activeTargetIdRef.current === id) {
        setCursorContent(content)
      }
    },
    []
  )

  const updateCursorTarget = useCallback((id: string, content: ReactNode) => {
    const target = targetsRef.current.get(id)

    if (!target) return

    target.content = content

    if (activeTargetIdRef.current === id) {
      setCursorContent(content)
    }
  }, [])

  const unregisterCursorTarget = useCallback(
    (id: string) => {
      targetsRef.current.delete(id)

      if (activeTargetIdRef.current === id) {
        clearActiveTarget()
      }
    },
    [clearActiveTarget]
  )

  const handlePositionChange = useCallback(
    (x: number, y: number) => {
      let hoveredTargetId: string | null = null
      let hoveredTarget: CursorTarget | null = null

      for (const [id, target] of targetsRef.current) {
        const rect = target.element.getBoundingClientRect()
        const isInside =
          x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

        if (isInside) {
          hoveredTargetId = id
          hoveredTarget = target
          break
        }
      }

      if (!hoveredTargetId || !hoveredTarget) {
        if (activeTargetIdRef.current) {
          clearActiveTarget()
        }
        return
      }

      if (activeTargetIdRef.current !== hoveredTargetId) {
        activeTargetIdRef.current = hoveredTargetId
        setCursorContent(hoveredTarget.content)
      }

      setIsHovering((current) => (current ? current : true))
    },
    [clearActiveTarget]
  )

  useEffect(() => {
    let timeout: NodeJS.Timeout

    function handleCursorMove(event: MouseEvent) {
      const x = event.clientX
      const y = event.clientY

      const element = document.elementFromPoint(x, y)
      setHoveringElement(element?.tagName.toLowerCase())

      setIsIdle(false)

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        setIsIdle(true)
      }, 1000)
    }

    window.addEventListener("pointermove", handleCursorMove)
    return () => {
      window.removeEventListener("pointermove", handleCursorMove)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <CursorContext.Provider
      value={{
        isIdle,
        isHovering,
        hoveringElement,
        cursorContent,
        handlePositionChange,
        registerCursorTarget,
        updateCursorTarget,
        unregisterCursorTarget,
      }}
    >
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor() {
  const context = useContext(CursorContext)

  if (!context) {
    throw new Error("useCursor must be used within CursorProvider")
  }

  return context
}

export function useCursorHover<TElement extends HTMLElement = HTMLDivElement>(
  cursorContent: ReactNode
): RefCallback<TElement> {
  const id = useId()
  const contentRef = useRef(cursorContent)
  const elementRef = useRef<TElement | null>(null)
  const { registerCursorTarget, updateCursorTarget, unregisterCursorTarget } =
    useCursor()

  useEffect(() => {
    contentRef.current = cursorContent
    updateCursorTarget(id, cursorContent)
  }, [cursorContent, id, updateCursorTarget])

  useEffect(() => {
    return () => unregisterCursorTarget(id)
  }, [id, unregisterCursorTarget])

  return useCallback(
    (element: TElement | null) => {
      if (elementRef.current && elementRef.current !== element) {
        unregisterCursorTarget(id)
      }

      elementRef.current = element

      if (element) {
        registerCursorTarget(id, element, contentRef.current)
      }
    },
    [id, registerCursorTarget, unregisterCursorTarget]
  )
}
