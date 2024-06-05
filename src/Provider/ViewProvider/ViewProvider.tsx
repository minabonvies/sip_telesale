import { createContext, useContext, useState } from "react"
import { SessionName } from "@/entry/plugin"

type ViewName = "KEY_PAD" | "RECEIVED_CALL" | "IN_CALL"
type ViewContextType = {
  view: ViewName
  setView: (view: ViewName) => void
  currentCallingTarget: SessionName | ""
  setCurrentCallingTarget: (target: SessionName | "") => void
}

const ViewContext = createContext<ViewContextType | null>(null)

export const useView = () => {
  const context = useContext(ViewContext)
  if (!context) {
    throw new Error("useView must be used within a ViewProvider")
  }
  return context
}

export default function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<ViewName>("KEY_PAD")
  const [currentCallingTarget, setCurrentCallingTarget] = useState<SessionName | "">("")

  return (
    <ViewContext.Provider
      value={{
        view,
        setView,
        currentCallingTarget,
        setCurrentCallingTarget,
      }}
    >
      {children}
    </ViewContext.Provider>
  )
}
