import KeyPadContainer from "../KeyPadContainer"
import KeyPadButton from "../KeyPadButton"
import Video from "../Icons/video"
import Delete from "../Icons/delete"
import Phone from "../Icons/phone"
import Switch from "../Icons/switch"
import PreForward from "../Icons/pre-forward"
import Hang from "../Icons/hang"

export default function ActionPad() {
  return (
    <KeyPadContainer>
      <KeyPadButton color="success" text={<Video />} />
      <KeyPadButton color="success" text={<Phone />} />
      <KeyPadButton color="secondary" text={<Delete />} />
      {/* refer */}
      <KeyPadButton color="success" text={<Switch />} />

      {/* refer refer? */}
      <KeyPadButton color="success" text={<PreForward />} />

      {/* hang up btn  */}
      <KeyPadButton color="error" text={<Hang />} />
    </KeyPadContainer>
  )
}
