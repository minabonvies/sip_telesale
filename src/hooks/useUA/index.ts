import { useEffect, useRef, useState } from "react"
import { Invitation, SessionState, Referral } from "sip.js"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import BonTalk from "@/entry/plugin"

// should rename to useCall
export default function useUA() {
  const bonTalk = useBonTalk()

  // TODO 評估是否移除
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ringToneRef = useRef<HTMLAudioElement | null>(null)
  const dtmfRef = useRef<HTMLAudioElement | null>(null)

  const invitationRef = useRef<Invitation | null>(null)
  const [invitation, setInvitation] = useState<Invitation | null>(null)

  const [referral, setReferral] = useState<Referral | null>(null)


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

      bonTalk?.addDelegate("onRefer", async (referral) => {
        // if (acceptReferral()) {
        //   await referral.accept()
        //   const inviter =  referral.makeInviter()
        //   await inviter.invite()
        //   inviter.stateChange.addListener((state: SessionState) => {
        //     switch (state) {
        //       case SessionState.Initial:
        //         break
        //       case SessionState.Establishing:
        //         break
        //       case SessionState.Established:
        //         // BonTalk.setupRemoteMedia(inviter, audioElement as HTMLMediaElement)
        //         break
        //       case SessionState.Terminating:
        //       case SessionState.Terminated:
        //         // BonTalk.cleanupMedia(audioElement as HTMLMediaElement)
        //         break
        //       default:
        //         throw new Error("Unknown session state.")
        //     }
        //   })
        // } else {
        //   referral.reject()
        // }
      })
    }

    _login()
  }, [])

  const acceptReferral = () => {

  }

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

  const setHold = async (hold: boolean) => {
    if (!bonTalk) return
    try {
      await bonTalk.setHold(hold)
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to hold call`)
      console.error(error)
      alert("Failed to hold call.\n" + error)
    }
  }

  const setMute = (mute: boolean) => {
    if (!bonTalk) return
    bonTalk.toggleMicrophone(mute);
  }

  const dtmfTone = () => {
    if (!dtmfRef.current) return
    try {
      dtmfRef.current.play()
    } catch (e) {
      console.log(e)
    }
  }

  const sendDTMF = async (tone: string) => {
    if (!bonTalk) return
    try {
      await bonTalk.sendDTMF(tone)
      dtmfTone()
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to send DTMF`)
      console.error(error)
      alert("Failed to send DTMF.\n" + error)
    }
  }

  const blindTransfer = async (target: string) => {
    if (!bonTalk) return
    try {
      await bonTalk.blindTransfer(target)
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to blind transfer`)
      console.error(error)
      alert("Failed to blind transfer.\n" + error)
    }
  }

  const preAttendedTransfer = async (target: string) => {
    if (!bonTalk) return
    try {
      await bonTalk.preAttendedTransfer(target)
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to attended transfer - invite`)
      console.error(error)
      alert("Failed to attended transfer - invite.\n" + error)
    }
  }

  const attendedTransfer = async () => {
    if (!bonTalk) return
    try {
      await bonTalk.attendedTransfer()
    } catch (error) {
      console.error(`[${bonTalk.userAgentInstance?.instanceId}] failed to attended transfer - transfer`)
      console.error(error)
      alert("Failed to attended transfer - transfer.\n" + error)
    }
  }

  return {
    audioRef,
    ringToneRef,
    dtmfRef,
    audioCall,
    answerCall,
    rejectCall,
    hangupCall,
    setHold,
    invitationRef,
    sendDTMF,
    setMute, blindTransfer, preAttendedTransfer, attendedTransfer
  }
}
