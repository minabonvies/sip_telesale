import styled from "@emotion/styled"
import ViewContainer from "@/components/ViewContainer"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"
import Menu from "@/components/Menu"

export default function Calling() {
  const handleActionPress = (action: ActionButtonType) => {
    switch (action) {
      case "HANG":
        console.log("HANG")
        break
      default:
        // DO NOT ACCEPT OTHER STUFF
        break
    }
  }

  return (
    <ViewContainer>
      <CallingTargetTitle>123</CallingTargetTitle>
      <div style={{ height: "24px" }} />
      <Timer>00:00:01</Timer>
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
