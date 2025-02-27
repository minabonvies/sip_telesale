import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import { useView } from "@/Provider/ViewProvider"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"
import Header from "@/components/Header"
import { SessionName } from "@/entry/plugin"

type CallingProps = {
  onVideoClick: () => void
  onSetupLocalVideo: () => void
  onRemoveLocalVideo: () => void
  onSetupRemoteVideo: () => void
  onRemoveRemoteVideo: () => void
}

export default function Video(props: CallingProps) {
  console.log("Video 組件")
  const bonTalk = useBonTalk()!
  const { view, setView, currentCallingTarget, setCurrentCallingTarget } = useView()

  const currentSession = bonTalk.sessionManager.getSession(currentCallingTarget)
  const [isVideo, setIsVideo] = useState(true);

  const handleVideoClick = () => {
    props.onVideoClick();

    setIsVideo((prev) => {
      if (prev) {
        props.onRemoveLocalVideo();
      } else {
        props.onSetupLocalVideo();
      }

      return !prev;
    })
  }

  const handleToInCallPad = async () => {
    setView("IN_CALL")
  }

  const handleHangupClick = async () => {
    if (!currentCallingTarget) return
    setCurrentCallingTarget("")
    props.onRemoveLocalVideo();
    props.onRemoveRemoteVideo();
    await bonTalk.hangupCall(currentCallingTarget)
  }

  const handleActionPress = (action: ActionButtonType) => {
    switch (action) {
      case "SWITCH_VIDEO":
        handleVideoClick()
        break
      case "HANG":
        handleHangupClick()
        break
      case "BACK":
        handleToInCallPad()
        break
      default:
        console.log(action)
        // DO NOT ACCEPT OTHER STUFF
        break
    }
  }

  function handleEnableVideoClick() {
    bonTalk.enableVideo("outgoing");
  }

  useEffect(() => {
    // props.onSetupLocalVideo();
    // props.onSetupRemoteVideo();

    return () => {
      props.onRemoveLocalVideo();
      props.onRemoveRemoteVideo();
    };
  }, []);

  return (
    <>
      <Header />
      <VideoContainer>
        {/* 視訊畫面 */}
        <CallingTargetTitle>視訊畫面</CallingTargetTitle>

        <video id={bonTalk!.localVideoElementId} width='100%' autoPlay playsInline muted></video>
        <video id={bonTalk!.remoteVideoElementId} width='100%' autoPlay playsInline muted></video>
        {/* <button onClick={handleVideoClick}>
          {isVideo ? "關閉" : "開啟"}視訊
        </button>
        <button onClick={handleToInCallPad}>回到通話頁面</button>
        <button onClick={handleHangupClick}>掛斷</button> */}
        <button onClick={handleEnableVideoClick}>EnableVideo</button>
        <ActionPad actionType="VIDEO" onButtonClick={handleActionPress} />
      </VideoContainer>
    </>
  )
}

const CallingTargetTitle = styled("div")((props) => ({
  ...props.theme.typography.h1,
  color: props.theme.colors.text.primary,
  height: "32px",
}))


const VideoContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  alignItems: "center",
  paddingTop: "16px",
  paddingBottom: "18px",
  outline: "none"
})