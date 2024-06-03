import { useEffect, useSyncExternalStore } from "react"
import styled from "@emotion/styled"
import ViewContainer from "@/components/ViewContainer"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"
import Menu from "@/components/Menu"
import useTimer from "@/hooks/useTimer"
import { SessionName } from "@/entry/plugin"
import { useBonTalk } from "@/Provider/BonTalkProvider"

type CallingProps = {
  sessionName: SessionName
  callTarget: string
  onHangClick: () => void
  onHoldClick: () => void
  onMuteClick: () => void
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

  return (
    <ViewContainer>
      {isMuted && <div>Muted</div>}
      {!isMuted && <div>Not Muted</div>}
      <CallingTargetTitle>{props.callTarget}</CallingTargetTitle>
      <div style={{ height: "24px" }} />
      <Timer>{formattedTime}</Timer>
      <div style={{ flex: 1 }} />
      <Menu isMuted={isMuted} isHold={isHold} onMuteClick={handleMuteClick} onHoldClick={handleHoldClick} />
      <div style={{ flex: 1 }} />
      <ActionPad actionType="CALLING" onButtonClick={handleActionPress} />
    </ViewContainer>
  )
}

const CallingTargetTitle = styled("div")((props) => ({
  ...props.theme.typography.h1,
  color: props.theme.colors.text.primary,
}))

const Timer = styled("div")((props) => ({
  ...props.theme.typography.h2,
  color: props.theme.colors.text.primary,
}))
