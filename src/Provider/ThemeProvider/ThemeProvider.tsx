import theme from "@/theme"
import { useState } from "react"
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react"

type Props = {
  children: React.ReactNode
  mode: "light" | "dark"
  customThemeColor?: string
}

export default function ThemeProvider(props: Props) {
  const [mode, setMode] = useState(props.mode || "light")

  return (
    <EmotionThemeProvider
      theme={{
        ...theme(props.customThemeColor),
        colors: {
          ...theme(props.customThemeColor).colors[mode],
        },
        colorMode: mode,
        toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
      }}
      {...props}
    />
  )
}
