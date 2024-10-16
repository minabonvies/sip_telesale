import styled from "@emotion/styled"
import useInputKeys from "@/hooks/useInputKeys"

import ViewContainer from "@/components/ViewContainer"
import NumberPad from "@/components/NumberPad"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"
// import ContentHeader from "@/components/ContentHeader"
import Header from "@/components/Header"

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

  const handleFocusKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log("handleFocusKeyDown", e.key);
    if (/^[0-9*#]$/.test(e.key)) {
      handleKeyPress(e.key);
    } else if (e.key === "Enter") {
      handleActionPress("CALL")
    } else if (e.key === "Backspace") {
      handleActionPress("DELETE")
    } else if (e.key === "Escape") {
      handleActionPress("HANG")
    } else {
      console.log("DEFAULT")
    }
  }

  return (
    <>
      <Header />
      <ViewContainer
        id="key-pad"
        onClick={(e) => {
          if (e.target instanceof HTMLElement) {
            e.target.focus();
          }
        }}
        tabIndex={1} 
        onKeyDown={(e) => handleFocusKeyDown(e)}
      >
        <KeysText>{inputKeys || "輸入號碼"}</KeysText>
        <div style={{ height: "34px" }} />
        <NumberPad onKeyPress={handleKeyPress} />
        <div style={{ height: "32px" }} />
        <ActionPad onButtonClick={handleActionPress} />
      </ViewContainer>
    </>
  )
}

const KeysText = styled.div((props) => ({
  ...props.theme.typography.h1,
  color: "white",
  textAlign: "center",
  height: "32px",
}))
