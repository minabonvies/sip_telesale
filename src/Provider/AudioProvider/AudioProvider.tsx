import { createContext, useContext } from "react"
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

  const ringToneAudio = new Audio(ringtone)
  const ringBacktoneAudio = new Audio(ringbacktone)
  const dtmfAudio = new Audio(dtmf)

  const startRingBackTone = async () => {
    try {
      await ringBacktoneAudio.play()
    } catch (err) {
      console.error(err)
    }
  }

  const stopRingBackTone = () => {
    try {
      ringBacktoneAudio.pause()
    } catch (err) {
      console.error(err)
    }
  }

  const startRingTone = async () => {
    try {
      await ringToneAudio.play()
    } catch (err) {
      console.error(err)
    }
  }

  const stopRingTone = () => {
    try {
      ringToneAudio.pause()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleDTMF = async () => {
    try {
      if (dtmfAudio.paused) {

        await dtmfAudio.play()
      } else {
        dtmfAudio.pause()
        dtmfAudio.currentTime = 0
        await dtmfAudio.play()
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
      {children}
    </AudioContext.Provider>
  )
}