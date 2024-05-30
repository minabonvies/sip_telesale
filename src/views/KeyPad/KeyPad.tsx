import styled from "@emotion/styled"
import useInputKeys from "@/hooks/useInputKeys"

import ViewContainer from "@/components/ViewContainer"
import NumberPad from "@/components/NumberPad"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"

export default function KeyPad() {
  const { inputKeys, enterKey, deleteKey } = useInputKeys()

  const handleKeyPress = (key: string) => {
    enterKey(key)
  }

  const handleActionPress = (action: ActionButtonType) => {
    //TODO handle these action
    switch (action) {
      case "CALL_VIDEO":
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
    <ViewContainer>
      <KeysText>{inputKeys || "輸入號碼"}</KeysText>
      <div style={{ height: "34px" }} />
      <NumberPad onKeyPress={handleKeyPress} />
      <div style={{ height: "32px" }} />
      <ActionPad onButtonClick={handleActionPress} />
    </ViewContainer>
  )
}

const KeysText = styled.div((props) => ({
  ...props.theme.typography.h1,
  color: "white",
  textAlign: "center",
  height: "32px",
}))
