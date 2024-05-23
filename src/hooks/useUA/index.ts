import { useEffect, useRef, useState } from "react";
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
    Transport, InviterInviteOptions, IncomingResponse
} from 'sip.js'

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

export default function useUA() {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const ringToneRef = useRef<HTMLAudioElement | null>(null)
    const ringBackToneRef = useRef<HTMLAudioElement | null>(null)
    const dtmfRef = useRef<HTMLAudioElement | null>(null)

    const userAgentRef = useRef<UserAgent | null>(null)
    const registererRef = useRef<Registerer | null>(null)
    const inviterRef = useRef<Inviter | null>(null)
    const invitationRef = useRef<Invitation | null>(null)
    // const [invitation, setInvitation] = useState<Invitation | null>(null)
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
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
                    invitationRef.current = invitation
                    // setInvitation(invitation)
                    // setSession(invitation)
                    startRingTone()
                },

            },
        }
        userAgentRef.current = new UserAgent(userAgentOptions)

        const registererOptions: RegistererOptions = {
            expires: 300, //Default value is 600
        }
        registererRef.current = new Registerer(userAgentRef.current, registererOptions)
    }, [])

    const connect = async () => {
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

    const login = async () => {
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

    const logout = async () => {
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

    const audioCall = async () => {
        if (!userAgentRef.current) return
        const target = UserAgent.makeURI(destination)
        if (!target) return

        try {
            const inviteOptions: InviterInviteOptions = {
                requestDelegate: {
                    onAccept: (response) => {
                        console.log('onAccept');
                        // stopRingBackTone()
                    },
                    onProgress: () => {
                        console.log('onProgress');

                    },
                    onReject: () => {
                        console.log('onReject');
                        // stopRingBackTone()
                    },
                    onRedirect: () => {
                        console.log('onRedirect');

                    },
                    onTrying: () => {
                        console.log('onTrying');

                    }
                }
            }
            inviterRef.current = new Inviter(userAgentRef.current, target)
            inviterRef.current.stateChange.addListener((state: SessionState) => {
                console.log(`Session state changed to ${state}`);
                switch (state) {
                    case SessionState.Initial:
                        console.log("Initial");

                        break;
                    case SessionState.Establishing:
                        console.log("Establishing");

                        break;
                    case SessionState.Established:
                        // setupRemoteMedia(inviter);
                        console.log("Established");

                        break;
                    case SessionState.Terminating:
                        console.log("Terminating");
                        break
                    // fall through
                    case SessionState.Terminated:
                        console.log("Terminated");

                        // cleanupMedia();
                        break;
                    default:
                        throw new Error("Unknown session state.");
                }
            });
            await inviterRef.current.invite(inviteOptions)
            console.log("撥出電話中...");
            // startRingBackTone()

        } catch (error) {
            console.error(`[${userAgentRef.current!.instanceId}] failed to place call`)
            console.error(error)
            alert("Failed to place call.\n" + error)
        }
    }

    const answerCall = async () => {
        if (!userAgentRef.current) return
        try {
            if (!invitationRef.current) return
            const invitationAcceptOptions: InvitationAcceptOptions = {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: true,
                        video: false,
                    },
                },
            }
            await invitationRef.current.accept(invitationAcceptOptions)
            stopRingTone()
            console.log("已接聽電話");
        } catch (error) {
            console.error(`[${userAgentRef.current!.instanceId}] failed to answer call`)
            console.error(error)
            alert("Failed to answer call.\n" + error)
        }
    }

    const rejectCall = async () => {
        if (!userAgentRef.current) return
        try {
            if (!invitationRef.current) return
            await invitationRef.current.reject()
            console.log("拒接")
            stopRingTone()
        } catch (error) {
            console.error(`[${userAgentRef.current!.instanceId}] failed to reject call`)
            console.error(error)
            alert("Failed to reject call.\n" + error)
        }
    }

    const hangUpCall = async () => {
        try {
            if (inviterRef.current?.state === SessionState.Established) {
                await inviterRef.current.bye()
                await inviterRef.current.dispose()
                console.log("Outgoing Call HangUp : BYE()")
            }

            if (invitationRef.current?.state === SessionState.Established) {
                await invitationRef.current.bye()
                await invitationRef.current.dispose()
                console.log("Ingoing Call HangUp : BYE()");
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

    const dtmfTone = () => {
        if (!dtmfRef.current) return

        try {
            dtmfRef.current.play()
        } catch (e) {
            console.log(e);
        }
    }

    const hold = async () => {
        try {
            // if (inviterRef.current?.state === SessionState.Established) {
            //     await inviterRef.current?.invite()
            // }

            // await invitationRef.current?.invite()
        } catch (error) {
            console.error(`[${userAgentRef.current!.id}] failed to hold call`)
            console.error(error)
            alert("Failed to hold call.\n" + error)
        }
    }


    return {
        audioRef, ringToneRef, ringBackToneRef, dtmfRef, userAgentRef, connect, login, logout, audioCall, answerCall, rejectCall, hangUpCall, invitationRef
    }
}