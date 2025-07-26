import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { ScaleOnHover } from '@/components/ui/smooth-transitions'
import { memo } from 'react'

export type TrendDirection = 'up' | 'down' | 'neutral'
export type StatusType = 'good' | 'warning' | 'bad' | 'neutral'

export interface KpiData {
  title: string
  value: string | number
  trend?: {
    direction: TrendDirection
    percentage: number
    period: string
  }
  status?: StatusType
  icon?: React.ReactNode
  description?: string
  target?: string | number
  unit?: string
}

interface KpiCardProps {
  data: KpiData
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

function TrendIndicator({ 
  direction, 
  percentage, 
  period 
}: { 
  direction: TrendDirection
  percentage: number
  period: string 
}) {
  const isPositive = direction === 'up'
  const isNegative = direction === 'down'
  const isNeutral = direction === 'neutral'

  return (
    <div className="flex items-center gap-1">
      {!isNeutral && (
        <div className={cn(
          'flex items-center justify-center w-4 h-4 rounded-full',
          isPositive && 'bg-green-100 text-green-600',
          isNegative && 'bg-red-100 text-red-600'
        )}>
          <svg 
            className="w-3 h-3" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            {isPositive ? (
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            )}
          </svg>
        </div>
      )}
      <span className={cn(
        'text-sm font-medium',
        isPositive && 'text-green-600',
        isNegative && 'text-red-600',
        isNeutral && 'text-gray-500'
      )}>
        {!isNeutral && (isPositive ? '+' : '')}{percentage}%
      </span>
      <span className="text-xs text-muted-foreground">vs {period}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: StatusType }) {
  const statusConfig = {
    good: { label: 'Good', variant: 'default' as const, className: 'bg-green-100 text-green-800 border-green-200' },
    warning: { label: 'Warning', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    bad: { label: 'Critical', variant: 'destructive' as const, className: 'bg-red-100 text-red-800 border-red-200' },
    neutral: { label: 'Neutral', variant: 'outline' as const, className: 'bg-gray-100 text-gray-800 border-gray-200' }
  }

  const config = statusConfig[status]

  return (
    <Badge 
      variant={config.variant}
      className={cn('text-xs', config.className)}
    >
      {config.label}
    </Badge>
  )
}

const KpiCardComponent = memo(({ data, className, size = 'md' }: KpiCardProps) => {
  const sizeClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6', 
    lg: 'p-6 sm:p-8'
  }

  const valueSizeClasses = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl'
  }

  const iconSizeClasses = {
    sm: 'w-6 h-6 sm:w-8 sm:h-8',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  // Parse numeric value for animation
  const numericValue = typeof data.value === 'string' 
    ? parseFloat(data.value.replace(/[^0-9.-]/g, '')) 
    : data.value

  const isNumeric = !isNaN(numericValue)

  return (
    <ScaleOnHover scale="scale-102">
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4',
        data.status === 'good' && 'border-l-green-500',
        data.status === 'warning' && 'border-l-yellow-500',
        data.status === 'bad' && 'border-l-red-500',
        data.status === 'neutral' && 'border-l-gray-300',
        !data.status && 'border-l-primary',
        className
      )}>
        <CardHeader className={cn('pb-2', sizeClasses[size])}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
              {data.icon && (
                <div className={cn(
                  'flex items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0',
                  iconSizeClasses[size]
                )}>
                  {data.icon}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">
                  {data.title}
                </h3>
                {data.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {data.description}
                  </p>
                )}
              </div>
            </div>
            {data.status && (
              <div className="flex-shrink-0">
                <StatusBadge status={data.status} />
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className={cn('pt-0', sizeClasses[size])}>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              {isNumeric ? (
                <AnimatedCounter
                  value={numericValue}
                  className={cn(
                    'font-bold tracking-tight text-foreground',
                    valueSizeClasses[size]
                  )}
                  decimals={data.value.toString().includes('.') ? 1 : 0}
                />
              ) : (
                <span className={cn(
                  'font-bold tracking-tight text-foreground',
                  valueSizeClasses[size]
                )}>
                  {data.value}
                </span>
              )}
              {data.unit && (
                <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                  {data.unit}
                </span>
              )}
            </div>
            
            {data.target && (
              <div className="text-xs text-muted-foreground">
                Target: {data.target}{data.unit || ''}
              </div>
            )}
            
            {data.trend && (
              <TrendIndicator 
                direction={data.trend.direction}
                percentage={data.trend.percentage}
                period={data.trend.period}
              />
            )}
          </div>
        </CardContent>
        
        {/* Subtle background gradient for visual interest */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/5 pointer-events-none" />
      </Card>
    </ScaleOnHover>
  )
})

KpiCardComponent.displayName = 'KpiCard'

export const KpiCard = KpiCardComponent

// Enhanced grid component with better mobile responsiveness and animations
export function KpiCardGrid({ 
  children, 
  className,
  cols = 4
}: { 
  children: React.ReactNode
  className?: string
  cols?: 2 | 3 | 4 | 5
}) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
  }

  return (
    <div className={cn(
      'grid gap-3 sm:gap-4 lg:gap-6',
      gridClasses[cols],
      className
    )}>
      {children}
    </div>
  )
}