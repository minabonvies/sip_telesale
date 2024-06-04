import styled from "@emotion/styled"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import ContentHeader from "../ContentHeader"
import Button from "../Button"
import Cancel from "../Icons/cancel"
import Hide from "../Icons/hide"

type Props = {
  showCancelButton?: boolean
  onHideClick?: () => void
  onCancelClick?: () => void
}

export default function Header(props: Props) {
  const bonTalk = useBonTalk()!

  return (
    <ContentHeader>
      {props.showCancelButton ? (
        <IconButton color="error" variant="ghost" onClick={props.onCancelClick}>
          <Cancel />
        </IconButton>
      ) : (
        <IconButton
          color="error"
          variant="ghost"
          onClick={() => {
            props.onHideClick?.()
            bonTalk?.togglePanel()
          }}
        >
          <Hide />
        </IconButton>
      )}
    </ContentHeader>
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
