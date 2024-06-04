import styled from "@emotion/styled"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import ContentHeader from "../ContentHeader"
import Button from "../Button"
import Cancel from "../Icons/cancel"
import Hide from "../Icons/hide"
import Warn from "../Icons/warn"

type Props = {
  showInformation?: boolean
  informationTitle?: string
  time?: string
  showCancelButton?: boolean
  onHideClick?: () => void
  onCancelClick?: () => void
}

export default function Header(props: Props) {
  const bonTalk = useBonTalk()!

  return (
    <ContentHeader>
      <OnCallInformation>
        {props.showInformation && props.informationTitle ? (
          <>
            <Warn />
            <Text>
              {props.informationTitle} Waiting {props.time || ""}
            </Text>
          </>
        ) : null}
      </OnCallInformation>

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

const OnCallInformation = styled("div")((props) => ({
  color: props.theme.colors.warning.main,
  flex: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
}))

const Text = styled("div")((props) => ({
  ...props.theme.typography.h2,
}))

const ButtonSection = styled("div")({})

const IconButton = styled(Button)({
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
})
