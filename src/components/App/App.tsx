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
  const { audioCall, hangupCall } = useUA()

  const [currentCallNumber, setCurrentCallNumber] = useState<string>("")

  const handleCall = async (numbers: string) => {
    const inviter = await audioCall(numbers)
    setCurrentCallNumber(numbers)
    setView("IN_CALL")
    inviter!.stateChange.addListener((state: SessionState) => {
      switch (state) {
        case SessionState.Terminated:
          setView("KEY_PAD")
          break
      }
    })
  }

  const handleHangClick = async () => {
    await hangupCall()
  }

  return (
    <>
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
          {view === "RECEIVED_CALL" ? <IncomingCall /> : null}
          {view === "IN_CALL" ? <Calling callTarget={currentCallNumber} onHangClick={handleHangClick} /> : null}
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
