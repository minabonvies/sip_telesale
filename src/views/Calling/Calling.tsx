import { useEffect } from "react"
import styled from "@emotion/styled"
import ViewContainer from "@/components/ViewContainer"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"
import Menu from "@/components/Menu"
import useTimer from "@/hooks/useTimer"

type CallingProps = {
  callTarget: string
  onHangClick: () => void
}

export default function Calling(props: CallingProps) {
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

  return (
    <ViewContainer>
      <CallingTargetTitle>{props.callTarget}</CallingTargetTitle>
      <div style={{ height: "24px" }} />
      <Timer>{formattedTime}</Timer>
      <div style={{ flex: 1 }} />
      <Menu />
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
