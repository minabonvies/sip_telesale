import { useEffect } from "react"
import styled from "@emotion/styled"
import { useBonTalk } from "@/Provider/BonTalkProvider"
import { useView } from "@/Provider/ViewProvider"

type CallingProps = {
  onVideoClick: () => void
}

export default function Video(props: CallingProps) {
  const bonTalk = useBonTalk()!
  const { currentCallingTarget } = useView()

  const currentSession = bonTalk.sessionManager.getSession(currentCallingTarget)

  const handleVideoClick = () => {
    props.onVideoClick()
  }

  useEffect(() => {
    // if (!currentSession) return;
  
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     const localVideoElement = document.getElementById('localVideo') as HTMLVideoElement;
    //     if (localVideoElement) {
    //       localVideoElement.srcObject = stream;
    //     }
  
    //     const remoteStream = new MediaStream();
    //     if (currentSession.session?.sessionDescriptionHandler) {
    //       const peerConnection = (currentSession.session.sessionDescriptionHandler as unknown as { peerConnection: RTCPeerConnection }).peerConnection;
    //       peerConnection.getReceivers().forEach((receiver: { track: MediaStreamTrack; }) => {
    //         if (receiver.track) {
    //           remoteStream.addTrack(receiver.track);
    //         }
    //       });
    //       console.log(remoteStream)
    //       const hasVideo = remoteStream.getVideoTracks().length > 0;
    //       console.log("包含視訊:", hasVideo);
    //       const remoteVideoElement = document.getElementById('remoteVideo') as HTMLVideoElement;
    //       if (remoteVideoElement) {
    //         remoteVideoElement.srcObject = remoteStream;
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error accessing media devices.", error);
    //   });
  }, [currentSession]);

  return (
    <>
      <VideoContainer 

      >
        {/* 視訊畫面 */}
        <h2>視訊畫面</h2>
        <video id="localVideo" width='100%' autoPlay playsInline muted></video>
        <video id="remoteVideo" width='100%' autoPlay playsInline></video>
        <button onClick={handleVideoClick}>handleVideoClick</button>
      </VideoContainer>
    </>
  )
}

const VideoContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  alignItems: "center",
  paddingTop: "16px",
  paddingBottom: "18px",
  outline: "none"
})
