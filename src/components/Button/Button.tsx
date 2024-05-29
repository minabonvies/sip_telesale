import { alpha } from "@/theme"
import styled from "@emotion/styled"

type ButtonProps = {
  color?: "primary" | "secondary" | "success" | "error"
  variant?: "solid" | "ghost"
  disabled?: boolean
}

/**
 * Button component
 * @param props - Button props
 * @param props.color - Button color, default is `primary`
 * @param props.variant - Button variant, default is `solid`
 * @param props.disabled - Button disabled, default is `false`
 */
const Button = styled("button", {
  shouldForwardProp: (prop) => !["color", "variant"].includes(prop),
})<ButtonProps>((props) => {
  const variant = props.variant || "solid"
  const colorToken = props.color || "primary"
  const color = props.theme.isColorToken(colorToken) ? props.theme.colors[colorToken].main : colorToken
  const transparent = props.theme.colors.transparent

  const isDisabled = Boolean(props.disabled)
  const disabledColor = props.theme.colors.action.disabled

  return {
    border: "none",
    padding: "unset",
    cursor: isDisabled ? "default" : "pointer",
    pointerEvents: isDisabled ? "none" : "auto",

    color: variant === "solid" ? props.theme.colors.text.white : color,
    backgroundColor: variant === "solid" ? color : transparent,

    "&:hover": {
      color: variant === "solid" ? alpha(props.theme.colors.text.white, 0.8) : alpha(color, 0.8),
      backgroundColor: variant === "solid" ? alpha(color, 0.8) : transparent,
    },

    "&:active": {
      color: variant === "solid" ? alpha(props.theme.colors.text.white, 0.6) : alpha(color, 0.6),
      backgroundColor: variant === "solid" ? alpha(color, 0.6) : transparent,
    },

    // TODO: the solid variant is not on UI design
    ...(isDisabled && {
      color: variant === "solid" ? alpha("#FFFFFF", 0.3) : disabledColor,
      backgroundColor: variant === "solid" ? disabledColor : transparent,
    }),

    transition: "background-color 0.2s ease-out, color 0.2s ease-out",
    willChange: "background-color, color",
  }
})

export default Button
