import { useEffect, useRef, useState } from "react"
import { Invitation, SessionState } from "sip.js"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import BonTalk from "@/entry/plugin"

// should rename to useCall
export default function useUA() {
  const bonTalk = useBonTalk()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ringToneRef = useRef<HTMLAudioElement | null>(null)
  const dtmfRef = useRef<HTMLAudioElement | null>(null)

  const invitationRef = useRef<Invitation | null>(null)
  const [invitation, setInvitation] = useState<Invitation | null>(null)

  useEffect(() => {
    if (!bonTalk) return
    if (bonTalk.userAgentInstance?.isConnected && bonTalk.registererInstance?.state === "Registered") return

    async function _login() {
      await bonTalk?.login()

      bonTalk?.addDelegate("onInvite", (invitation: Invitation) => {
        startRingTone()
        setInvitation(invitation)

        invitation.stateChange.addListener((state: SessionState) => {
          switch (state) {
            case SessionState.Initial:
              break
            case SessionState.Establishing:
              break
            case SessionState.Established:
              BonTalk.setupRemoteMedia(invitation, bonTalk?.audioElement)

              break
            case SessionState.Terminating:
            case SessionState.Terminated:
              BonTalk.cleanupMedia(bonTalk?.audioElement)
              stopRingTone()
              break
            default:
              throw new Error("Unknown session state.")
          }
        })
      })
    }

    _login()
  }, [])

  const audioCall = async (target: string) => {
    if (!bonTalk) return
    if (!target) return

    try {
      await bonTalk.audioCall(target)
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to place call`)
      console.error(error)
      alert("Failed to place call.\n" + error)
    }
  }

  const answerCall = async () => {
    if (!bonTalk) return
    if (!invitation) return
    try {
      await bonTalk.answerCall(invitation)
      stopRingTone()
      console.log("已接聽電話")
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to answer call`)
      console.error(error)
      alert("Failed to answer call.\n" + error)
    }
  }

  const rejectCall = async () => {
    if (!bonTalk) return
    if (!invitation) return
    try {
      await bonTalk.rejectCall(invitation)
      stopRingTone()
      console.log("拒接")
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to reject call`)
      console.error(error)
      alert("Failed to reject call.\n" + error)
    }
  }

  const hangupCall = async () => {
    if (!bonTalk) return
    try {
      await bonTalk.hangupCall()
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to hangup call`)
      console.error(error)
      alert("Failed to hangup call.\n" + error)
    }
  }

  const startRingTone = () => {
    if (!ringToneRef.current) return

    try {
      ringToneRef.current.play()
    } catch (e) {
      console.log(e)
    }
  }

  const stopRingTone = () => {
    if (!ringToneRef.current) return

    try {
      ringToneRef.current.pause()
    } catch (e) {
      console.log(e)
    }
  }

  const hold = async () => {
    if (!bonTalk) return
    try {
      await bonTalk.hold()
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to hold call`)
      console.error(error)
      alert("Failed to hold call.\n" + error)
    }
  }

  // const dtmfTone = () => {
  //   if (!dtmfRef.current) return
  //   try {
  //     dtmfRef.current.play()
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  return {
    audioRef,
    ringToneRef,
    dtmfRef,
    audioCall,
    answerCall,
    rejectCall,
    hangupCall,
    holdCall: hold,
    invitationRef,
  }
}
