import styled from "@emotion/styled"
import useInputKeys from "@/hooks/useInputKeys"
import KeyPad from "../KeyPad"

import viteSvg from "/vite.svg"
import testSvg from "@/assets/test.svg"
import dtmf from "@/assets/sounds/dtmf.wav"
import ringtone from "@/assets/sounds/ringtone.wav"

console.log(dtmf)

export default function App() {
  const { inputKeys, enterKey } = useInputKeys()

  const handleKeyPress = (key: string) => {
    enterKey(key)
  }

  return (
    <>
      <AppContainer>
        <img src={viteSvg} alt="Vite Logo" />
        <img src={testSvg} alt="Test Logo" />
        <audio controls>
          <source src={dtmf} type="audio/wav" />
        </audio>
        <button
          onClick={() => {
            bonTalk?.togglePanel()
          }}
        >
          Close
        </button>
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
