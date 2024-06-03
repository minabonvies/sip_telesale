import styled from "@emotion/styled"

import { useBonTalk } from "@/Provider/BonTalkProvider"
import KeyPad from "@/views/KeyPad"
import IncomingCall from "@/views/IncomingCall"
import Button from "../Button"
import Cancel from "../Icons/cancel"
import Hide from "../Icons/hide"
import Calling from "@/views/Calling"
import useUA from "@/hooks/useUA"

import { useView } from "@/Provider/ViewProvider"
import { SessionState } from "sip.js"
import { useState } from "react"

export default function App() {
  const bonTalk = useBonTalk()!
  const { view, setView } = useView()
  const { receivedInvitation, audioCall, hangupCall, answerCall, rejectCall } = useUA()
  const [currentCallingTarget, setCurrentCallingTarget] = useState<string>("")
  const [currentCallNumber, setCurrentCallNumber] = useState<string>("")

  const incomingSession = bonTalk.sessionManager.getSession("incoming")

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
    setCurrentCallingTarget("")
    await hangupCall(currentCallingTarget)
  }

  return (
    <>
      <button onClick={() => console.log(bonTalk.sessionManager.getSession("incoming"))}>123</button>
      <AppContainer>
        <Header>
          {/* 上一步的按鈕？ */}
          <IconButton color="error" variant="ghost">
            <Cancel />
          </IconButton>
          {/* 隱藏按鈕 */}
          <IconButton color="error" variant="ghost" onClick={() => bonTalk?.togglePanel()}>
            <Hide />
          </IconButton>
        </Header>
        <Content>
          {view === "KEY_PAD" ? <KeyPad onCall={handleCall} /> : null}
          {view === "RECEIVED_CALL" ? (
            <IncomingCall displayTitle={receivedInvitation?.request.from._displayName} onAccept={handleAccept} onReject={handleReject} />
          ) : null}
          {view === "IN_CALL" ? (
            <Calling callTarget={currentCallNumber || incomingSession.request.from._displayName} onHangClick={handleHangClick} />
          ) : null}
        </Content>
        <Footer>
          <Logo />
        </Footer>
      </AppContainer>

      <button onClick={() => setView("KEY_PAD")}>KEYPAD</button>
      <button onClick={() => setView("RECEIVED_CALL")}>RECEIVED_CALL</button>
      <button onClick={() => setView("IN_CALL")}>IN_CALL</button>
      <div>Current Login: {bonTalk.userAgentInstance.options.displayName}</div>
    </>
  )
}

const IconButton = styled(Button)({
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const AppContainer = styled.div((props) => ({
  width: "360px",
  height: "656px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: props.theme.colors.background.default,
}))

const Header = styled.div({
  boxSizing: "border-box",
  width: "100%",
  height: "44px",
  padding: "10px 16px",
  backgroundColor: "transparent",
  display: "flex",
  justifyContent: "flex-end",
})

const Content = styled.div({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  width: "100%",
  height: "100%",
})

const Footer = styled.div({
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
