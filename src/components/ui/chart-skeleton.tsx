import { Skeleton } from './skeleton'
import { Card, CardContent, CardHeader } from './card'

interface ChartSkeletonProps {
  className?: string
  showHeader?: boolean
  height?: string
}

export function ChartSkeleton({ 
  className, 
  showHeader = true, 
  height = 'h-80' 
}: ChartSkeletonProps) {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      )}
      <CardContent>
        <div className={`w-full ${height} flex items-end justify-between gap-2 p-4`}>
          {/* Simulated bar chart skeleton */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <Skeleton 
                className="w-full animate-pulse" 
                style={{ 
                  height: `${Math.random() * 60 + 40}%`,
                  animationDelay: `${i * 100}ms`
                }} 
              />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface HeatmapSkeletonProps {
  className?: string
  rows?: number
  cols?: number
}

export function HeatmapSkeleton({ 
  className, 
  rows = 6, 
  cols = 5 
}: HeatmapSkeletonProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-9 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
          
          {/* Heatmap grid skeleton */}
          <div className="space-y-2">
            {/* Header */}
            <div className="flex gap-1">
              <Skeleton className="h-8 w-48" />
              {Array.from({ length: cols }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
            
            {/* Data rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                <Skeleton className="h-12 w-48" />
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <Skeleton 
                    key={colIndex} 
                    className="h-12 w-24 animate-pulse"
                    style={{ 
                      animationDelay: `${(rowIndex * cols + colIndex) * 50}ms`
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TableSkeletonProps {
  className?: string
  rows?: number
  cols?: number
}

export function TableSkeleton({ 
  className, 
  rows = 5, 
  cols = 4 
}: TableSkeletonProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Table header */}
          <div className="flex gap-4 pb-2 border-b">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          
          {/* Table rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 py-2">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  className="h-4 flex-1 animate-pulse"
                  style={{ 
                    animationDelay: `${rowIndex * cols * 50 + colIndex * 25}ms`
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface KPISkeletonProps {
  className?: string
  count?: number
}

export function KPISkeleton({ className, count = 4 }: KPISkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}