import React from "react"
import styled from "@emotion/styled"
import Button from "../Button"

type Props = React.ComponentProps<typeof KeyPadButtonContainer> & {
  text: React.ReactNode
  subText?: string
}

export default function KeyPadButton(props: Props) {
  const { text, subText, ...restProps } = props

  return (
    <KeyPadButtonContainer {...restProps} >
      <div className="text">{text}</div>
      {subText ? <div className="subText">{subText}</div> : null}
    </KeyPadButtonContainer>
  )
}

const KeyPadButtonContainer = styled(Button)(() => {
  return {
    width: "64px",
    height: "64px",
    aspectRatio: "1/1",
    borderRadius: "50%",
    border: "none",
    padding: "unset",
    outline: "none",
    margin: "auto",

    "& > .text": {
      fontSize: "32px",
      fontWeight: "500",
    },
    "& > .subText": {
      fontSize: "10px",
      fontWeight: "600",
    },
  }
})
