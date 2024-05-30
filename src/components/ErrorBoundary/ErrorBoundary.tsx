import React from "react"

export default class ErrorBoundary extends React.Component<{
  children: React.ReactNode
}> {
  state: {
    hasError: boolean
    error: Error | null
  } = {
    hasError: false,
    error: null,
  }

  componentDidCatch(error: Error) {
    this.setState({
      hasError: true,
      error: error,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{this.state.error && this.state.error.toString()}</p>
        </div>
      )
    }

    return this.props.children
  }
}
