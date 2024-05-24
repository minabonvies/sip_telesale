import React from "react"
import ReactDOM from "react-dom/client"
import Playground from "@/Playground"
import "./normalize.css"
import "./index.css"
import BonTalkProvider from "@/Provider/BonTalkProvider"
import BonTalk from "./plugin"

const bonTalk = new BonTalk({
  buttonElementId: "", // for dev, no need to render button
  wsServer: "wss://demo.sip.telesale.org:7443/ws",
  domains: ["demo.sip.telesale.org"],
  username: "3002",
  password: "42633506",
  displayName: "3002 Mina",
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BonTalkProvider value={bonTalk}>
      <Playground />
    </BonTalkProvider>
  </React.StrictMode>
)
