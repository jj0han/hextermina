"use client"

import type { Dispatch, ReactNode, SetStateAction } from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type ExperienceState =
  | "headphones"
  | "onboarding"
  | "landing"
  | "entering"
  | "main"

type LocalStorageContextProps = {
  experienceState: ExperienceState
  hasCompletedOnboarding: boolean
  isHydrated: boolean
  setExperienceState: Dispatch<SetStateAction<ExperienceState>>
}

const STORAGE_KEYS = {
  hasCompletedOnboarding: "hextermina:has-completed-onboarding",
} as const

const SESSION_STORAGE_KEYS = {
  experienceState: "hextermina:session-experience-state",
  hasSeenHeadphones: "hextermina:session-has-seen-headphones",
} as const

const DEFAULT_EXPERIENCE_STATE: ExperienceState = "headphones"

const EXPERIENCE_STATES = new Set<ExperienceState>([
  "headphones",
  "onboarding",
  "landing",
  "entering",
  "main",
])

const SESSION_EXPERIENCE_STATES = new Set<ExperienceState>([
  "landing",
  "entering",
  "main",
])

const LocalStorageContext = createContext<LocalStorageContextProps | null>(null)

export function LocalStorageProvider({ children }: { children: ReactNode }) {
  const [experienceState, setExperienceState] =
    useState<ExperienceState>(readExperienceState)
  const [initialHasCompletedOnboarding] = useState(readHasCompletedOnboarding)
  const hasCompletedOnboarding =
    initialHasCompletedOnboarding || isOnboardingCompleteState(experienceState)
  const isHydrated = true

  useEffect(() => {
    if (isOnboardingCompleteState(experienceState)) {
      writeStorageItem(STORAGE_KEYS.hasCompletedOnboarding, "true")
    }

    if (experienceState !== "headphones") {
      writeSessionStorageItem(SESSION_STORAGE_KEYS.hasSeenHeadphones, "true")
    }

    if (SESSION_EXPERIENCE_STATES.has(experienceState)) {
      writeSessionStorageItem(
        SESSION_STORAGE_KEYS.experienceState,
        experienceState
      )
    } else {
      removeSessionStorageItem(SESSION_STORAGE_KEYS.experienceState)
    }
  }, [experienceState])

  const value = useMemo(
    () => ({
      experienceState,
      hasCompletedOnboarding,
      isHydrated,
      setExperienceState,
    }),
    [experienceState, hasCompletedOnboarding, isHydrated]
  )

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  )
}

export function useLocalStorageState() {
  const context = useContext(LocalStorageContext)

  if (!context) {
    throw new Error(
      "useLocalStorageState must be used within LocalStorageProvider"
    )
  }

  return context
}

function readExperienceState(): ExperienceState {
  if (typeof window === "undefined") return DEFAULT_EXPERIENCE_STATE

  const sessionExperienceState = sessionStorage.getItem(
    SESSION_STORAGE_KEYS.experienceState
  )

  if (
    sessionExperienceState === "main" &&
    SESSION_EXPERIENCE_STATES.has(sessionExperienceState)
  ) {
    return sessionExperienceState
  }

  if (!readHasSeenHeadphones()) {
    return "headphones"
  }

  if (!readHasCompletedOnboarding()) {
    return "onboarding"
  }

  if (
    sessionExperienceState &&
    SESSION_EXPERIENCE_STATES.has(sessionExperienceState as ExperienceState)
  ) {
    return sessionExperienceState as ExperienceState
  }

  if (readHasCompletedOnboarding()) return "landing"

  return DEFAULT_EXPERIENCE_STATE
}

function readHasCompletedOnboarding() {
  if (typeof window === "undefined") return
  const storedValue = localStorage.getItem(STORAGE_KEYS.hasCompletedOnboarding)

  if (storedValue === "true") return true

  const legacyExperienceState = localStorage.getItem(
    "hextermina:experience-state"
  )

  return legacyExperienceState
    ? isOnboardingCompleteState(legacyExperienceState as ExperienceState)
    : false
}

function readHasSeenHeadphones() {
  return (
    sessionStorage.getItem(SESSION_STORAGE_KEYS.hasSeenHeadphones) === "true"
  )
}

function isOnboardingCompleteState(value: ExperienceState) {
  return EXPERIENCE_STATES.has(value) && SESSION_EXPERIENCE_STATES.has(value)
}

function writeStorageItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Storage can fail in private mode or when quota is exceeded.
  }
}

function writeSessionStorageItem(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // Storage can fail in private mode or when quota is exceeded.
  }
}

function removeSessionStorageItem(key: string) {
  try {
    sessionStorage.removeItem(key)
  } catch {
    // Storage can fail in private mode or when quota is exceeded.
  }
}
