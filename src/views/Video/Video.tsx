import { useEffect } from "react"
import styled from "@emotion/styled"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import { useView } from "@/Provider/ViewProvider"
import ActionPad, { type ActionButtonType } from "@/components/ActionPad"
import Header from "@/components/Header"

type CallingProps = {
  onVideoClick: (isVideoEnabled: boolean) => void
  onSetupLocalVideo: () => void
  onRemoveLocalVideo: () => void
  onSetupRemoteVideo: () => void
  onRemoveRemoteVideo: () => void
}

export default function Video(props: CallingProps) {
  const bonTalk = useBonTalk()!
  const { setView, currentCallingTarget, setCurrentCallingTarget } = useView()

  const handleVideoClick = () => {
    if (!currentCallingTarget) return
    const currentSession = bonTalk.sessionManager.getSession(currentCallingTarget)
    if (currentSession!.isVideoEnabled) {
      props.onRemoveLocalVideo();
      props.onVideoClick(false);
    } else {
      props.onSetupLocalVideo();
      props.onVideoClick(true);
    }
    console.log("currentSession", currentSession!.isVideoEnabled)
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
      case "CALL_VIDEO":
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

  useEffect(() => {
    // 設定視訊流 設置
    props.onSetupLocalVideo();
    props.onSetupRemoteVideo();
    // 視訊流傳遞 開啟
    props.onVideoClick(true);

    return () => {
      // 設定視訊流 移除
      props.onRemoveLocalVideo();
      props.onRemoveRemoteVideo();
      // 視訊流傳遞 關閉
      props.onVideoClick(false);
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