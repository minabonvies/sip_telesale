import styled from "@emotion/styled"
import useInputKeys from "@/hooks/useInputKeys"

import ActionPad from "../ActionPad"
import NumberPad from "../NumberPad"

export default function KeyPad() {
  const { inputKeys, enterKey } = useInputKeys()

  const handleKeyPress = (key: string) => {
    enterKey(key)
  }

  return (
    <PadsContainer>
      <KeysText>{inputKeys || "輸入號碼"}</KeysText>
      <div style={{ height: "36px" }} />
      <NumberPad onKeyPress={handleKeyPress} />
      <div style={{ height: "32px" }} />
      <ActionPad />
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
})
