import styled from "@emotion/styled"
import { SessionState } from "sip.js"
import { useState } from "react"

import { SessionName } from "@/entry/plugin"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import { useView } from "@/Provider/ViewProvider"
import useUA from "@/hooks/useUA"
import KeyPad from "@/views/KeyPad"
import IncomingCall from "@/views/IncomingCall"
import Calling from "@/views/Calling"

export default function App() {
  const bonTalk = useBonTalk()!
  const { view, setView } = useView()
  const { receivedInvitation, audioCall, hangupCall, answerCall, rejectCall, setMute, setHold, blindTransfer } = useUA()
  const [currentCallingTarget, setCurrentCallingTarget] = useState<SessionName | "">("")
  const [currentCallNumber, setCurrentCallNumber] = useState<string>("")

  const { session: incomingSession } = bonTalk.sessionManager.getSession("incoming")

  const handleCall = async (numbers: string) => {
    const inviter = await audioCall(numbers, "outgoing")
    setCurrentCallNumber(numbers)
    setView("IN_CALL")
    setCurrentCallingTarget("outgoing")
    inviter!.stateChange.addListener((state: SessionState) => {
      switch (state) {
        case SessionState.Terminated:
          setView("KEY_PAD")
          setCurrentCallingTarget("")
          break
      }
    })
  }

  const handleAccept = async () => {
    setCurrentCallingTarget("incoming")
    await answerCall()
  }

  const handleReject = async () => {
    setCurrentCallingTarget("")
    await rejectCall()
  }

  const handleHangClick = async () => {
    if (!currentCallingTarget) return
    setCurrentCallingTarget("")
    await hangupCall(currentCallingTarget)
  }

  const handleMuteClick = () => {
    if (!currentCallingTarget) return
    const { isMuted } = bonTalk.sessionManager.getSession(currentCallingTarget)
    setMute(!isMuted, currentCallingTarget)
  }

  const handleHoldClick = () => {
    if (!currentCallingTarget) return
    const { isHold } = bonTalk.sessionManager.getSession(currentCallingTarget)

    console.log("isHold", isHold, currentCallingTarget)
    setHold(!isHold, currentCallingTarget)
  }

  const handleForwardClick = async (number: string) => {
    if (!currentCallingTarget) return
    await blindTransfer(currentCallingTarget, number)
  }

  const handlePreForwardClick = async (number: string) => {}

  return (
    <>
      <button onClick={() => console.log(bonTalk.sessionManager.getSession("incoming"))}>123</button>
      <AppContainer>
        <Content>
          {view === "KEY_PAD" ? <KeyPad onCall={handleCall} /> : null}
          {view === "RECEIVED_CALL" ? (
            <IncomingCall displayTitle={receivedInvitation?.request.from._displayName} onAccept={handleAccept} onReject={handleReject} />
          ) : null}
          {view === "IN_CALL" ? (
            <Calling
              currentSessionName={currentCallingTarget}
              callTarget={currentCallNumber || incomingSession?.request.from._displayName || "123"}
              onHangClick={handleHangClick}
              onHoldClick={handleHoldClick}
              onMuteClick={handleMuteClick}
              onForwardClick={handleForwardClick}
            />
          ) : null}
          <ContentFooter>
            <Logo />
          </ContentFooter>
        </Content>
      </AppContainer>

      <button onClick={() => setView("KEY_PAD")}>KEYPAD</button>
      <button onClick={() => setView("RECEIVED_CALL")}>RECEIVED_CALL</button>
      <button onClick={() => setView("IN_CALL")}>IN_CALL</button>
      <div>Current Login: {bonTalk.userAgentInstance.options.displayName}</div>
    </>
  )
}

const AppContainer = styled.div((props) => ({
  width: "360px",
  height: "656px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: props.theme.colors.background.default,
}))

const Content = styled.div({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  width: "100%",
  height: "100%",
})

const ContentFooter = styled.div({
  boxSizing: "border-box",
  width: "100%",
  height: "64px",
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const Logo = styled.div({
  width: "48px",
  height: "32px",
  backgroundImage: "url(vite.svg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
})
