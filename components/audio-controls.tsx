"use client"

import { Volume, VolumeMute02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useAudio } from "@/context/audio-provider"

import { Button, buttonVariants } from "./ui/button"
import { ButtonGroup } from "./ui/button-group"
import { Slider } from "./ui/slider"

export function AudioControls() {
  const { volume, handleVolume, isMuted, playClickSound, playBackgroundSound } =
    useAudio()

  return (
    <div className="absolute top-4 right-4">
      <ButtonGroup onClick={(e) => e.stopPropagation()}>
        <Button
          size="icon"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            if (isMuted) {
              playClickSound()
              playBackgroundSound()
            }
            handleVolume(isMuted ? 50 : 0)
          }}
        >
          <HugeiconsIcon
            icon={isMuted ? VolumeMute02Icon : Volume}
            strokeWidth={2}
          />
        </Button>
        <Slider
          disabled={isMuted}
          defaultValue={volume}
          value={volume}
          max={100}
          step={1}
          onValueChange={(value) => {
            handleVolume(value as number)
          }}
          className={buttonVariants({
            variant: "secondary",
            className: "w-32! translate-y-0!",
          })}
        />
      </ButtonGroup>
    </div>
  )
}
