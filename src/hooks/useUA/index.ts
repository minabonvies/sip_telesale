import { useEffect, useRef, useState } from "react"
import { Invitation, SessionState, Referral } from "sip.js"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import BonTalk, { SessionName } from "@/entry/plugin"
import { useAudio } from "@/Provider/AudioProvider"
import { useView } from "@/Provider/ViewProvider"

export default function useUA() {
  const bonTalk = useBonTalk()
  const { startRingTone, stopRingTone, toggleDTMF } = useAudio()
  const { setView } = useView()

  const [receivedInvitation, setReceivedInvitation] = useState<Invitation | null>(null)

  // const [invitation, setInvitation] = useState<Invitation | null>(null)
  // const [referral, setReferral] = useState<Referral | null>(null)

  useEffect(() => {
    if (!bonTalk) return

    async function _login() {
      await bonTalk?.login()

      bonTalk?.addDelegate("onInvite", (invitation: Invitation) => {
        startRingTone()
        setView("RECEIVED_CALL")
        setReceivedInvitation(invitation)
        invitation.stateChange.addListener((state: SessionState) => {
          console.log("STATE", state)
          switch (state) {
            case SessionState.Initial:
              break
            case SessionState.Establishing:
              break
            case SessionState.Established:
              stopRingTone()
              setView("IN_CALL")
              BonTalk.setupRemoteMedia(invitation, bonTalk?.audioElement)
              setReceivedInvitation(null)
              break
            case SessionState.Terminating:
            case SessionState.Terminated:
              stopRingTone()
              setView("KEY_PAD")
              BonTalk.cleanupMedia(bonTalk?.audioElement)
              break
            default:
              throw new Error("Unknown session state.")
          }
        })
      })
    }

    // TODO: React.strictMode warning
    _login()
  }, [])

  const audioCall = async (target: string, as: SessionName) => {
    if (!bonTalk) return
    if (!target) return

    try {
      return await bonTalk.audioCall(target, as)
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to place call`)
      console.error(error)
      alert("Failed to place call.\n" + error)
    }
  }

  const answerCall = async () => {
    if (!bonTalk) return
    if (!receivedInvitation) return
    try {
      await bonTalk.answerCall(receivedInvitation, "incoming")
      console.log("已接聽電話")
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to answer call`)
      console.error(error)
      alert("Failed to answer call.\n" + error)
    }
  }

  const rejectCall = async () => {
    if (!bonTalk) return
    if (!receivedInvitation) return
    try {
      await bonTalk.rejectCall(receivedInvitation)
      console.log("拒接")
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to reject call`)
      console.error(error)
      alert("Failed to reject call.\n" + error)
    }
  }

  const hangupCall = async (target: SessionName) => {
    if (!bonTalk) return
    try {
      await bonTalk.hangupCall(target)
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to hangup call`)
      console.error(error)
      alert("Failed to hangup call.\n" + error)
    }
  }

  const setHold = async (hold: boolean) => {
    if (!bonTalk) return
    try {
      await bonTalk.setHold(hold, "outgoing")
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to hold call`)
      console.error(error)
      alert("Failed to hold call.\n" + error)
    }
  }

  const setMute = (mute: boolean) => {
    if (!bonTalk) return
    bonTalk.toggleMicrophone(mute, "outgoing") // TODO: discuss?
  }

  const sendDTMF = async (tone: string) => {
    if (!bonTalk) return
    try {
      await bonTalk.sendDTMF(tone, "outgoing")
      toggleDTMF()
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to send DTMF`)
      console.error(error)
      alert("Failed to send DTMF.\n" + error)
    }
  }

  const blindTransfer = async (target: string) => {
    if (!bonTalk) return
    try {
      await bonTalk.blindTransfer("outgoing", target)
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to blind transfer`)
      console.error(error)
      alert("Failed to blind transfer.\n" + error)
    }
  }

  const preAttendedTransfer = async (target: string) => {
    if (!bonTalk) return
    try {
      await bonTalk.preAttendedTransfer("outgoing", target)
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to attended transfer - invite`)
      console.error(error)
      alert("Failed to attended transfer - invite.\n" + error)
    }
  }

  const attendedTransfer = async () => {
    if (!bonTalk) return
    try {
      await bonTalk.attendedTransfer("outgoing", "attendedRefer")
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to attended transfer - transfer`)
      console.error(error)
      alert("Failed to attended transfer - transfer.\n" + error)
    }
  }

  return {
    receivedInvitation,
    audioCall,
    answerCall,
    rejectCall,
    hangupCall,
    setHold,
    sendDTMF,
    setMute,
    blindTransfer,
    preAttendedTransfer,
    attendedTransfer,
  }
}
