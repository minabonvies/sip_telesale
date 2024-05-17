import App from "@/components/App"
import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

export default class BonSipPhone {
  elementId: string

  constructor({ elementId }: { elementId: string }) {
    this.elementId = elementId
  }

  render() {
    const root = document.getElementById(this.elementId)

    if (!root) {
      throw new Error(`[BonSipPhone] Element with id ${this.elementId} not found`)
    }

    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}
