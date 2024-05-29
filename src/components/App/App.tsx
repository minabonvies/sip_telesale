import styled from "@emotion/styled"

import Button from "../Button"
import Cancel from "../Icons/cancel"
import KeyPad from "../KeyPad"

export default function App() {
  return (
    <AppContainer>
      <Header>
        <IconButton color="error" variant="ghost">
          <Cancel />
        </IconButton>
      </Header>
      <Content>
        <KeyPad />
      </Content>
      <Footer>Logo</Footer>
    </AppContainer>
  )
}

const IconButton = styled(Button)({
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})

const AppContainer = styled.div((props) => ({
  width: "360px",
  height: "656px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: props.theme.colors.background.default,
}))

const Header = styled.div({
  boxSizing: "border-box",
  width: "100%",
  height: "44px",
  padding: "10px 16px",
  backgroundColor: "transparent",
  display: "flex",
  justifyContent: "flex-end",
})

const Content = styled.div({
  flex: 1,
})

const Footer = styled.div({
  boxSizing: "border-box",
  width: "100%",
  height: "64px",
  backgroundColor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})
