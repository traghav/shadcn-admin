import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SmoothTransitionProps {
  children: ReactNode
  className?: string
}

export function SmoothTransition({ children, className }: SmoothTransitionProps) {
  return (
    <div 
      className={cn(
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {children}
    </div>
  )
}

export function ScaleOnHover({ children, className, scale = 'scale-105' }: { 
  children: ReactNode
  className?: string
  scale?: string
}) {
  return (
    <div 
      className={cn(
        'transition-transform duration-200 ease-in-out hover:' + scale,
        className
      )}
    >
      {children}
    </div>
  )
}

export function PulseOnHover({ children, className }: { 
  children: ReactNode
  className?: string
}) {
  return (
    <div 
      className={cn(
        'transition-all duration-200 ease-in-out hover:animate-pulse',
        className
      )}
    >
      {children}
    </div>
  )
}

export function SlideIn({ 
  children, 
  direction = 'left',
  className 
}: { 
  children: ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  className?: string
}) {
  const directionClasses = {
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right', 
    up: 'animate-slide-in-up',
    down: 'animate-slide-in-down'
  }

  return (
    <div className={cn(directionClasses[direction], className)}>
      {children}
    </div>
  )
}

// Custom animation utilities that can be added to tailwind.config.js
export const customAnimations = {
  'slide-in-left': {
    '0%': { transform: 'translateX(-100%)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' }
  },
  'slide-in-right': {
    '0%': { transform: 'translateX(100%)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' }
  },
  'slide-in-up': {
    '0%': { transform: 'translateY(100%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' }
  },
  'slide-in-down': {
    '0%': { transform: 'translateY(-100%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' }
  },
  'bounce-subtle': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-5px)' }
  },
  'glow': {
    '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
    '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }
  }
}