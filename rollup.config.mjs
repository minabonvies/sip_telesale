import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import css from "rollup-plugin-import-css"
import commonjs from "@rollup/plugin-commonjs"
import replace from "@rollup/plugin-replace"
// import url from "@rollup/plugin-url"
import mime from "mime-types"
import fs from "fs"
import path from "path"
import url from "url"
import terser from "@rollup/plugin-terser"

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    {
      file: "dist/bonTalk.cjs.js",
      format: "cjs",
    },
  ],
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    typescript(),
    css({
      inject: true,
    }),
    commonjs(),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    {
      name: "assets",
      load(id) {
        if (id.endsWith(".svg") || id.endsWith(".wav")) {
          console.log("id:", id)
          const mimeType = mime.lookup(id)
          const data = fs.readFileSync(id)
          const base64 = data.toString("base64")
          return `export default "data:${mimeType};base64,${base64}"`
        }
      },
      resolveId(source) {
        if (source.endsWith(".svg") || source.endsWith(".wav")) {
          if (source.startsWith("/")) {
            return path.resolve(__dirname, "public", source.slice(1))
          }

          if (source.includes("@")) {
            return path.resolve(__dirname, source.replace("@", "src"))
          }

          return path.resolve(__dirname, source)
        }
        return null
      },
    },
    terser(),
  ],
}
