import { useContext } from "react"
import { BonTalkContext } from "./BonTalkProvider"

export default function useBonTalk() {
  if (!BonTalkContext) {
    throw new Error("BonTalkProvider is not found")
  }

  return useContext(BonTalkContext)
}
