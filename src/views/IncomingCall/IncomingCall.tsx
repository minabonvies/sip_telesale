import styled from "@emotion/styled"
import ViewContainer from "@/components/ViewContainer"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"

export default function IncomingCall() {
  const handleActionPress = (action: ActionButtonType) => {
    switch (action) {
      case "ACCEPT_PHONE_CALL":
        console.log("ACCEPT_PHONE_CALL")
        break
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
      <div style={{ height: "56px" }} />
      <IncomingTitle>+8860912345678</IncomingTitle>
      <div style={{ flex: 1 }} />
      <ActionPad actionType="RECEIVED_CALL" onButtonClick={handleActionPress} />
    </ViewContainer>
  )
}

const IncomingTitle = styled("div")((props) => ({
  ...props.theme.typography.h1,
  color: "white",
  textAlign: "center",
  height: "32px",
}))
