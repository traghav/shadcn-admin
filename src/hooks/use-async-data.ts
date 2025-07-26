import { useState, useEffect, useCallback, useRef } from 'react'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  cancel: () => void
}

export interface UseAsyncDataOptions {
  immediate?: boolean
  retryAttempts?: number
  retryDelay?: number
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useAsyncData<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAsyncDataOptions = {}
): AsyncState<T> {
  const {
    immediate = true,
    retryAttempts = 0,
    retryDelay = 1000,
    onSuccess,
    onError
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<Error | null>(null)
  
  const cancelRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)

  const cancel = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current.abort()
      cancelRef.current = null
    }
    setLoading(false)
  }, [])

  const executeFunction = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      cancel() // Cancel any existing request
      setLoading(true)
      setError(null)
      retryCountRef.current = 0
    }

    // Create new abort controller
    cancelRef.current = new AbortController()

    try {
      const result = await asyncFunction()
      
      // Check if request was cancelled
      if (cancelRef.current?.signal.aborted) {
        return
      }

      setData(result)
      setError(null)
      onSuccess?.(result)
      retryCountRef.current = 0
    } catch (err) {
      // Check if request was cancelled
      if (cancelRef.current?.signal.aborted) {
        return
      }

      const error = err instanceof Error ? err : new Error('An unknown error occurred')
      
      // Retry logic
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++
        setTimeout(() => {
          executeFunction(true)
        }, retryDelay)
        return
      }

      setError(error)
      setData(null)
      onError?.(error)
    } finally {
      if (!cancelRef.current?.signal.aborted) {
        setLoading(false)
      }
    }
  }, [asyncFunction, retryAttempts, retryDelay, onSuccess, onError, cancel])

  const refetch = useCallback(async () => {
    await executeFunction(false)
  }, [executeFunction])

  useEffect(() => {
    if (immediate) {
      executeFunction(false)
    }

    return () => {
      cancel()
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      cancel()
    }
  }, [cancel])

  return {
    data,
    loading,
    error,
    refetch,
    cancel
  }
}

// Hook for simulating async data loading in development
export function useSimulatedAsync<T>(
  data: T,
  delay: number = 1000,
  shouldError: boolean = false,
  errorMessage: string = 'Simulated error'
): AsyncState<T> {
  return useAsyncData(
    async () => {
      await new Promise(resolve => setTimeout(resolve, delay))
      if (shouldError) {
        throw new Error(errorMessage)
      }
      return data
    },
    [data, delay, shouldError, errorMessage]
  )
}

// Hook for data that auto-refreshes
export function useAutoRefreshData<T>(
  asyncFunction: () => Promise<T>,
  refreshInterval: number = 30000,
  dependencies: any[] = [],
  options: UseAsyncDataOptions = {}
): AsyncState<T> {
  const asyncState = useAsyncData(asyncFunction, dependencies, options)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (refreshInterval > 0 && !asyncState.loading && !asyncState.error) {
      intervalRef.current = setInterval(() => {
        asyncState.refetch()
      }, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [asyncState.refetch, asyncState.loading, asyncState.error, refreshInterval])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return asyncState
}