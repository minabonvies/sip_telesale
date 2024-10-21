import BonTalk from "./plugin"

const bonTalk = new BonTalk({
  wsServer: "wss://demo.sip.telesale.org:7443/ws",
  domains: ["demo.sip.telesale.org"],
  username: "3003",
  password: "42633506",
  displayName: "3003 Charlie",
})

bonTalk.init()
