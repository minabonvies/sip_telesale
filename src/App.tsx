import { useRef, useEffect, useState } from 'react'
import { Web } from "sip.js";
import './App.css'
import ringtone_file from './assets/sounds-from-sipml/ringtone.wav';
import ringbacktone_file from './assets/sounds-from-sipml/ringbacktone.wav';
import dtmf_file from './assets/sounds-from-sipml/dtmf.wav';

const webSocketServer = "wss://demo.sip.telesale.org:7443/ws"
const destination = "sip:3001@demo.sip.telesale.org"
const agentUri = "sip:3002@demo.sip.telesale.org"
const authorizationUsername = "3002"
const authorizationPassword = "42633506"
const noAnswerTimeout = 12 // optional

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ringToneRef = useRef<HTMLAudioElement | null>(null)
  const ringBackToneRef = useRef<HTMLAudioElement | null>(null)
  const dtmfRef = useRef<HTMLAudioElement | null>(null)
  const simpleUserRef = useRef<Web.SimpleUser | null>(null)
  // const [tone, setTone] = useState('')
  const [isHold, setIsHold] = useState(false)
  const [isMute, setIsMute] = useState(false)


  useEffect(() => {
    if (!audioRef.current) return
    if (!simpleUserRef.current) return
    const simpleUserOptions: Web.SimpleUserOptions = {
      aor: agentUri,
      delegate: {
        onCallReceived: async () => {
          console.log("onCallReceived Incoming Call!");
          startRingTone()
          // 來電畫面
        },
        onCallCreated: async () => {
          stopRingBackTone()
          // 通話中畫面
        }
      },
      media: {
        constraints: {
          audio: true,
          video: true,
        },
        remote: {
          audio: audioRef.current,
        },
      },
      userAgentOptions: {
        authorizationPassword,
        authorizationUsername,
        noAnswerTimeout
      }
    }
    simpleUserRef.current = new Web.SimpleUser(webSocketServer, simpleUserOptions)
  }, [])

  const handleConnect = async () => {
    if (!simpleUserRef.current) return

    try {
      await simpleUserRef.current.connect()
      console.log("Connected")
      await simpleUserRef.current.register()//registererOptions,registererRegisterOptions
      console.log("Registered");
    } catch (error) {
      console.error(`[${simpleUserRef.current!.id}] failed to connect`);
      console.error(error);
      alert("Failed to connect.\n" + error);
    }
  }

  const handleDisconnect = async () => {
    if (!simpleUserRef.current) return

    try {
      await simpleUserRef.current.unregister()
      await simpleUserRef.current.disconnect()//registererUnregisterOptions
      console.log("Disconnected");
    } catch (error) {
      console.error(`[${simpleUserRef.current!.id}] failed to disconnect`);
      console.error(error);
      alert("Failed to disconnect.\n" + error);
    }
  }

  const handleCall = async () => {
    if (!simpleUserRef.current) return

    try {
      await simpleUserRef.current.call(destination, { inviteWithoutSdp: false })
      startRingBackTone()
    } catch (error) {
      console.error(`[${simpleUserRef.current!.id}] failed to place call`);
      console.error(error);
      alert("Failed to place call.\n" + error);
    }
  }

  const handleAnswer = async () => {
    if (!simpleUserRef.current) return

    try {
      await simpleUserRef.current.answer()
      stopRingTone()
    } catch (error) {
      console.error(`[${simpleUserRef.current!.id}] failed to answer call`);
      console.error(error);
      alert("Failed to answer call.\n" + error);
    }
  }

  const handleReject = async () => {
    if (!simpleUserRef.current) return

    try {
      await simpleUserRef.current.decline()
      stopRingTone()
    } catch (error) {
      console.error(`[${simpleUserRef.current!.id}] failed to reject call`);
      console.error(error);
      alert("Failed to reject call.\n" + error);
    }
  }

  const handleHangUp = async () => {
    if (!simpleUserRef.current) return

    try {
      await simpleUserRef.current.hangup()
    } catch (error) {
      console.error(`[${simpleUserRef.current!.id}] failed to hangup call`);
      console.error(error);
      alert("Failed to hangup call.\n" + error);
    }
  }

  const startRingTone = () => {
    if (!ringToneRef.current) return

    try { ringToneRef.current.play(); }
    catch (e) {
      console.log(e);
    }
  }
  const stopRingTone = () => {
    if (!ringToneRef.current) return

    try { ringToneRef.current.pause(); }
    catch (e) {
      console.log(e);
    }
  }
  const startRingBackTone = () => {
    if (!ringBackToneRef.current) return

    try { ringBackToneRef.current.play(); }
    catch (e) {
      console.log(e);
    }
  }
  const stopRingBackTone = () => {
    if (!ringBackToneRef.current) return

    try { ringBackToneRef.current.pause(); }
    catch (e) {
      console.log(e);
    }
  }
  const handleHold = () => {
    if (!simpleUserRef.current) return
    if (simpleUserRef.current.isHeld() == true) {
      unHold()
      setIsHold(false)
    } else {
      hold()
      setIsHold(true)
    }
  }

  const hold = async () => {
    if (!simpleUserRef.current) return
    try {
      await simpleUserRef.current.hold()
    } catch (error) {
      console.error(`[${simpleUserRef.current!.id}] failed to hold call`);
      console.error(error);
      alert("Failed to hold call.\n" + error);
    }
  }

  const unHold = async () => {
    if (!simpleUserRef.current) return
    try {
      await simpleUserRef.current.unhold()
    } catch (error) {
      console.error(`[${simpleUserRef.current!.id}] failed to unhold call`);
      console.error(error);
      alert("Failed to unhold call.\n" + error);
    }
  }
  const handleMute = () => {
    if (!simpleUserRef.current) return
    if (simpleUserRef.current.isMuted() == true) {
      unMute()
      setIsMute(false)
    } else {
      mute()
      setIsMute(true)
    }
  }

  const mute = () => {
    if (!simpleUserRef.current) return
    try {
      simpleUserRef.current.mute()
    } catch (error) {
      console.error(`[${simpleUserRef.current!.id}] failed to mute call`);
      console.error(error);
      alert("Failed to mute call.\n" + error);
    }
  }

  const unMute = () => {
    if (!simpleUserRef.current) return
    try {
      simpleUserRef.current.unmute()
    } catch (error) {
      console.error(`[${simpleUserRef.current!.id}] failed to unmute call`);
      console.error(error);
      alert("Failed to unmute call.\n" + error);
    }
  }

  const displayKeypad = () => {

  }

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
    <>
      <audio ref={audioRef}></audio>
      <audio ref={ringToneRef} src={ringtone_file}> </audio>
      <audio ref={ringBackToneRef} src={ringbacktone_file}> </audio>
      <audio ref={dtmfRef} src={dtmf_file}> </audio>

      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDisconnect}>Disconnect</button>
      <button onClick={handleCall}>Call</button>
      <button onClick={handleReject}>Reject</button>
      <button onClick={handleAnswer}>Answer</button>
      <button onClick={handleHangUp}>Hang Up</button>
      <button onClick={handleHold}>{isHold ? 'UnHold' : 'Hold'}</button>
      <button onClick={handleMute}>{isMute ? 'UnMute' : 'Mute'}</button>
      <button onClick={displayKeypad}>Keypad</button>
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
    </>
  )
}

export default App
