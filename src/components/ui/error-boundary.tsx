import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Alert, AlertDescription } from './alert'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
  className?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo)

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error tracking service like Sentry
      // reportError(error, errorInfo)
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }))
    } else {
      // Auto-retry after delay for persistent errors
      this.retryTimeoutId = setTimeout(() => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          retryCount: 0
        })
      }, 5000)
    }
  }

  handleRefresh = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <Card className={`max-w-2xl mx-auto mt-8 ${this.props.className}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-destructive/10 dark:bg-destructive/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-destructive">Something went wrong</CardTitle>
            <CardDescription>
              An unexpected error occurred while rendering this component
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {this.state.error && (
              <Alert className="border-destructive/50 bg-destructive/10 dark:bg-destructive/5">
                <Bug className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive-foreground">
                  <strong>Error:</strong> {this.state.error.message}
                </AlertDescription>
              </Alert>
            )}

            {this.props.showDetails && this.state.errorInfo && (
              <details className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg border">
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-muted-foreground overflow-auto max-h-40">
                  {this.state.error?.stack}
                  {'\n\nComponent Stack:'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={this.handleRetry} 
                className="flex-1"
                disabled={this.state.retryCount >= 3}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {this.state.retryCount >= 3 ? 'Auto-retrying...' : 'Try Again'}
              </Button>
              <Button 
                onClick={this.handleRefresh} 
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
              <Button 
                onClick={this.handleGoHome} 
                variant="outline"
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            {this.state.retryCount > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Retry attempts: {this.state.retryCount}/3
              </p>
            )}
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for handling errors in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('Component error:', error, errorInfo)
    
    // Report to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error tracking service
      // reportError(error, errorInfo)
    }
    
    // Re-throw the error to be caught by error boundary
    throw error
  }
}

// Specialized error boundary for charts
export function ChartErrorBoundary({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <ErrorBoundary
      className={className}
      fallback={
        <Card className="h-80 flex items-center justify-center">
          <CardContent className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive mb-2">Chart Loading Error</CardTitle>
            <CardDescription>
              Unable to load chart data. Please try refreshing the page.
            </CardDescription>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

// Specialized error boundary for data tables
export function TableErrorBoundary({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <ErrorBoundary
      className={className}
      fallback={
        <Card>
          <CardContent className="py-8 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive mb-2">Table Loading Error</CardTitle>
            <CardDescription>
              Unable to load table data. Please try again.
            </CardDescription>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              size="sm"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      }
    >
      {children}
    </ErrorBoundary>
  )
}