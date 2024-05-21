import { useState } from "react"

export default function useInputKeys() {
  const [inputKeys, setInputKeys] = useState("")

  const enterKey = (key: string) => {
    setInputKeys((prev) => prev + key)
  }

  const deleteKey = () => {
    setInputKeys((prev) => prev.slice(0, -1))
  }

  const clearKey = () => {
    setInputKeys("")
  }

  return {
    inputKeys,
    enterKey,
    deleteKey,
    clearKey,
  }
}
