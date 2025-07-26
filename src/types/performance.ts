// Enhanced type definitions for performance optimizations and error handling

export interface LoadingState {
  isLoading: boolean
  error: Error | null
  lastFetch?: Date
  retryCount?: number
}

export interface AsyncOperationResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  cancel: () => void
}

export interface ChartDataPoint {
  timestamp: string | Date
  value: number
  label?: string
  category?: string
  metadata?: Record<string, any>
}

export interface PerformanceMetrics {
  renderTime: number
  dataSize: number
  memoryUsage?: number
  reRenderCount: number
  lastOptimization?: Date
}

export interface ErrorDetails {
  message: string
  stack?: string
  code?: string | number
  timestamp: Date
  userId?: string
  sessionId?: string
  pageUrl?: string
  userAgent?: string
}

export interface NetworkError extends Error {
  status?: number
  statusText?: string
  url?: string
  method?: string
}

export class ValidationError extends Error {
  field?: string
  value?: any
  constraint?: string
  
  constructor(message: string, field?: string, value?: any, constraint?: string) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.value = value
    this.constraint = constraint
  }
}

// Chart-specific types with error handling
export interface ChartProps<T = any> {
  data: T[]
  loading?: boolean
  error?: Error | null
  onError?: (error: Error) => void
  onDataLoad?: (data: T[]) => void
  fallback?: React.ComponentType
  retryAttempts?: number
}

export interface HeatmapCellData {
  row: string | number
  col: string | number
  value: number
  displayValue?: string
  tooltip?: string
  status?: 'good' | 'warning' | 'error' | 'neutral'
}

export interface FilterOptions {
  platforms: string[]
  categories: string[]
  dateRange: {
    from: Date
    to: Date
  }
  searchQuery?: string
}

// Performance monitoring types
export interface ComponentPerformance {
  componentName: string
  renderTime: number
  propsSize: number
  reRenderTriggers: string[]
  lastRender: Date
}

export interface OptimizationReport {
  components: ComponentPerformance[]
  totalRenderTime: number
  slowestComponents: string[]
  recommendations: string[]
  generatedAt: Date
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  retryCount: number
}

export interface ErrorReportingConfig {
  enableReporting: boolean
  endpoint?: string
  apiKey?: string
  environment: 'development' | 'staging' | 'production'
  userId?: string
}

// Animation and transition types
export interface TransitionConfig {
  duration: number
  easing: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export interface AnimationSequence {
  elements: string[]
  staggerDelay: number
  totalDuration: number
  config: TransitionConfig
}

// Mobile responsiveness types
export interface BreakpointConfig {
  mobile: number
  tablet: number
  desktop: number
  widescreen: number
}

export interface ResponsiveProps {
  mobile?: any
  tablet?: any
  desktop?: any
  widescreen?: any
}

// Data transformation types
export interface DataTransformer<TInput, TOutput> {
  transform: (input: TInput) => TOutput
  validate?: (input: TInput) => boolean
  fallback?: TOutput
  errorHandler?: (error: Error) => TOutput | null
}

export interface CacheConfig {
  ttl: number // time to live in milliseconds
  maxSize: number
  strategy: 'lru' | 'fifo' | 'lfu'
  enablePersistence?: boolean
}

// Type guards for runtime type checking
export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof Error && 'status' in error
}

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof Error && 'field' in error
}

export const isChartDataPoint = (obj: unknown): obj is ChartDataPoint => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'timestamp' in obj &&
    'value' in obj &&
    typeof (obj as ChartDataPoint).value === 'number'
  )
}

// Utility types for better type safety
export type NonEmptyArray<T> = [T, ...T[]]

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Event handling types
export interface DashboardEvent<T = any> {
  type: string
  payload: T
  timestamp: Date
  source: string
}

export interface EventHandler<T = any> {
  (event: DashboardEvent<T>): void | Promise<void>
}

export interface EventSubscription {
  unsubscribe: () => void
}