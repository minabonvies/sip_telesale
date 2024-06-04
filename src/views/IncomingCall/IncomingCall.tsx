import styled from "@emotion/styled"
import ViewContainer from "@/components/ViewContainer"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"
import Header from "@/components/Header"

type Props = {
  displayTitle: string
  onAccept: () => void
  onReject: () => void
}

export default function IncomingCall(props: Props) {
  const handleActionPress = (action: ActionButtonType) => {
    switch (action) {
      case "ACCEPT_PHONE_CALL":
        console.log("ACCEPT_PHONE_CALL")
        props.onAccept()
        break
      case "HANG":
        console.log("HANG")
        props.onReject()
        break
      default:
        // DO NOT ACCEPT OTHER STUFF
        break
    }
  }
  return (
    <>
      <Header />
      <ViewContainer>
        <div style={{ height: "56px" }} />
        <IncomingTitle>{props.displayTitle}</IncomingTitle>
        <div style={{ flex: 1 }} />
        <ActionPad actionType="RECEIVED_CALL" onButtonClick={handleActionPress} />
      </ViewContainer>
    </>
  )
}

const IncomingTitle = styled("div")((props) => ({
  ...props.theme.typography.h1,
  color: "white",
  textAlign: "center",
  height: "32px",
}))
