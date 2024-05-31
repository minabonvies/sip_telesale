import { createContext, useContext, useRef } from "react"
import ringtone from "@/assets/sounds/ringtone.wav"
import dtmf from "@/assets/sounds/dtmf.wav"

import { useBonTalk } from "../BonTalkProvider"

type AudioContextType = {
  toggleRingTone: () => void
  toggleDTMF: () => void
}

const isDEV = process.env.NODE_ENV === "development"
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
  const dtmfRef = useRef<HTMLAudioElement | null>(null)

  const toggleRingTone = () => {
    if (!ringToneRef.current) return
    try {
      if (ringToneRef.current.paused) {
        ringToneRef.current.play()
      } else {
        ringToneRef.current.pause()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleDTMF = () => {
    if (!dtmfRef.current) return

    try {
      if (dtmfRef.current.paused) {
        dtmfRef.current.play()
      } else {
        dtmfRef.current.pause()
        dtmfRef.current.currentTime = 0
        dtmfRef.current.play()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AudioContext.Provider
      value={{
        toggleRingTone,
        toggleDTMF,
      }}
    >
      <audio controls={isDEV} id={bonTalk!.audioElementId} />
      <audio controls={isDEV} ref={ringToneRef} src={ringtone} />
      <audio controls={isDEV} ref={dtmfRef} src={dtmf} />
      {children}
    </AudioContext.Provider>
  )
}
