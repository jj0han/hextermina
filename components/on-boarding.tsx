import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"

import { useAudio } from "@/context/audio-provider"

import { Button } from "./ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"

type Props = {
  onClick: () => void
}

export function OnBoarding({ onClick }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const {
    handleVolume,
    playClickSound,
    playBackgroundSound,
    isMuteLockedByDefault,
  } = useAudio()
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
      className="w-full max-w-lg space-y-6"
    >
      <Image
        alt=""
        width={100}
        height={100}
        src={"/hex-logo.svg"}
        fetchPriority="high"
        loading="eager"
        className="w-auto max-w-52 place-self-center invert dark:invert-0"
      />
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the end</CardTitle>
          <CardDescription>
            You found the gate. Beyond it: chrome-era pieces, small-batch drops,
            and clothes that were never meant for the algorithm.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={() => {
              if (isMuteLockedByDefault) return
              handleVolume(50)
              playClickSound()
              playBackgroundSound()
              onClick()
            }}
            className={"ml-auto"}
          >
            I agree with the terms
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
