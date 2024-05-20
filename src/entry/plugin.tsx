import App from "@/components/App"
import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

export default class BonTalk {
  rootId = "_bon_sip_phone_root"
  buttonElementId: string
  buttonElement: HTMLElement | null = null
  rootElement: HTMLElement | null = null
  reactRoot: ReactDOM.Root | null = null

  constructor({ buttonElementId }: { buttonElementId: string }) {
    this.buttonElementId = buttonElementId
  }

  render() {
    if (this.reactRoot) {
      throw new Error("[bonTalk] already rendered")
    }

    const body = document.body
    const buttonElement = document.getElementById(this.buttonElementId)

    if (!buttonElement) {
      throw new Error(`[bonTalk] buttonElement with id ${this.buttonElementId} not found`)
    }

    const root = document.createElement("div")
    root.id = this.rootId
    this.rootElement = root
    this.rootElement.style.opacity = "0"
    body.appendChild(root)

    // attach open event to button
    this.buttonElement = buttonElement
    buttonElement.addEventListener("click", this.togglePanel.bind(this))

    this.reactRoot = ReactDOM.createRoot(root)
    this.reactRoot.render(<App />)
  }

  togglePanel() {
    console.log("togglePanel")
    console.log(this.rootElement)
    if (!this.rootElement) {
      return
    }
    this.rootElement.style.opacity = this.rootElement.style.opacity === "0" ? "1" : "0"
  }

  destroy() {
    if (!this.reactRoot) {
      return
    }

    this.reactRoot.unmount()
  }
}
