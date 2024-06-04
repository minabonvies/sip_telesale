import { useEffect, useState, useSyncExternalStore } from "react"
import styled from "@emotion/styled"
import ViewContainer from "@/components/ViewContainer"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"
import Menu from "@/components/Menu"
import useTimer from "@/hooks/useTimer"
import { SessionName } from "@/entry/plugin"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import KeyPad from "../KeyPad"
import NumberPad from "@/components/NumberPad"
import Header from "@/components/Header"
import useInputKeys from "@/hooks/useInputKeys"

type CallingProps = {
  sessionName: SessionName
  callTarget: string
  onHangClick: () => void
  onHoldClick: () => void
  onMuteClick: () => void
  onKeyPadClick: () => void
}

let listeners: ((...argus: unknown[]) => unknown)[] = []
function subscribe(listener: (...argus: unknown[]) => unknown) {
  listeners = [...listeners, listener]
  return () => listeners.filter((l) => l !== listener)
}

export default function Calling(props: CallingProps) {
  const bonTalk = useBonTalk()!

  const isMuted = useSyncExternalStore(subscribe, () => bonTalk.sessionManager.getSession(props.sessionName).isMuted)
  const isHold = useSyncExternalStore(subscribe, () => bonTalk.sessionManager.getSession(props.sessionName).isHold)

  const [openKeyPad, setOpenKeyPad] = useState(false)
  const [actionPayType, setActionPadType] = useState<"CALLING" | "DTMF" | "FORWARD" | "PRE_FORWARD" | "DEFAULT">("DEFAULT")
  const { inputKeys, enterKey, deleteKey } = useInputKeys()

  const { time, start, stop } = useTimer()
  // seconds to hh:mm:ss
  const formattedTime = new Date(time * 1000).toISOString().slice(11, 19)

  useEffect(() => {
    start()
  }, [])

  const handleActionPress = (action: ActionButtonType) => {
    switch (action) {
      case "HANG":
        props.onHangClick()
        stop()
        break
      case "DELETE":
        deleteKey()
        break
      default:
        // DO NOT ACCEPT OTHER STUFF
        break
    }
  }

  const handleMuteClick = () => {
    props.onMuteClick()
  }

  const handleHoldClick = () => {
    props.onHoldClick()
  }

  const handleKeyPadClick = () => {
    setOpenKeyPad((p) => !p)
    setActionPadType("DTMF")
    props.onKeyPadClick()
  }

  const handleKeyPress = (key: string) => {
    enterKey(key)
  }

  const handleCancelClick = () => {
    setOpenKeyPad(false)
    setActionPadType("DEFAULT")
  }

  // transfer
  const handleSwitchClick = () => {
    setOpenKeyPad(true)
    setActionPadType("FORWARD")
  }

  const handlePreForwardClick = () => {
    setOpenKeyPad(true)
    setActionPadType("PRE_FORWARD")
  }

  return (
    <>
      <Header showCancelButton={openKeyPad} onCancelClick={handleCancelClick} />
      <ViewContainer>
        {/* 通話畫面 */}
        {!openKeyPad ? (
          <>
            <CallingTargetTitle>{props.callTarget}</CallingTargetTitle>
            <div style={{ height: "24px" }} />
            <Timer>{formattedTime}</Timer>
            <div style={{ flex: 1 }} />
            <Menu
              isMuted={isMuted}
              isHold={isHold}
              onMuteClick={handleMuteClick}
              onHoldClick={handleHoldClick}
              onKeyPadClick={handleKeyPadClick}
              onSwitchClick={handleSwitchClick}
              onPreForwardClick={handlePreForwardClick}
            />
            <div style={{ flex: 1 }} />
            <ActionPad actionType="CALLING" onButtonClick={handleActionPress} />
          </>
        ) : null}
        {/* keypad usage / DTMF ? */}
        {openKeyPad ? (
          <>
            <CallingTargetTitle>{inputKeys}</CallingTargetTitle>
            <div style={{ height: "34px" }} />
            <NumberPad dtmf={actionPayType === "DTMF"} onKeyPress={handleKeyPress} />
            <div style={{ height: "32px" }} />
            <ActionPad actionType={actionPayType} onButtonClick={handleActionPress} />
          </>
        ) : null}
      </ViewContainer>
    </>
  )
}

const CallingTargetTitle = styled("div")((props) => ({
  ...props.theme.typography.h1,
  color: props.theme.colors.text.primary,
  height: "32px",
}))

const Timer = styled("div")((props) => ({
  ...props.theme.typography.h2,
  color: props.theme.colors.text.primary,
}))
