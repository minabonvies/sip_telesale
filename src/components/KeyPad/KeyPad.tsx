import styled from "@emotion/styled"

type Props = {
  onKeyPress: (key: string) => void
}

export default function KeyPad(props: Props) {
  return (
    <KeyPadContainer>
      {KEYS.map((key) => (
        <KeyPadButton key={key.text} onClick={() => props.onKeyPress(key.text)}>
          <div>{key.text}</div>
          {key.subText ? <div>{key.subText}</div> : null}
        </KeyPadButton>
      ))}
    </KeyPadContainer>
  )
}

const KEYS = [
  {
    text: "1",
    subText: " ",
  },
  {
    text: "2",
    subText: "ABC",
  },
  {
    text: "3",
    subText: "DEF",
  },
  {
    text: "4",
    subText: "GHI",
  },
  {
    text: "5",
    subText: "JKL",
  },
  {
    text: "6",
    subText: "MNO",
  },
  {
    text: "7",
    subText: "PQRS",
  },
  {
    text: "8",
    subText: "TUV",
  },
  {
    text: "9",
    subText: "WXYZ",
  },
  {
    text: "*",
    subText: "",
  },
  {
    text: "0",
    subText: "+",
  },
  {
    text: "#",
    subText: "",
  },
]

const KeyPadButton = styled.button({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  border: "transparent",
  borderRadius: "50%",
})

const KeyPadContainer = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(3, 72px)",
  gridAutoRows: "72px",
  gap: "24px 32px",
  backgroundColor: "transparent",
})
