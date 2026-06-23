import { LiquidMetal } from "@paper-design/shaders-react"
import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import type { Dispatch, SetStateAction } from "react"

import type { ExperienceState } from "@/context/local-storage-provider"

import { Button } from "./ui/button"

type Props = {
  isEntering: boolean
  startEnterAnimation(): void
  setExperienceState: Dispatch<SetStateAction<ExperienceState>>
}

export function Landing({
  isEntering,
  startEnterAnimation,
  setExperienceState,
}: Props) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <div className="relative w-full max-w-3xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 1.2,
          ease: "easeOut",
        }}
        style={{ perspective: 1200 }}
        className="pointer-events-none absolute inset-1 z-20 grid grid-cols-2 items-center select-none"
      >
        <motion.div
          initial={{ opacity: 0, rotateY: 0, scale: 1, x: 0 }}
          animate={
            isEntering
              ? {
                  opacity: [0.05, 1, 1, 0],
                  rotateY: [0, 0, 0, 48],
                  scale: [1, 1.35, 1.35, 3],
                  x: [0, 0, 0, -220],
                }
              : { opacity: 0.05, rotateY: 0, scale: 1, x: 0 }
          }
          transition={
            isEntering
              ? {
                  delay: 0.8,
                  duration: 2.4,
                  times: [0, 0.68, 0.68, 1],
                  ease: "easeInOut",
                }
              : {
                  duration: shouldReduceMotion ? 0 : 1.2,
                  ease: "easeOut",
                }
          }
          style={{ transformStyle: "preserve-3d" }}
          className="origin-right justify-self-end"
        >
          <Image
            alt=""
            width={300}
            height={300}
            src={"/gate-left.png"}
            fetchPriority="high"
            loading="eager"
            className="w-auto invert dark:invert-0"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotateY: 0, scale: 1, x: 0 }}
          animate={
            isEntering
              ? {
                  opacity: [0.05, 1, 1, 0],
                  rotateY: [0, 0, 0, -48],
                  scale: [1, 1.35, 1.35, 3],
                  x: [0, 0, 0, 220],
                }
              : { opacity: 0.05, rotateY: 0, scale: 1, x: 0 }
          }
          transition={
            isEntering
              ? {
                  delay: 0.8,
                  duration: 2.4,
                  times: [0, 0.68, 0.68, 1],
                  ease: "easeInOut",
                }
              : {
                  duration: shouldReduceMotion ? 0 : 1.2,
                  ease: "easeOut",
                }
          }
          onAnimationComplete={() => {
            if (isEntering) setExperienceState("main")
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="origin-left"
        >
          <Image
            alt=""
            width={300}
            height={300}
            src={"/gate-right.png"}
            fetchPriority="high"
            loading="eager"
            className="w-auto invert dark:invert-0"
          />
        </motion.div>
      </motion.div>
      <div className="flex flex-col items-center justify-center">
        <motion.div
          initial={{
            opacity: 0,
            filter: shouldReduceMotion ? "blur(0px)" : "blur(24px)",
            scale: shouldReduceMotion ? 1 : 0.98,
          }}
          animate={
            isEntering
              ? {
                  opacity: 0,
                  filter: "blur(32px)",
                  scale: 1.08,
                }
              : { opacity: 1, filter: "blur(0px)", scale: 1 }
          }
          transition={{
            delay: isEntering ? 0 : 0.5,
            duration: shouldReduceMotion ? 0 : isEntering ? 0.8 : 2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full"
        >
          <LiquidMetal
            width={"100%"}
            height={720}
            image="/hex-logo.svg"
            colorBack="#00000000"
            colorTint="#ffffff"
            shape={undefined}
            repetition={2}
            softness={0.8}
            shiftRed={0}
            shiftBlue={0}
            distortion={0}
            contour={0.75}
            angle={130}
            speed={0.8}
            scale={1}
            fit="contain"
          />
        </motion.div>
        <motion.div
          animate={{ opacity: isEntering ? 0 : 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          className="z-30"
        >
          <Button
            variant={"link"}
            onClick={(event) => {
              event.stopPropagation()
              startEnterAnimation()
            }}
          >
            Press anywhere to Start
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
