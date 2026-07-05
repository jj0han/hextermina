"use client"
import { AnimatePresence, useReducedMotion } from "motion/react"
import { useCallback, useEffect, useState } from "react"

import { useAudio } from "@/context/audio-provider"
import { useLenis, useLenisActivation } from "@/context/lenis-provider"
import { useLocalStorageState } from "@/context/local-storage-provider"
import { cn } from "@/lib/utils"

import { Controls } from "./controls"
import { HeadphonesNotice } from "./headphones-notice"
import { Landing } from "./landing"
import { MainExperience } from "./main-experience"
import { OnBoarding } from "./on-boarding"

export function WelcomeCard() {
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const { scrollTo } = useLenis()

  const {
    handleVolume,
    playClickSound,
    playBackgroundSound,
    isMuteLockedByDefault,
  } = useAudio()
  const {
    experienceState,
    hasCompletedOnboarding,
    isHydrated,
    setExperienceState,
  } = useLocalStorageState()

  const isMain = experienceState === "main"
  const isHeadphonesNotice = experienceState === "headphones"
  const isLanding = experienceState === "landing"
  const isEntering = experienceState === "entering"
  const showMainLayout = mounted && isMain

  useLenisActivation(showMainLayout && !shouldReduceMotion)

  useEffect(() => {
    //eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!showMainLayout) return

    scrollTo(0, { immediate: true })
  }, [showMainLayout, scrollTo])

  function startEnterAnimation() {
    if (!isLanding) return
    if (!isMuteLockedByDefault) {
      handleVolume(50)
      playClickSound()
      playBackgroundSound()
    }
    setExperienceState(shouldReduceMotion ? "main" : "entering")
  }

  const showOnboarding = useCallback(() => {
    setExperienceState(hasCompletedOnboarding ? "landing" : "onboarding")
  }, [hasCompletedOnboarding, setExperienceState])

  return (
    <main
      className={cn(
        "flex h-svh justify-center bg-background",
        showMainLayout ? "" : "items-center overflow-hidden p-6"
      )}
      onClick={startEnterAnimation}
    >
      {mounted && <Controls />}
      {mounted && isHydrated ? (
        <AnimatePresence mode="wait">
          {isMain ? (
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
      ) : null}
    </main>
  )
}
