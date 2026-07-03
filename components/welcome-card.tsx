"use client"
import { AnimatePresence, useReducedMotion } from "motion/react"
import { useCallback, useEffect, useState } from "react"

import { useAudio } from "@/context/audio-provider"
import { useLenis, useLenisActivation } from "@/context/lenis-provider"
import { useLocalStorageState } from "@/context/local-storage-provider"
import { useScrollContainer } from "@/context/scroll-container-provider"
import { cn } from "@/lib/utils"

import { Controls } from "./controls"
import { HeadphonesNotice } from "./headphones-notice"
import { Landing } from "./landing"
import { MainExperience } from "./main-experience"
import { OnBoarding } from "./on-boarding"

export function WelcomeCard() {
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const { scrollRef } = useScrollContainer()
  const { scrollTo } = useLenis()

  const { handleVolume, playClickSound, playBackgroundSound } = useAudio()
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

  // Turn Lenis on only in the main scroll experience
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
    handleVolume(50)
    playClickSound()
    playBackgroundSound()
    setExperienceState(shouldReduceMotion ? "main" : "entering")
  }

  const showOnboarding = useCallback(() => {
    setExperienceState(hasCompletedOnboarding ? "landing" : "onboarding")
  }, [hasCompletedOnboarding, setExperienceState])

  return (
    <main
      ref={scrollRef}
      className={cn(
        "flex h-svh justify-center bg-background",
        showMainLayout
          ? "scrollbar-none overflow-x-hidden overflow-y-scroll"
          : "items-center overflow-hidden p-6"
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
