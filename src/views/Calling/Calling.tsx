import { useState, useSyncExternalStore } from "react"
import styled from "@emotion/styled"
import ViewContainer from "@/components/ViewContainer"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"
import Menu from "@/components/Menu"
import { SessionName } from "@/entry/plugin"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import NumberPad from "@/components/NumberPad"
import Header from "@/components/Header"
import useInputKeys from "@/hooks/useInputKeys"

type CallingProps = {
  currentSessionName: SessionName | ""

  callTarget: string
  prevTarget: string | ""

  onHangClick: () => void
  onHoldClick: () => void
  onMuteClick: () => void
  // onKeyPadClick: () => void
  onForwardClick: (number: string) => void
  onPreForwardSendCall: (number: string) => void

  onDTMFClick: (key: string) => void
}

export default function Calling(props: CallingProps) {
  const bonTalk = useBonTalk()!

  const currentSession = useSyncExternalStore(bonTalk.sessionManager.subscribe.bind(bonTalk.sessionManager), () =>
    bonTalk.sessionManager.getSession(props.currentSessionName)
  )

  const prevSession = useSyncExternalStore(bonTalk.sessionManager.subscribe.bind(bonTalk.sessionManager), () =>
    bonTalk.sessionManager.getSession(props.prevTarget)
  )

  const isHold = currentSession?.isHold || false
  const isMuted = currentSession?.isMuted || false
  const time = currentSession?.time || 0

  const [openKeyPad, setOpenKeyPad] = useState(false)
  const [actionPadType, setActionPadType] = useState<"CALLING" | "DTMF" | "FORWARD" | "PRE_FORWARD" | "DEFAULT">("DEFAULT")
  const { inputKeys, enterKey, deleteKey } = useInputKeys()

  // seconds to hh:mm:ss
  const currentSessionTime = new Date(time * 1000).toISOString().slice(11, 19)
  const prevSessionTime = new Date((prevSession?.time || 0) * 1000).toISOString().slice(11, 19)

  const handleActionPress = (action: ActionButtonType) => {
    switch (action) {
      case "HANG":
        setOpenKeyPad(false)
        props.onHangClick()
        break
      case "FORWARD":
        props.onForwardClick(inputKeys)
        break
      case "PRE_FORWARD":
        handlePreForwardSendCall()
        break

      case "DELETE":
        deleteKey()
        break
      default:
        console.log(action)
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

  // this toggle keypad view
  const handleKeyPadClick = () => {
    setOpenKeyPad((p) => !p)
    setActionPadType("DTMF")
    // props.onKeyPadClick()
  }

  const handleKeyPress = (key: string) => {
    if (actionPadType) {
      props.onDTMFClick(key)
    }

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

  const handlePreForwardSendCall = async () => {
    props.onPreForwardSendCall(inputKeys)
    setOpenKeyPad(false)
  }

  console.log("keypad", openKeyPad)
  console.log("prevTarget", props.prevTarget)

  return (
    <>
      <Header
        showInformation={Boolean(openKeyPad || props.prevTarget)}
        informationTitle={props.prevTarget ? prevSession?.name : props.callTarget}
        time={props.prevTarget ? prevSessionTime : currentSessionTime}
        showCancelButton={openKeyPad}
        onCancelClick={handleCancelClick}
      />
      <ViewContainer>
        {/* 通話畫面 */}
        {!openKeyPad ? (
          <>
            <CallingTargetTitle>{props.callTarget}</CallingTargetTitle>
            <div style={{ height: "24px" }} />
            <Timer>{currentSessionTime}</Timer>
            <div style={{ flex: 1 }} />
            <Menu
              isMuted={isMuted}
              isHold={isHold}
              onMuteClick={handleMuteClick}
              onHoldClick={handleHoldClick}
              onKeyPadClick={handleKeyPadClick}
              onSwitchClick={handleSwitchClick}
              onPreForwardClick={handlePreForwardClick}
              disabledTransfer={props.currentSessionName === "attendedRefer"}
            />
            <div style={{ flex: 1 }} />
            <ActionPad
              actionType={props.currentSessionName === "attendedRefer" ? "READY_FORWARD" : "CALLING"}
              onButtonClick={handleActionPress}
            />
          </>
        ) : null}
        {/* keypad usage / DTMF ? */}
        {openKeyPad ? (
          <>
            <CallingTargetTitle>{inputKeys}</CallingTargetTitle>
            <div style={{ height: "34px" }} />
            <NumberPad dtmf={actionPadType === "DTMF"} onKeyPress={handleKeyPress} />
            <div style={{ height: "32px" }} />
            <ActionPad actionType={actionPadType} onButtonClick={handleActionPress} />
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
