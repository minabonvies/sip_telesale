import { useState } from "react"
import ringtone_file from "./assets/sounds/ringtone.wav"

import dtmf_file from "./assets/sounds/dtmf.wav"
import useUA from "./hooks/useUA/index"
import { useBonTalk } from "./Provider/BonTalkProvider"

export default function Playground() {
  const bonTalk = useBonTalk()
  const { audioRef, ringToneRef, dtmfRef, audioCall, answerCall, rejectCall, hangupCall, setHold, invitationRef, sendDTMF,setMute,blindTransfer } = useUA()

  const [isHold, setIsHold] = useState(false)
  const [isMute, setIsMute] = useState(false)

  const handleAudioCall = async () => {
    await audioCall("3001")
  }

  const handleAnswer = async () => {
    await answerCall()
  }

  const handleReject = async () => {
    await rejectCall()
  }

  const handleHangUp = async () => {
    await hangupCall()
  }

  const handleHold = async () => {
    if (isHold) {
      setIsHold(false)
      await setHold(false)
    } else {
      setIsHold(true)
      await setHold(true)
    }
  }
  const handleMute = () => {
    if (isMute) {
      setIsMute(false)
      setMute(false)
    } else {
      setIsMute(true)
      setMute(true)
    }
  }

  const handleDTMF = (tone: string) => async () => {
    await sendDTMF(tone)
  }

  const handleDisplayKeypad = () => {

  }

  const handleBlindTransfer=() => {
    blindTransfer("3003")
  }

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "24px" }}>
      <audio id={bonTalk!.audioElementId} ref={audioRef}></audio>
      <audio loop ref={ringToneRef} src={ringtone_file}></audio>
      <audio ref={dtmfRef} src={dtmf_file}></audio>
      {/* <button onClick={handleConnect}>Connect</button> */}
      {/* <button onClick={handleDisconnect}>Disconnect</button> */}
      {/* <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button> */}
      {invitationRef ? <button onClick={handleAnswer}>Answer</button> : null}
      {invitationRef ? <button onClick={handleReject}>Reject</button> : null}
      <button onClick={handleAudioCall}>Audio Call</button>
      <button onClick={handleHangUp}>Hang Up</button>
      <button onClick={handleHold}>{isHold ? "UnHold" : "Hold"}</button>
      <button onClick={handleMute}>{isMute ? "UnMute" : "Mute"}</button>
      <button onClick={handleDisplayKeypad}>Keypad</button>
      <button onClick={handleBlindTransfer}>盲轉</button>
      <button onClick={handleDTMF("1")}>1</button>
      <button onClick={handleDTMF("2")}>2</button>
      <button onClick={handleDTMF("3")}>3</button>
      <button onClick={handleDTMF("4")}>4</button>
      <button onClick={handleDTMF("5")}>5</button>
      <button onClick={handleDTMF("6")}>6</button>
      <button onClick={handleDTMF("7")}>7</button>
      <button onClick={handleDTMF("8")}>8</button>
      <button onClick={handleDTMF("9")}>9</button>
      <button onClick={handleDTMF("0")}>0</button>
      <button onClick={handleDTMF("*")}>*</button>
      <button onClick={handleDTMF("#")}>#</button>
      {/* <span>{tone.toString()}</span> */}
    </div>
  )
}
