import { createContext, useContext, useRef } from "react"
import ringtone from "@/assets/sounds/ringtone.wav"
import ringbacktone from "@/assets/sounds/ringbacktone.wav"
import dtmf from "@/assets/sounds/dtmf.wav"

import { useBonTalk } from "../BonTalkProvider"
type AudioContextType = {
  startRingBackTone: () => void
  stopRingBackTone: () => void
  startRingTone: () => void
  stopRingTone: () => void
  toggleDTMF: () => void
}

// const isDEV = process.env.NODE_ENV === "development"
const AudioContext = createContext<AudioContextType | null>(null)

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within a AudioProvider")
  }
  return context
}

export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const bonTalk = useBonTalk()
  const ringToneRef = useRef<HTMLAudioElement | null>(null)
  const ringBacktoneRef = useRef<HTMLAudioElement | null>(null)
  const dtmfRef = useRef<HTMLAudioElement | null>(null)

  const startRingBackTone = async () => {
    if (!ringBacktoneRef.current) return
    try {
      await ringBacktoneRef.current.play()
    } catch (err) {
      console.error(err)
    }
  }

  const stopRingBackTone = () => {
    if (!ringBacktoneRef.current) return
    try {
      ringBacktoneRef.current.pause()
    } catch (err) {
      console.error(err)
    }
  }

  const startRingTone = async () => {
    if (!ringToneRef.current) return
    try {
      await ringToneRef.current.play()
    } catch (err) {
      console.error(err)
    }
  }

  const stopRingTone = () => {
    if (!ringToneRef.current) return
    try {
      ringToneRef.current.pause()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleDTMF = async () => {
    if (!dtmfRef.current) return

    try {
      if (dtmfRef.current.paused) {
        await dtmfRef.current.play()
      } else {
        dtmfRef.current.pause()
        dtmfRef.current.currentTime = 0
        await dtmfRef.current.play()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AudioContext.Provider
      value={{
        startRingBackTone,
        stopRingBackTone,
        startRingTone,
        stopRingTone,
        toggleDTMF,
      }}
    >
      <audio id={bonTalk!.audioElementId} />
      <audio loop ref={ringBacktoneRef} src={ringbacktone} />
      <audio loop ref={ringToneRef} src={ringtone} />
      <audio ref={dtmfRef} src={dtmf} />
      {children}
    </AudioContext.Provider>
  )
}
