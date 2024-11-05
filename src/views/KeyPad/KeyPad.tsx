import styled from "@emotion/styled"
import useInputKeys from "@/hooks/useInputKeys"

import ViewContainer from "@/components/ViewContainer"
import NumberPad from "@/components/NumberPad"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"
// import ContentHeader from "@/components/ContentHeader"
import Header from "@/components/Header"
import { useAudio } from "@/Provider/AudioProvider"

type KeyPadProps = {
  onCall: (numbers: string) => void
}

export default function KeyPad(props: KeyPadProps) {
  const { inputKeys, enterKey, deleteKey } = useInputKeys()
  const { toggleDTMF } = useAudio()
  const handleKeyPress = (key: string) => {
      enterKey(key)
      toggleDTMF()
  }
  const handleActionPress = (action: ActionButtonType) => {
    switch (action) {
      case "CALL":
        if (inputKeys) {
          props.onCall(inputKeys)
        }
        break
      case "DELETE":
        deleteKey()
        break
      default:
        throw new Error("Invalid action")
    }
  }

  const handleFocusKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (/^[0-9*#]$/.test(e.key)) {
      handleKeyPress(e.key);
    } else if (e.key === "Enter") {
      handleActionPress("CALL")
    } else if (e.key === "Backspace") {
      handleActionPress("DELETE")
    } else {
      throw new Error("Invalid key")
    }
  }

  return (
    <>
      <Header />
      <ViewContainer
        id="key-pad"
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
