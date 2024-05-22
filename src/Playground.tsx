import { useRef, useEffect, useState } from "react"
import ringtone_file from "./assets/sounds/ringtone.wav"
import ringbacktone_file from "./assets/sounds/ringbacktone.wav"
import dtmf_file from "./assets/sounds/dtmf.wav"
import useUA from "./hooks/useUA/index"

export default function Playground() {

  const { audioRef, ringToneRef, ringBackToneRef, dtmfRef, userAgentRef, connect, login, logout, audioCall, answerCall, rejectCall, hangUpCall, invitationRef } = useUA()

  const [isHold, setIsHold] = useState(false)
  const [isMute, setIsMute] = useState(false)

  const handleConnect = async () => {
    await connect()
  }

  const handleLogin = async () => {
    await login()
  }

  const handleLogout = async () => {
    await logout()
  }

  const handleAudioCall = async () => {
    await audioCall()
  }

  const handleAnswer = async () => {
    await answerCall()
  }

  const handleReject = async () => {
    await rejectCall()
  }

  const handleHangUp = async () => {
    await hangUpCall()
  }

  const handleHold = () => {
    if (!userAgentRef.current) return
    if (isHold) {
      unHold()
      setIsHold(false)
    } else {
      hold()
      setIsHold(true)
    }
  }

  const hold = async () => {
    if (!userAgentRef.current) return
    try {
      await userAgentRef.current.hold()
    } catch (error) {
      console.error(`[${userAgentRef.current!.id}] failed to hold call`)
      console.error(error)
      alert("Failed to hold call.\n" + error)
    }
  }

  const unHold = async () => {
    if (!userAgentRef.current) return
    try {
      await userAgentRef.current.unhold()
    } catch (error) {
      console.error(`[${userAgentRef.current!.id}] failed to unhold call`)
      console.error(error)
      alert("Failed to unhold call.\n" + error)
    }
  }
  const handleMute = () => {
    if (!userAgentRef.current) return
    if (userAgentRef.current.isMuted() == true) {
      unMute()
      setIsMute(false)
    } else {
      mute()
      setIsMute(true)
    }
  }

  const mute = () => {
    if (!userAgentRef.current) return
    try {
      userAgentRef.current.mute()
    } catch (error) {
      console.error(`[${userAgentRef.current!.id}] failed to mute call`)
      console.error(error)
      alert("Failed to mute call.\n" + error)
    }
  }

  const unMute = () => {
    if (!userAgentRef.current) return
    try {
      userAgentRef.current.unmute()
    } catch (error) {
      console.error(`[${userAgentRef.current!.id}] failed to unmute call`)
      console.error(error)
      alert("Failed to unmute call.\n" + error)
    }
  }

  const handleDisplayKeypad = () => { }

  const handleDTMF = (tone: string) => async () => {
    // setTone(t => t + tone)
    // console.log(tone);
    // if (!simpleUserRef.current) return
    // try {
    //   await simpleUserRef.current.sendDTMF(tone)
    // } catch (error) {
    //   console.error(`[${simpleUserRef.current!.id}] failed to sent DTMF`);
    //   console.error(error);
    //   alert("Failed to sent DTMF.\n" + error);
    // }
    // console.log(tone)
    // setTimeout(() => {
    // }, timeout);
  }

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "24px" }}>
      <audio ref={audioRef}></audio>
      <audio loop ref={ringToneRef} src={ringtone_file}></audio>
      <audio loop ref={ringBackToneRef} src={ringbacktone_file}></audio>
      <audio ref={dtmfRef} src={dtmf_file}></audio>

      <button onClick={handleConnect}>Connect</button>
      {/* <button onClick={handleDisconnect}>Disconnect</button> */}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>

      {invitationRef ? <button onClick={handleAnswer}>Answer</button> : null}
      {invitationRef ? <button onClick={handleReject}>Reject</button> : null}

      <button onClick={handleAudioCall}>Audio Call</button>
      <button onClick={handleHangUp}>Hang Up</button>
      <button onClick={handleHold}>{isHold ? "UnHold" : "Hold"}</button> <button onClick={handleMute}>{isMute ? "UnMute" : "Mute"}</button>

      {/* <button onClick={handleDisplayKeypad}>Keypad</button> */}
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
