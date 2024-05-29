import styled from "@emotion/styled"

const KeyPadContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, 64px)",
  gridAutoRows: "64px",
  gap: "32px",
  backgroundColor: "transparent",
  // outline: "1px solid white",
})

export default KeyPadContainer
