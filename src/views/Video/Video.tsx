import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import { useView } from "@/Provider/ViewProvider"

type CallingProps = {
  onVideoClick: () => void
}

export default function Video(props: CallingProps) {
  const bonTalk = useBonTalk()!
  const { view, setView, currentCallingTarget, setCurrentCallingTarget } = useView()

  const currentSession = bonTalk.sessionManager.getSession(currentCallingTarget)
  const [isVideo, setIsVideo] = useState(true);

  const handleVideoClick = () => {
    props.onVideoClick();

    setIsVideo((prev) => {
      if (prev) {
        removeLocalVideo();
      } else {
        setupLocalVideo();
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
    removeLocalVideo();
    removeRemoteVideo();
    await bonTalk.hangupCall(currentCallingTarget)
  }

  const setupLocalVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const localVideoElement = document.getElementById(bonTalk!.localVideoElementId) as HTMLVideoElement;
        if (localVideoElement) {
          localVideoElement.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing local media devices.", error);
      });
  }

  const removeLocalVideo = () => {
    const localVideoElement = document.getElementById(bonTalk!.localVideoElementId) as HTMLVideoElement;
    if (localVideoElement && localVideoElement.srcObject) {
      const stream = localVideoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      localVideoElement.srcObject = null;
    }
  }

  const setupRemoteVideo = () => {
    if (!currentSession || !currentSession.session?.sessionDescriptionHandler) return;

    const remoteStream = new MediaStream();
    const peerConnection = (currentSession.session.sessionDescriptionHandler as unknown as { peerConnection: RTCPeerConnection }).peerConnection;
    peerConnection.getReceivers().forEach((receiver: { track: MediaStreamTrack; }) => {
      if (receiver.track) {
        remoteStream.addTrack(receiver.track);
      }
    });

    console.log(remoteStream);
    const hasVideo = remoteStream.getVideoTracks().length > 0;
    console.log("包含視訊:", hasVideo);

    const remoteVideoElement = document.getElementById(bonTalk!.remoteVideoElementId) as HTMLVideoElement;
    if (remoteVideoElement) {
      remoteVideoElement.srcObject = remoteStream;
    }
  }

  const removeRemoteVideo = () => {
    const remoteVideoElement = document.getElementById(bonTalk!.remoteVideoElementId) as HTMLVideoElement;
    if (remoteVideoElement) {
      remoteVideoElement.srcObject = null;
    }
  }

  useEffect(() => {
    setupLocalVideo();
    setupRemoteVideo();

    return () => {
      removeLocalVideo();
      removeRemoteVideo();
    };
  }, []);

  return (
    <>
      <VideoContainer>
        {/* 視訊畫面 */}
        <CallingTargetTitle>視訊畫面</CallingTargetTitle>
        <div style={{ height: "24px" }} />
        <video id={bonTalk!.localVideoElementId} width='100%' autoPlay playsInline muted></video>
        {/* <video id={bonTalk!.remoteVideoElementId} width='100%' autoPlay playsInline muted></video> */}
        <button onClick={handleVideoClick}>
          {isVideo ? "關閉" : "開啟"}視訊
        </button>
        <button onClick={handleToInCallPad}>回到通話頁面</button>
        <button onClick={handleHangupClick}>掛斷</button>
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