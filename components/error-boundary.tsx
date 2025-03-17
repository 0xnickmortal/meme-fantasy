"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p>Please try refreshing the page</p>
          </div>
        )
      )
    }

    return this.props.children
  }
}

