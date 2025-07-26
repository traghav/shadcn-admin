import React from 'react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { GlobalFilterBar } from '@/components/layout/global-filter-bar'
import { useFilterStore } from '@/stores/filterStore'
// import { useFilterUrlSync } from '@/hooks/use-filter-url-sync'"
import { FadeIn } from '@/components/ui/fade-in'
import { SmoothTransition } from '@/components/ui/smooth-transitions'
import { ErrorBoundary } from '@/components/ui/error-boundary'

interface DashboardLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  actions?: React.ReactNode
  showFilters?: boolean
}

export function DashboardLayout({ 
  title, 
  subtitle, 
  children, 
  actions,
  showFilters = true 
}: DashboardLayoutProps) {
  const { setActiveTab } = useFilterStore()
  
  // Initialize URL sync
  // useFilterUrlSync() // Temporarily disabled

  // Set active tab based on current route
  React.useEffect(() => {
    const path = window.location.pathname
    if (path === '/') {
      setActiveTab('availability')
    } else if (path === '/pricing') {
      setActiveTab('pricing')
    } else if (path === '/visibility') {
      setActiveTab('visibility')
    }
  }, [setActiveTab])


  return (
    <ErrorBoundary>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ml-auto flex items-center space-x-2 sm:space-x-4'>
          <div className="hidden sm:block">
            <Search />
          </div>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Global Filter Bar */}
      {showFilters && (
        <GlobalFilterBar />
      )}

      {/* ===== Main ===== */}
      <Main className="relative">
        <SmoothTransition>
          <div className="flex-1 min-w-0">
            {/* Page Header */}
            <FadeIn className='mb-4 sm:mb-6 space-y-3 sm:space-y-4 px-6 pt-6'>
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="min-w-0 flex-1">
                  <h1 className='text-xl sm:text-2xl font-bold tracking-tight truncate'>{title}</h1>
                  {subtitle && (
                    <p className="text-sm sm:text-base text-muted-foreground mt-1 line-clamp-2">{subtitle}</p>
                  )}
                </div>
                <div className='flex items-center space-x-2 flex-shrink-0'>
                  <div className="hidden sm:block">
                    {actions}
                  </div>
                </div>
              </div>

              {/* Mobile actions */}
              {actions && (
                <div className="sm:hidden">
                  {actions}
                </div>
              )}
            </FadeIn>

            {/* Content */}
            <FadeIn delay={100} className="space-y-4 sm:space-y-6 px-6 pb-6">
              {children}
            </FadeIn>
          </div>
        </SmoothTransition>
      </Main>
    </ErrorBoundary>
  )
}

// Simplified version for pages that don't need filters
export function SimpleDashboardLayout({ 
  title, 
  subtitle, 
  children, 
  actions 
}: Omit<DashboardLayoutProps, 'showFilters'>) {
  return (
    <DashboardLayout
      title={title}
      subtitle={subtitle}
      actions={actions}
      showFilters={false}
    >
      {children}
    </DashboardLayout>
  )
}