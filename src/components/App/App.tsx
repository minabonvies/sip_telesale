import styled from "@emotion/styled"
import useInputKeys from "@/hooks/useInputKeys"
import KeyPad from "../KeyPad"
import { useBonTalk } from "@/Provider/BonTalkProvider"

export default function App() {
  const bonTalk = useBonTalk()
  const { inputKeys, enterKey } = useInputKeys()

  const handleKeyPress = (key: string) => {
    enterKey(key)
  }

  return (
    <>
      <button
        onClick={() => {
          bonTalk?.togglePanel()
        }}
      >
        Close
      </button>
      <AppContainer>
        <h2>{inputKeys}</h2>
        <KeyPad onKeyPress={handleKeyPress} />
      </AppContainer>
    </>
  )
}

const AppContainer = styled.div({
  width: "400px",
  height: "600px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "#0e0e0e",
})
