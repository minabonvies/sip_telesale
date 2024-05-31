import { useRef, useState } from "react"

export default function useTimer() {
  const intervalRef = useRef<number | null>(null)
  const [time, setTime] = useState(0)

  const start = () => {
    if (intervalRef.current) {
      return
    }

    intervalRef.current = window.setInterval(() => {
      setTime((prevSeconds) => prevSeconds + 1)
    }, 1000)
  }

  const stop = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return { time, start, stop }
}
