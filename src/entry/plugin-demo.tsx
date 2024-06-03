import BonTalk from "./plugin.tsx"

const bonTalk = new BonTalk({
  buttonElementId: "bon-sip-phone-button", // for dev, no need to render button
  wsServer: "wss://demo.sip.telesale.org:7443/ws",
  domains: ["demo.sip.telesale.org"],
  username: "3003",
  password: "42633506",
  displayName: "3003 Charlie",
})

bonTalk.init()
