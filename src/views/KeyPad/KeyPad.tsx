import styled from "@emotion/styled"
import useInputKeys from "@/hooks/useInputKeys"

import ViewContainer from "@/components/ViewContainer"
import NumberPad from "@/components/NumberPad"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"

type KeyPadProps = {
  onCall: (numbers: string) => void
}

export default function KeyPad(props: KeyPadProps) {
  const { inputKeys, enterKey, deleteKey } = useInputKeys()

  const handleKeyPress = (key: string) => {
    enterKey(key)
  }

  const handleActionPress = (action: ActionButtonType) => {
    switch (action) {
      case "CALL":
        console.log("CALL")
        props.onCall(inputKeys)
        break
      case "DELETE":
        deleteKey()
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
