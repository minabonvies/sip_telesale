import type { JestConfigWithTsJest } from "ts-jest"
const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  transform: {
    ["^.+\\.tsx?$"]: [
      "ts-jest",
      {
        isolatedModules: true,
        diagnostics: false,
      },
    ],
  },
}

export default config
