import { useCallback, useEffect } from "react"
import { useAudio } from "@/Provider/AudioProvider"
import KeyPadButton from "../KeyPadButton"
import KeyPadContainer from "../KeyPadContainer"

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
  const { toggleDTMF } = useAudio()

  const handleKeyPress = useCallback((key: string) => {
    props.onKeyPress(key)
    if (props.dtmf) {
      toggleDTMF()
    }
  },[props, toggleDTMF])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const bonTalkRoot = document.querySelector("#_bon_sip_phone_root");
      const bonTalkIsToggle = bonTalkRoot?.getAttribute("data-is-toggle");
       if(bonTalkIsToggle === "true") {
        if (/^[0-9*#]$/.test(e.key)) {
          handleKeyPress(e.key);
        }
       }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyPress]);

  return (
      <KeyPadContainer >
        {KEYS.map((key) => (
          <KeyPadButton key={key.text} text={key.text} subText={key.subText} onClick={() => handleKeyPress(key.text)} tabIndex={0} onKeyDown={()=>{
            console.log("on keyDown test")
          }} />
        ))}
      </KeyPadContainer>
  )
}
