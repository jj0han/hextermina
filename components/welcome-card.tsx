"use client"
import { AnimatePresence, useReducedMotion } from "motion/react"
import { useCallback, useEffect, useState } from "react"

import { useAudio } from "@/context/audio-provider"
import { useLocalStorageState } from "@/context/local-storage-provider"

import { Controls } from "./controls"
import { HeadphonesNotice } from "./headphones-notice"
import { Landing } from "./landing"
import { MainExperience } from "./main-experience"
import { OnBoarding } from "./on-boarding"

export function WelcomeCard() {
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const { handleVolume, playClickSound, playBackgroundSound } = useAudio()
  const {
    experienceState,
    hasCompletedOnboarding,
    isHydrated,
    setExperienceState,
  } = useLocalStorageState()

  const isHeadphonesNotice = experienceState === "headphones"
  const isLanding = experienceState === "landing"
  const isEntering = experienceState === "entering"

  // Avoid hydration mismatch by only rendering on the client because of the theme toggle
  useEffect(() => {
    //eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  function startEnterAnimation() {
    if (!isLanding) return
    handleVolume(50)
    playClickSound()
    playBackgroundSound()
    setExperienceState(shouldReduceMotion ? "main" : "entering")
  }

  const showOnboarding = useCallback(() => {
    setExperienceState(hasCompletedOnboarding ? "landing" : "onboarding")
  }, [hasCompletedOnboarding, setExperienceState])

  if (!mounted || !isHydrated) {
    return null
  }

  return (
    <main
      className="flex min-h-svh items-center justify-center overflow-hidden bg-background p-6"
      onClick={startEnterAnimation}
    >
      <Controls />
      <AnimatePresence mode="wait">
        {experienceState === "main" ? (
          <MainExperience
            key="main"
            shouldReduceMotion={Boolean(shouldReduceMotion)}
          />
        ) : isHeadphonesNotice ? (
          <HeadphonesNotice
            key="headphones"
            onCompleteAction={showOnboarding}
          />
        ) : isLanding || isEntering ? (
          <Landing
            key="landing"
            isEntering={isEntering}
            startEnterAnimation={startEnterAnimation}
            setExperienceState={setExperienceState}
          />
        ) : (
          <OnBoarding
            key="onboarding"
            onClick={() => {
              setExperienceState("landing")
            }}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
