import styled from "@emotion/styled"

const KeyPadContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, 64px)",
  gridAutoRows: "64px",
  gap: "32px",
  backgroundColor: "transparent",
})

export default KeyPadContainer
