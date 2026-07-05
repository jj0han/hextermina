"use client"

import type { Dispatch, ReactNode, SetStateAction } from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import {
  readLocalStorageItem,
  STORAGE_KEYS,
  writeLocalStorageItem,
} from "./local-storage-provider"

type AudioContextProps = {
  volume: number
  handleVolume: (value: number) => void
  isMuted: boolean
  setIsMuted: Dispatch<SetStateAction<boolean>>
  isMuteLockedByDefault: boolean
  playBackgroundSound: () => void
  playClickSound: () => void
}

export const AudioContext = createContext<AudioContextProps | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bgAudioRef = useRef<HTMLAudioElement | null>(null)
  const [volume, setVolume] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const isMuteLockedByDefault =
    readLocalStorageItem(STORAGE_KEYS.isMuted) === "true" // track muted state in local storage

  function playBackgroundSound() {
    if (!bgAudioRef.current) return
    bgAudioRef.current.play().catch((error) => {
      console.error("Playback failed:", error)
    })
  }

  function playClickSound() {
    if (!audioRef.current) return
    audioRef.current.play().catch((error) => {
      console.error("Playback failed:", error)
    })
  }

  const handleVolume = useCallback((value: number) => {
    setVolume(value)
    setIsMuted(value <= 0)
  }, [])

  useEffect(() => {
    const audioElements = document.querySelectorAll("audio")

    for (const element of audioElements) {
      element.muted = isMuted
      element.volume = volume / 100
    }

    if (volume <= 0) {
      writeLocalStorageItem(STORAGE_KEYS.isMuted, "true")
    } else {
      writeLocalStorageItem(STORAGE_KEYS.isMuted, "false")
    }
  }, [volume, isMuted])

  return (
    <AudioContext.Provider
      value={{
        volume,
        handleVolume,
        isMuted,
        setIsMuted,
        isMuteLockedByDefault,
        playBackgroundSound,
        playClickSound,
      }}
    >
      <audio ref={audioRef} src={"/sounds/intro-sound.ogg"} preload="auto" />
      <audio
        ref={bgAudioRef}
        src={"/sounds/background-sound.ogg"}
        preload="auto"
        loop
      />
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)

  if (!context) {
    throw new Error("useAudio must be used within AudioProvider")
  }

  return context
}
