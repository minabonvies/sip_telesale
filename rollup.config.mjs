import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import css from "rollup-plugin-import-css"
import commonjs from "@rollup/plugin-commonjs"
import replace from "@rollup/plugin-replace"

export default {
  input: "src/entry/plugin.tsx",
  output: [
    {
      file: "dist/bonTalk.esm.js",
      format: "esm",
    },
    {
      file: "dist/bonTalk.umd.js",
      format: "umd",
      name: "BonTalk",
    },
  ],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    typescript(),
    commonjs(),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    css({
      inject: true,
    }),
  ],
  // external: ["react", "react-dom/client", "react/jsx-runtime"],
}
