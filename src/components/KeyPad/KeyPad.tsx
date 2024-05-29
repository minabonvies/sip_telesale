import styled from "@emotion/styled"
import useInputKeys from "@/hooks/useInputKeys"

import NumberPad from "../NumberPad"
import ActionPad, { type ActionButtonType } from "../ActionPad"

export default function KeyPad() {
  const { inputKeys, enterKey, deleteKey } = useInputKeys()

  const handleKeyPress = (key: string) => {
    enterKey(key)
  }

  const handleActionPress = (action: ActionButtonType) => {
    switch (action) {
      case "ACCEPT_VIDEO":
        console.log("ACCEPT_VIDEO")
        break
      case "CALL":
        console.log("CALL")
        break
      case "ACCEPT_PHONE_CALL":
        console.log("ACCEPT_PHONE_CALL")
        break
      case "FORWARD":
        console.log("FORWARD")
        break
      case "PRE_FORWARD":
        console.log("PRE_FORWARD")
        break
      case "DELETE":
        deleteKey()
        break
      case "HANG":
        console.log("HANG")
        break
      default:
        console.log("DEFAULT")
        break
    }
  }

  return (
    <PadsContainer>
      <KeysText>{inputKeys || "輸入號碼"}</KeysText>
      <div style={{ height: "34px" }} />
      <NumberPad onKeyPress={handleKeyPress} />
      <div style={{ height: "32px" }} />
      <ActionPad onButtonClick={handleActionPress} />
    </PadsContainer>
  )
}

const PadsContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  paddingTop: "16px",
})

const KeysText = styled.div({
  color: "white",
  fontSize: "24px",
  lineHeight: "normal",
  textAlign: "center",
  height: "32px",
})
