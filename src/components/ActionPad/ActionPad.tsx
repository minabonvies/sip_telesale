import { useEffect } from "react"
import KeyPadContainer from "../KeyPadContainer"
import KeyPadButton from "../KeyPadButton"
import Video from "../Icons/video"
import Delete from "../Icons/delete"
import Phone from "../Icons/phone"
import Switch from "../Icons/switch"
import PreForward from "../Icons/pre-forward"
import Hang from "../Icons/hang"

type Props = {
  actionType?: "DEFAULT" | "RECEIVED_CALL" | "CALLING" | "FORWARD" | "PRE_FORWARD" | "READY_FORWARD" | "DTMF"
  onButtonClick?: (buttonType: ActionButtonType) => void
}

export type ActionButtonType = "CALL_VIDEO" | "CALL" | "ACCEPT_PHONE_CALL" | "FORWARD" | "PRE_FORWARD" | "DELETE" | "HANG"

export default function ActionPad(props: Props) {
  const actionType = props.actionType || "DEFAULT"

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 檢查 key 是否為 '0' 到 '9'、'*'、'#'
      switch (e.key) {
        case 'Backspace': {
          props.onButtonClick?.("DELETE")
          break;
        }
        case 'Enter': {
          props.onButtonClick?.("CALL")
          break;
        }
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props]);

  return (
    <KeyPadContainer>
      {actionType === "DEFAULT" && (
        <>
          <KeyPadButton color="success" text={<Video />} disabled onClick={() => props.onButtonClick?.("CALL_VIDEO")} />
          <KeyPadButton color="success" text={<Phone />} onClick={() => props.onButtonClick?.("CALL")} />
          <KeyPadButton color="secondary" text={<Delete />} onClick={() => props.onButtonClick?.("DELETE")} />
        </>
      )}

      {actionType === "RECEIVED_CALL" && (
        <>
          <KeyPadButton color="success" text={<Phone />} onClick={() => props.onButtonClick?.("ACCEPT_PHONE_CALL")} />
          <div />
          <KeyPadButton color="error" text={<Hang />} onClick={() => props.onButtonClick?.("HANG")} />
        </>
      )}

      {actionType === "CALLING" && (
        <>
          <div />
          <KeyPadButton color="error" text={<Hang />} onClick={() => props.onButtonClick?.("HANG")} />
          <div />
        </>
      )}

      {actionType === "FORWARD" && (
        <>
          <div />
          <KeyPadButton color="success" text={<Switch />} onClick={() => props.onButtonClick?.("FORWARD")} />
          <KeyPadButton color="secondary" text={<Delete />} onClick={() => props.onButtonClick?.("DELETE")} />
        </>
      )}

      {actionType === "PRE_FORWARD" && (
        <>
          <div />
          <KeyPadButton color="success" text={<PreForward />} onClick={() => props.onButtonClick?.("PRE_FORWARD")} />
          <KeyPadButton color="secondary" text={<Delete />} onClick={() => props.onButtonClick?.("DELETE")} />
        </>
      )}

      {actionType === "READY_FORWARD" && (
        <>
          <KeyPadButton color="success" text={<Switch />} onClick={() => props.onButtonClick?.("FORWARD")} />
          <div />
          <KeyPadButton color="error" text={<Hang />} onClick={() => props.onButtonClick?.("HANG")} />
        </>
      )}

      {actionType === "DTMF" && (
        <>
          <div />
          <KeyPadButton color="error" text={<Hang />} onClick={() => props.onButtonClick?.("HANG")} />
          <div />
        </>
      )}
    </KeyPadContainer>
  )
}
