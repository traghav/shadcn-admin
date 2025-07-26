import React from 'react'
import { ErrorDetails, NetworkError, ValidationError, ErrorReportingConfig } from '@/types/performance'

// Enhanced error handling utilities

export class DashboardError extends Error {
  public readonly code: string
  public readonly timestamp: Date
  public readonly context?: Record<string, any>

  constructor(message: string, code: string, context?: Record<string, any>) {
    super(message)
    this.name = 'DashboardError'
    this.code = code
    this.timestamp = new Date()
    this.context = context
  }
}

export class ChartRenderError extends DashboardError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'CHART_RENDER_ERROR', context)
    this.name = 'ChartRenderError'
  }
}

export class DataLoadError extends DashboardError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'DATA_LOAD_ERROR', context)
    this.name = 'DataLoadError'
  }
}

export class FilterValidationError extends ValidationError {
  constructor(message: string, field: string, value: any) {
    super(message)
    this.name = 'FilterValidationError'
    this.field = field
    this.value = value
  }
}

// Error reporting configuration
let errorReportingConfig: ErrorReportingConfig = {
  enableReporting: process.env.NODE_ENV === 'production',
  environment: (process.env.NODE_ENV as any) || 'development'
}

export const configureErrorReporting = (config: Partial<ErrorReportingConfig>) => {
  errorReportingConfig = { ...errorReportingConfig, ...config }
}

// Error reporting function
export const reportError = async (error: Error, context?: Record<string, any>) => {
  if (!errorReportingConfig.enableReporting) {
    console.warn('Error reporting disabled:', error)
    return
  }

  const errorDetails: ErrorDetails = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date(),
    pageUrl: window.location.href,
    userAgent: navigator.userAgent,
    ...context
  }

  // Add user/session info if available
  if (errorReportingConfig.userId) {
    errorDetails.userId = errorReportingConfig.userId
  }

  // Log to console in development
  if (errorReportingConfig.environment === 'development') {
    console.error('Error Report:', errorDetails)
    return
  }

  // Send to error reporting service in production
  try {
    if (errorReportingConfig.endpoint) {
      await fetch(errorReportingConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(errorReportingConfig.apiKey && {
            'Authorization': `Bearer ${errorReportingConfig.apiKey}`
          })
        },
        body: JSON.stringify(errorDetails)
      })
    }
  } catch (reportingError) {
    console.error('Failed to report error:', reportingError)
  }
}

// Async function wrapper with error handling
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorContext?: string
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args)
    } catch (error) {
      const wrappedError = error instanceof Error ? error : new Error(String(error))
      await reportError(wrappedError, { context: errorContext, args })
      throw wrappedError
    }
  }
}

// React component error wrapper
export const withComponentErrorHandling = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  return function ErrorHandledComponent(props: P) {
    try {
      return <Component {...props} />
    } catch (error) {
      const wrappedError = error instanceof Error ? error : new Error(String(error))
      reportError(wrappedError, { 
        component: componentName || Component.displayName || Component.name,
        props: JSON.stringify(props, null, 2).substring(0, 1000) // Limit props size
      })
      throw wrappedError
    }
  }
}

// Network error handler
export const handleNetworkError = (error: any): NetworkError => {
  const networkError = new Error(error.message || 'Network request failed') as NetworkError
  networkError.name = 'NetworkError'
  
  if (error.response) {
    networkError.status = error.response.status
    networkError.statusText = error.response.statusText
    networkError.url = error.response.url
  }
  
  if (error.config) {
    networkError.method = error.config.method?.toUpperCase()
    networkError.url = networkError.url || error.config.url
  }

  return networkError
}

// Validation error handler
export const createValidationError = (field: string, value: any, constraint: string): ValidationError => {
  const error = new Error(`Validation failed for field '${field}': ${constraint}`) as ValidationError
  error.name = 'ValidationError'
  error.field = field
  error.value = value
  error.constraint = constraint
  return error
}

// Retry mechanism with exponential backoff
export const withRetry = async <T extends unknown>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  backoffFactor: number = 2
): Promise<T> => {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt === maxRetries) {
        await reportError(lastError, { 
          context: 'retry_exhausted',
          maxRetries,
          totalAttempts: attempt + 1
        })
        throw lastError
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(backoffFactor, attempt)
      
      // Add jitter to prevent thundering herd
      const jitteredDelay = delay + Math.random() * 1000
      
      await new Promise(resolve => setTimeout(resolve, jitteredDelay))
    }
  }
  
  throw lastError!
}

// Safe JSON parsing with error handling
export const safeJsonParse = <T = any>(json: string, fallback?: T): T | null => {
  try {
    return JSON.parse(json)
  } catch (error) {
    reportError(new Error(`JSON parsing failed: ${error}`), { json: json.substring(0, 100) })
    return fallback || null
  }
}

// Type-safe error checking utilities
export const isError = (value: unknown): value is Error => {
  return value instanceof Error
}

export const getErrorMessage = (error: unknown): string => {
  if (isError(error)) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

export const getErrorStack = (error: unknown): string | undefined => {
  if (isError(error)) {
    return error.stack
  }
  return undefined
}

// Performance monitoring for error-prone operations
export const withPerformanceMonitoring = async <T extends unknown>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now()
  
  try {
    const result = await operation()
    const endTime = performance.now()
    const duration = endTime - startTime
    
    // Log performance if operation takes too long
    if (duration > 5000) { // 5 seconds threshold
      console.warn(`Slow operation detected: ${operationName} took ${duration}ms`)
    }
    
    return result
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    await reportError(
      error instanceof Error ? error : new Error(String(error)),
      { 
        operation: operationName,
        duration,
        performance: 'error_during_operation'
      }
    )
    
    throw error
  }
}

// Global error handler setup
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    reportError(error, { 
      type: 'unhandled_promise_rejection',
      promise: event.promise 
    })
  })

  // Handle global errors
  window.addEventListener('error', (event) => {
    const error = event.error instanceof Error ? event.error : new Error(event.message)
    reportError(error, {
      type: 'global_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })

  // Handle resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElement
      reportError(new Error(`Resource loading error: ${target.tagName}`), {
        type: 'resource_error',
        src: (target as any).src || (target as any).href,
        tagName: target.tagName
      })
    }
  }, true)
}