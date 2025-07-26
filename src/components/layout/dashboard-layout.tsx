import React from 'react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { FilterPanel } from '@/components/layout/filter-panel'
import { FilterIndicator } from '@/components/layout/filter-indicator'
import { useFilterStore } from '@/stores/filterStore'
import { useFilterUrlSync } from '@/hooks/use-filter-url-sync'
import { useIsMobile } from '@/hooks/use-mobile'
import { Filter, X } from 'lucide-react'
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
  const { toggleFilterPanel, isFilterPanelOpen, setActiveTab, setFilterPanelOpen } = useFilterStore()
  const isMobile = useIsMobile()
  
  // Initialize URL sync
  useFilterUrlSync()

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

  // Auto-close filter panel on mobile when navigating
  React.useEffect(() => {
    if (isMobile && isFilterPanelOpen) {
      const handleRouteChange = () => {
        setFilterPanelOpen(false)
      }
      
      window.addEventListener('popstate', handleRouteChange)
      return () => window.removeEventListener('popstate', handleRouteChange)
    }
  }, [isMobile, isFilterPanelOpen, setFilterPanelOpen])

  const topNav = [
    {
      title: 'Availability',
      href: '/',
      isActive: window.location.pathname === '/',
      disabled: false,
    },
    {
      title: 'Pricing',
      href: '/pricing',
      isActive: window.location.pathname === '/pricing',
      disabled: false,
    },
    {
      title: 'Visibility',
      href: '/visibility',
      isActive: window.location.pathname === '/visibility',
      disabled: false,
    },
  ]

  return (
    <ErrorBoundary>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-2 sm:space-x-4'>
          <div className="hidden sm:block">
            <Search />
          </div>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main className="relative">
        <SmoothTransition>
          <div className="flex gap-4 lg:gap-6">
            {/* Filter Panel - Desktop */}
            {showFilters && isFilterPanelOpen && (
              <FadeIn direction="left" className="hidden lg:block">
                <FilterPanel className="sticky top-6" />
              </FadeIn>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Page Header */}
              <FadeIn className='mb-4 sm:mb-6 space-y-3 sm:space-y-4'>
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="min-w-0 flex-1">
                    <h1 className='text-xl sm:text-2xl font-bold tracking-tight truncate'>{title}</h1>
                    {subtitle && (
                      <p className="text-sm sm:text-base text-muted-foreground mt-1 line-clamp-2">{subtitle}</p>
                    )}
                  </div>
                  <div className='flex items-center space-x-2 flex-shrink-0'>
                    {showFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFilterPanel}
                        className="lg:hidden"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    )}
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

                {/* Filter Indicators */}
                {showFilters && (
                  <FilterIndicator className="lg:hidden" />
                )}
              </FadeIn>

              {/* Content */}
              <FadeIn delay={100} className="space-y-4 sm:space-y-6">
                {children}
              </FadeIn>
            </div>
          </div>
        </SmoothTransition>

        {/* Mobile Filter Panel */}
        {showFilters && isFilterPanelOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-300">
            <div className="fixed inset-y-0 left-0 w-full max-w-sm shadow-lg overflow-hidden animate-in slide-in-from-left-0 duration-300">
              <div className="h-full bg-background border-r">
                {/* Mobile filter header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFilterPanel}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <FilterPanel className="h-[calc(100%-4rem)] border-0" />
              </div>
            </div>
            <div 
              className="absolute inset-0 -z-10"
              onClick={() => toggleFilterPanel()}
            />
          </div>
        )}
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