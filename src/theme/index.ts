import "@emotion/react"

declare module "@emotion/react" {
  interface Theme {
    colorMode: "light" | "dark"
    toggleColorMode: () => void
    colors: (typeof theme.colors)[keyof typeof theme.colors]
    isColorToken: (token: string) => boolean
  }
}

const theme = {
  isColorToken: isColorToken,
  colors: {
    light: {
      primary: {
        main: "#7BA9C6",
      },
      secondary: {
        main: "#457EA2",
      },
      success: {
        main: "#2FC182",
      },
      warning: {
        main: "#F2C055",
      },
      error: {
        main: "#FF4D4D",
      },
      background: {
        default: "#3B3B3B",
      },
      text: {
        white: "#FFFFFF",
      },
      transparent: "#00000000",
      action: {
        disabled: "rgba(255, 255, 255, 0.3)",
      },
    },
    dark: {
      primary: {
        main: "#7BA9C6",
      },
      secondary: {
        main: "#457EA2",
      },
      success: {
        main: "#2FC182",
      },
      warning: {
        main: "#F2C055",
      },
      error: {
        main: "#FF4D4D",
      },
      background: {
        default: "#3B3B3B",
      },
      text: {
        white: "#FFFFFF",
      },
      transparent: "#00000000",
      action: {
        disabled: "rgba(255, 255, 255, 0.3)",
      },
    },
  },
} as const

export function isColorToken(token: string) {
  return token in theme.colors.light || token in theme.colors.dark
}

export function alpha(color: string, alpha: number): string {
  if (alpha > 1 || alpha < 0) {
    throw new Error("Alpha must be between 0 and 1")
  }

  const alphaInHex = Math.round(alpha * 255).toString(16)

  // hex
  if (color.includes("#") && (color.length === 4 || color.length === 7)) {
    if (color.length === 4) {
      return (
        color
          .split("")
          .map((char, index) => (index === 0 ? char : char + char))
          .join("") + alphaInHex
      )
    }

    return color + alphaInHex
  }

  // hex + alpha
  if (color.includes("#") && color.length === 9) {
    return color.slice(0, -2) + alphaInHex
  }

  // rgb
  if (color.includes("rgb") && !color.includes("rgba")) {
    return color.replace("rgb", "rgba").replace(")", `, ${alpha})`)
  }
  // rgba
  if (color.includes("rgba")) {
    return color.replace(/[^,]+(?=\))/, " " + alpha.toString())
  }

  throw new Error("Not a valid color")
}

export default theme
