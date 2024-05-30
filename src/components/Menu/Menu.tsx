import styled from "@emotion/styled"

export default function Menu() {
  return (
    <MenuContainer>
      <div>靜音</div>
      <div>保留</div>
      <div>按鈕</div>
      <div>視訊</div>
      <div>轉接</div>
      <div>通話轉</div>
    </MenuContainer>
  )
}

const MenuContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
})
