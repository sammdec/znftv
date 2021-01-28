import { styled, css } from "stitches.config"

const pulse = css.keyframes({
  "0%": { opacity: 0.3 },
  "10%": { opacity: 1 },
  "100%": { opacity: 0.3 },
})

const LoadingBox = styled("div", {
  minHeight: 20,
  backgroundColor: "@border",
  animation: `${pulse} 2s infinite linear`,
})

export default LoadingBox
