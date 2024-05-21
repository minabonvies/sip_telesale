import { useRef, useEffect, useState } from "react"
import {
  Invitation,
  Inviter,
  InviterOptions,
  Referral,
  Registerer,
  RegistererOptions,
  Session,
  SessionState,
  UserAgent,
  UserAgentOptions,
  InvitationAcceptOptions,
  Transport,
} from "sip.js"
import ringtone_file from "./assets/sounds-from-sipml/ringtone.wav"
import ringbacktone_file from "./assets/sounds-from-sipml/ringbacktone.wav"
import dtmf_file from "./assets/sounds-from-sipml/dtmf.wav"

/* transportOptions */
const webSocketServer = "wss://demo.sip.telesale.org:7443/ws"

/* userAgentOptions */
const agentUri = "sip:3002@demo.sip.telesale.org"
const authorizationUsername = "3002"
const authorizationPassword = "42633506"
const displayName = "3002 Mina"
const noAnswerTimeout = 12 // optional
const transportOptions = {
  server: webSocketServer,
  traceSip: false,
}
const contactParams = { transport: "wss" }

/* inviteOption */
const destination = "sip:3001@demo.sip.telesale.org"

export default function Playground() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ringToneRef = useRef<HTMLAudioElement | null>(null)
  const ringBackToneRef = useRef<HTMLAudioElement | null>(null)
  const dtmfRef = useRef<HTMLAudioElement | null>(null)
  const userAgentRef = useRef<UserAgent | null>(null)
  const registererRef = useRef<Registerer | null>(null)
  // const [tone, setTone] = useState('')
  const [isHold, setIsHold] = useState(false)
  const [isMute, setIsMute] = useState(false)
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (!audioRef.current) return
    /*
     * Create a user agent
     */
    const uri = UserAgent.makeURI(agentUri)
    if (!uri) {
      throw new Error("Failed to create URI")
    }

    const userAgentOptions: UserAgentOptions = {
      uri: uri,
      displayName: displayName,
      authorizationPassword: authorizationPassword,
      authorizationUsername: authorizationUsername,
      noAnswerTimeout: noAnswerTimeout,
      transportOptions: transportOptions,
      contactParams: contactParams,
      delegate: {
        onInvite: async (invitation: Invitation) => {
          setInvitation(invitation)
          setSession(invitation)
          startRingTone()
        },
      },
    }
    userAgentRef.current = new UserAgent(userAgentOptions)

    /*
     * Create a Registerer to register user agent
     */
    const registererOptions: RegistererOptions = {
      expires: 300, //Default value is 600
    }
    registererRef.current = new Registerer(userAgentRef.current, registererOptions)
  }, [])

  const handleConnect = async () => {
    if (!userAgentRef.current || userAgentRef.current.isConnected()) return

    try {
      console.log("連線中...")
      await userAgentRef.current.start()
      if (userAgentRef.current.isConnected()) console.log("已連線")
    } catch (error) {
      console.error(`[${userAgentRef.current!.instanceId}] failed to connect`)
      console.error(error)
      alert("Failed to connect.\n" + error)
    }
  }

  const handleLogin = async () => {
    if (!registererRef.current) return

    try {
      await registererRef.current.register()
      console.log("已註冊")
    } catch (error) {
      console.error(`[${userAgentRef.current!.instanceId}] failed to register`)
      console.error(error)
      alert("Failed to register.\n" + error)
    }
  }

  const handleLogout = async () => {
    console.log("取消註冊中...")
    if (!registererRef.current) return

    try {
      await registererRef.current.unregister()
      console.log("已取消註冊")
    } catch (error) {
      console.error(`[${userAgentRef.current!.instanceId}] failed to unregister`)
      console.error(error)
      alert("Failed to unregister.\n" + error)
    }
  }

  // const handleDisconnect = async () => {
  //   console.log("取消連線中...");
  //   if (!userAgentRef.current) return

  //   try {
  //     await userAgentRef.current.stop()
  //     console.log("已取消連線");
  //   } catch (error) {
  //     console.error(`[${userAgentRef.current!.instanceId}] failed to disconnect`);
  //     console.error(error);
  //     alert("Failed to disconnect.\n" + error);
  //   }
  // }

  // const remoteMedia = () => {
  //   const remoteStream = new MediaStream();
  //   function setupRemoteMedia(session: Session) {
  //     if(!session)
  //     session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
  //       if (receiver.track) {
  //         remoteStream.addTrack(receiver.track);
  //       }
  //     });
  //     mediaElement.srcObject = remoteStream;
  //     mediaElement.play();
  //   }
  // }

  const handleAudioCall = async () => {
    if (!userAgentRef.current) return
    const target = UserAgent.makeURI(destination)
    if (!target) return

    try {
      const inviter = new Inviter(userAgentRef.current, target)
      await inviter.invite()
      setSession(inviter)
      // startRingBackTone()
    } catch (error) {
      console.error(`[${userAgentRef.current!.instanceId}] failed to place call`)
      console.error(error)
      alert("Failed to place call.\n" + error)
    }
  }

  const handleAnswer = async () => {
    if (!userAgentRef.current) return
    try {
      if (!invitation) return
      const invitationAcceptOptions: InvitationAcceptOptions = {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: true,
            video: false,
          },
        },
      }
      await invitation.accept(invitationAcceptOptions)
      stopRingTone()
    } catch (error) {
      console.error(`[${userAgentRef.current!.instanceId}] failed to answer call`)
      console.error(error)
      alert("Failed to answer call.\n" + error)
    }
  }

  const handleReject = async () => {
    if (!userAgentRef.current) return
    try {
      if (!invitation) return
      await invitation.reject()
      console.log("拒接")
      stopRingTone()
    } catch (error) {
      console.error(`[${userAgentRef.current!.instanceId}] failed to reject call`)
      console.error(error)
      alert("Failed to reject call.\n" + error)
    }
  }

  const handleHangUp = async () => {
    if (!session) return

    try {
      if (session.state === SessionState.Established) {
        await session.bye()
        console.log("Session HangUp:BYE")
      }
      // switch (session.state) {
      //   case SessionState.Initial:
      //   case SessionState.Establishing:
      //   case SessionState.Established:

      //     break
      //   case SessionState.Terminating:
      //   case SessionState.Terminated:
      //     // Cannot terminate a session that is already terminated
      //     break
      // }
    } catch (error) {
      console.error(`[${userAgentRef.current!.instanceId}] failed to hangup call`)
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
  const startRingBackTone = () => {
    if (!ringBackToneRef.current) return

    try {
      ringBackToneRef.current.play()
    } catch (e) {
      console.log(e)
    }
  }
  const stopRingBackTone = () => {
    if (!ringBackToneRef.current) return

    try {
      ringBackToneRef.current.pause()
    } catch (e) {
      console.log(e)
    }
  }
  const handleHold = () => {
    if (!userAgentRef.current) return
    if (userAgentRef.current.isHeld() == true) {
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

  const handleDisplayKeypad = () => {}

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
      <audio loop ref={ringToneRef} src={ringtone_file}>
        {" "}
      </audio>
      <audio loop ref={ringBackToneRef} src={ringbacktone_file}>
        {" "}
      </audio>
      <audio ref={dtmfRef} src={dtmf_file}>
        {" "}
      </audio>

      <button onClick={handleConnect}>Connect</button>
      {/* <button onClick={handleDisconnect}>Disconnect</button> */}
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleAudioCall}>Audio Call</button>
      <button onClick={handleReject}>Reject</button>
      {invitation ? <button onClick={handleAnswer}>Answer</button> : null}

      <button onClick={handleHangUp}>Hang Up</button>
      <button onClick={handleHold}>{isHold ? "UnHold" : "Hold"}</button>
      <button onClick={handleMute}>{isMute ? "UnMute" : "Mute"}</button>
      <button onClick={handleDisplayKeypad}>Keypad</button>
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
