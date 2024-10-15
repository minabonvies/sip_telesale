import React, { useState, createContext, ReactNode } from "react"

type TogglePanelContextType = {
  isToggle: boolean;
  setIsToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TogglePanelContext = createContext<TogglePanelContextType>({
  isToggle: true,
  setIsToggle: () => {},
})

type Props = {
  children: ReactNode;
}

export default function TogglePanelProvider({ children }: Props) {
  const [isToggle, setIsToggle] = useState(true)

  return (
    <TogglePanelContext.Provider value={{ isToggle, setIsToggle }}>
      {children}
    </TogglePanelContext.Provider>
  )
}