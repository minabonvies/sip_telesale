import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
// @ts-expect-error no-explicit-any
export default ({ mode }) => {
  // process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    base: "/sip_telesale/",
    // server: {
    //   open: process.env.VITE_OPEN,
    // },
    server: {
      port: 3005,
    },
  })
}
