import { useCallback, useContext, useEffect } from "react"
import { useAudio } from "@/Provider/AudioProvider"
import KeyPadButton from "../KeyPadButton"
import KeyPadContainer from "../KeyPadContainer"
import { TogglePanelContext } from "@/Provider/TogglePanelProvider/TogglePanelProvider"

type Props = {
  dtmf?: boolean
  onKeyPress: (key: string) => void
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
];

export default function NumberPad(props: Props) {
  const { isToggle } = useContext(TogglePanelContext);
  const { toggleDTMF } = useAudio()

  const handleKeyPress = useCallback((key: string) => {
    props.onKeyPress(key)
    if (props.dtmf) {
      toggleDTMF()
    }
  }, [props, toggleDTMF])

  const setFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      console.log("setFocus")
      element.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    console.log("Key pressed:", e.key);
    // 在這裡處理鍵盤事件
  };

  useEffect(() => {
    console.log("isToggle", isToggle)
  }, [isToggle])

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     e.preventDefault();
  //     const bonTalkRoot = document.querySelector("#_bon_sip_phone_root");
  //     const bonTalkIsToggle = bonTalkRoot?.getAttribute("data-is-toggle");
  //      if(bonTalkIsToggle === "true") {
  //       if (/^[0-9*#]$/.test(e.key)) {
  //         handleKeyPress(e.key);
  //       }
  //      }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [handleKeyPress]);

  return (
    <KeyPadContainer ref={setFocus} tabIndex={1} onKeyDown={handleKeyDown}>
      {KEYS.map((key) => (
        <KeyPadButton key={key.text} text={key.text} subText={key.subText} onClick={() => handleKeyPress(key.text)} tabIndex={0} onKeyDown={() => {
          console.log("on keyDown test")
        }} />
      ))}
    </KeyPadContainer>
  )
}
