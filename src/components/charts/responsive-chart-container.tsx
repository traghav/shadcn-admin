import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExpandIcon, ShrinkIcon } from 'lucide-react'
import { useState } from 'react'

interface ResponsiveChartContainerProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  allowFullscreen?: boolean
  actions?: ReactNode
}

export function ResponsiveChartContainer({
  title,
  description,
  children,
  className = '',
  allowFullscreen = true,
  actions
}: ResponsiveChartContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Card className={`
      w-full transition-all duration-300
      ${isFullscreen ? 
        'fixed inset-4 z-50 bg-white shadow-2xl' : 
        'relative'
      }
      ${className}
    `}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg md:text-xl truncate">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm md:text-base mt-1">
                {description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            {actions}
            {allowFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="p-2 h-auto"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <ShrinkIcon className="w-4 h-4" />
                ) : (
                  <ExpandIcon className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={`
        ${isFullscreen ? 'h-[calc(100vh-8rem)] overflow-auto' : ''}
      `}>
        <div className={`
          ${isFullscreen ? 'h-full' : ''}
          ${isFullscreen ? 'min-h-[600px]' : 'min-h-[400px]'}
        `}>
          {children}
        </div>
      </CardContent>
      
      {/* Fullscreen overlay backdrop */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleFullscreen}
        />
      )}
    </Card>
  )
}

// Mobile-optimized chart wrapper for smaller screens
export function MobileChartWrapper({
  children,
  title,
  compact = false
}: {
  children: ReactNode
  title?: string
  compact?: boolean
}) {
  return (
    <div className={`
      w-full
      ${compact ? 'min-h-[250px]' : 'min-h-[350px]'}
      md:min-h-[400px]
    `}>
      {title && (
        <div className="mb-3 px-2">
          <h3 className="text-sm font-medium text-gray-700 md:text-base">
            {title}
          </h3>
        </div>
      )}
      <div className={`
        ${compact ? 'h-[250px]' : 'h-[350px]'}
        md:h-[400px]
        w-full
      `}>
        {children}
      </div>
    </div>
  )
}

// Grid layout for responsive chart arrangement
export function ChartGrid({
  children,
  columns = 'auto',
  gap = 'default'
}: {
  children: ReactNode
  columns?: 'auto' | 1 | 2 | 3 | 4
  gap?: 'tight' | 'default' | 'loose'
}) {
  const getGridCols = () => {
    if (columns === 'auto') return 'grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3'
    return `grid-cols-1 md:grid-cols-${Math.min(columns, 2)} xl:grid-cols-${columns}`
  }

  const getGap = () => {
    switch (gap) {
      case 'tight': return 'gap-3'
      case 'loose': return 'gap-8'
      default: return 'gap-6'
    }
  }

  return (
    <div className={`
      grid ${getGridCols()} ${getGap()}
      w-full
    `}>
      {children}
    </div>
  )
}

// Responsive breakpoint hook for conditional rendering
export function useResponsiveBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  // This would typically use a media query hook in a real app
  // For demo purposes, we'll just return desktop
  return breakpoint
}