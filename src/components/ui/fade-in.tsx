import { ReactNode, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
}

export function FadeIn({
  children,
  delay = 0,
  duration = 500,
  className = '',
  direction = 'up',
  distance = 20
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const getTransformStyle = () => {
    if (isVisible) return 'translate-x-0 translate-y-0'
    
    switch (direction) {
      case 'up':
        return `translate-y-${distance}`
      case 'down':
        return `-translate-y-${distance}`
      case 'left':
        return `translate-x-${distance}`
      case 'right':
        return `-translate-x-${distance}`
      default:
        return ''
    }
  }

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        getTransformStyle(),
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

interface StaggeredFadeInProps {
  children: ReactNode[]
  staggerDelay?: number
  initialDelay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export function StaggeredFadeIn({
  children,
  staggerDelay = 100,
  initialDelay = 0,
  className = '',
  direction = 'up'
}: StaggeredFadeInProps) {
  return (
    <>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          delay={initialDelay + (index * staggerDelay)}
          className={className}
          direction={direction}
        >
          {child}
        </FadeIn>
      ))}
    </>
  )
}