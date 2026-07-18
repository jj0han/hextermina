"use client"

import {
  Moon02Icon,
  Sun02Icon,
  Volume,
  VolumeMute02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useAudio } from "@/context/audio-provider"
import { useThemeToggle } from "@/context/theme-provider"
import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "./ui/button"
import { ButtonGroup } from "./ui/button-group"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"

export function Controls({ className }: { className?: string }) {
  const { volume, handleVolume, isMuted, playClickSound, playBackgroundSound } =
    useAudio()
  const { isDark, toggleTheme } = useThemeToggle({ variant: "polygon" })

  return (
    <ButtonGroup className={cn("pointer-events-auto flex gap-2", className)}>
      <ButtonGroup>
        <Button
          title="Toggle theme"
          size="icon"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            toggleTheme()
          }}
        >
          <HugeiconsIcon
            icon={isDark ? Sun02Icon : Moon02Icon}
            strokeWidth={2}
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup onClick={(e) => e.stopPropagation()}>
        <Button
          title="Toggle mute"
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
        <Label id="volume-label" className="sr-only">
          Volume
        </Label>
        <Slider
          aria-labelledby="volume-label"
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
    </ButtonGroup>
  )
}
