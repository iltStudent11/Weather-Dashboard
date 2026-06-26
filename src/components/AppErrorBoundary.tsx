import { Component, type ReactNode } from 'react'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
  message: string
}

class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unexpected error',
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="dashboard">
          <section className="page-section">
            <h1>App Error</h1>
            <p className="message error">
              Something went wrong while rendering the page: {this.state.message}
            </p>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
