import { createContext } from "react"
import BonTalk from "@/entry/plugin"

export const BonTalkContext = createContext<BonTalk | null>(null)

type Props = {
  value: BonTalk
  children: React.ReactNode
}

export default function BonTalkProvider(props: Props) {
  return <BonTalkContext.Provider {...props} />
}
