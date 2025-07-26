import React from 'react'
import { ComponentPerformance, OptimizationReport, PerformanceMetrics } from '@/types/performance'

// Performance monitoring utilities for React components and operations

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private componentMetrics: Map<string, ComponentPerformance> = new Map()
  private operationMetrics: Map<string, PerformanceMetrics> = new Map()
  private isEnabled: boolean = process.env.NODE_ENV === 'development'

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }

  // Monitor component render performance
  measureComponent(componentName: string, renderFn: () => any): any {
    if (!this.isEnabled) {
      return renderFn()
    }

    const startTime = performance.now()
    const startMemory = this.getMemoryUsage()
    
    const result = renderFn()
    
    const endTime = performance.now()
    const endMemory = this.getMemoryUsage()
    const renderTime = endTime - startTime

    // Update component metrics
    const existing = this.componentMetrics.get(componentName)
    const updated: ComponentPerformance = {
      componentName,
      renderTime,
      propsSize: this.estimateObjectSize(result?.props || {}),
      reRenderTriggers: existing ? [...existing.reRenderTriggers] : [],
      lastRender: new Date()
    }

    this.componentMetrics.set(componentName, updated)

    // Log slow renders
    if (renderTime > 100) {
      console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`)
    }

    return result
  }

  // Monitor async operations
  async measureAsync<T extends unknown>(operationName: string, operation: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) {
      return operation()
    }

    const startTime = performance.now()
    const startMemory = this.getMemoryUsage()
    
    try {
      const result = await operation()
      const endTime = performance.now()
      const endMemory = this.getMemoryUsage()
      
      const metrics: PerformanceMetrics = {
        renderTime: endTime - startTime,
        dataSize: this.estimateObjectSize(result),
        memoryUsage: endMemory - startMemory,
        reRenderCount: 0,
        lastOptimization: new Date()
      }

      this.operationMetrics.set(operationName, metrics)
      
      return result
    } catch (error) {
      const endTime = performance.now()
      console.error(`Operation ${operationName} failed after ${(endTime - startTime).toFixed(2)}ms:`, error)
      throw error
    }
  }

  // Track re-render triggers
  trackReRender(componentName: string, trigger: string) {
    if (!this.isEnabled) return

    const existing = this.componentMetrics.get(componentName)
    if (existing) {
      existing.reRenderTriggers.push(trigger)
      existing.reRenderTriggers = existing.reRenderTriggers.slice(-10) // Keep last 10 triggers
      this.componentMetrics.set(componentName, existing)
    }
  }

  // Generate performance report
  generateReport(): OptimizationReport {
    const components = Array.from(this.componentMetrics.values())
    const totalRenderTime = components.reduce((sum, comp) => sum + comp.renderTime, 0)
    const slowestComponents = components
      .filter(comp => comp.renderTime > 50)
      .sort((a, b) => b.renderTime - a.renderTime)
      .slice(0, 5)
      .map(comp => comp.componentName)

    const recommendations = this.generateRecommendations(components)

    return {
      components,
      totalRenderTime,
      slowestComponents,
      recommendations,
      generatedAt: new Date()
    }
  }

  // Clear all metrics
  clearMetrics() {
    this.componentMetrics.clear()
    this.operationMetrics.clear()
  }

  // Get metrics for a specific component
  getComponentMetrics(componentName: string): ComponentPerformance | undefined {
    return this.componentMetrics.get(componentName)
  }

  // Private utility methods
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize
    }
    return 0
  }

  private estimateObjectSize(obj: any): number {
    try {
      return JSON.stringify(obj).length
    } catch {
      return 0
    }
  }

  private generateRecommendations(components: ComponentPerformance[]): string[] {
    const recommendations: string[] = []
    
    // Check for components with frequent re-renders
    const frequentReRenders = components.filter(comp => comp.reRenderTriggers.length > 5)
    if (frequentReRenders.length > 0) {
      recommendations.push(
        `Consider memoizing components: ${frequentReRenders.map(c => c.componentName).join(', ')}`
      )
    }

    // Check for slow render times
    const slowComponents = components.filter(comp => comp.renderTime > 100)
    if (slowComponents.length > 0) {
      recommendations.push(
        `Optimize render performance for: ${slowComponents.map(c => c.componentName).join(', ')}`
      )
    }

    // Check for large prop sizes
    const heavyComponents = components.filter(comp => comp.propsSize > 10000)
    if (heavyComponents.length > 0) {
      recommendations.push(
        `Consider reducing prop size for: ${heavyComponents.map(c => c.componentName).join(', ')}`
      )
    }

    return recommendations
  }
}

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance()
  
  return {
    measure: <T extends unknown>(fn: () => T): T => monitor.measureComponent(componentName, fn),
    measureAsync: <T extends unknown>(fn: () => Promise<T>): Promise<T> => monitor.measureAsync(componentName, fn),
    trackReRender: (trigger: string) => monitor.trackReRender(componentName, trigger),
    getMetrics: () => monitor.getComponentMetrics(componentName)
  }
}

// HOC for automatic performance monitoring
export const withPerformanceMonitoring = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent = React.memo((props: P) => {
    const monitor = PerformanceMonitor.getInstance()
    const name = componentName || Component.displayName || Component.name || 'AnonymousComponent'
    
    return monitor.measureComponent(name, () => <Component {...props} />)
  })

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName || Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Utility functions
export const startPerformanceMonitoring = () => {
  PerformanceMonitor.getInstance().enable()
}

export const stopPerformanceMonitoring = () => {
  PerformanceMonitor.getInstance().disable()
}

export const getPerformanceReport = (): OptimizationReport => {
  return PerformanceMonitor.getInstance().generateReport()
}

export const clearPerformanceMetrics = () => {
  PerformanceMonitor.getInstance().clearMetrics()
}

// Performance measurement decorator for class methods
export const measurePerformance = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value
  
  descriptor.value = function (...args: any[]) {
    const monitor = PerformanceMonitor.getInstance()
    const methodName = `${target.constructor.name}.${propertyKey}`
    
    if (originalMethod.constructor.name === 'AsyncFunction') {
      return monitor.measureAsync(methodName, () => originalMethod.apply(this, args))
    } else {
      return monitor.measureComponent(methodName, () => originalMethod.apply(this, args))
    }
  }
  
  return descriptor
}

// Bundle size analyzer (rough estimation)
export const analyzeBundleSize = () => {
  const scripts = Array.from(document.querySelectorAll('script[src]'))
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
  
  const analysis = {
    scriptCount: scripts.length,
    styleCount: styles.length,
    estimatedSize: 0,
    recommendations: [] as string[]
  }

  // This is a basic analysis - in a real app, you'd integrate with webpack-bundle-analyzer
  if (scripts.length > 10) {
    analysis.recommendations.push('Consider code splitting to reduce initial bundle size')
  }
  
  if (styles.length > 5) {
    analysis.recommendations.push('Consider combining CSS files to reduce HTTP requests')
  }

  return analysis
}

// Memory leak detector
export const detectMemoryLeaks = () => {
  const monitor = PerformanceMonitor.getInstance()
  const report = monitor.generateReport()
  
  const suspiciousComponents = report.components.filter(comp => 
    comp.reRenderTriggers.length > 20 || comp.propsSize > 50000
  )

  if (suspiciousComponents.length > 0) {
    console.warn('Potential memory leaks detected in components:', 
      suspiciousComponents.map(c => c.componentName))
  }

  return {
    suspicious: suspiciousComponents,
    totalMemoryUsage: monitor['getMemoryUsage']?.() || 0,
    recommendations: suspiciousComponents.length > 0 
      ? ['Check for closure captures and large object references in the flagged components']
      : ['No memory leaks detected']
  }
}

export default PerformanceMonitor