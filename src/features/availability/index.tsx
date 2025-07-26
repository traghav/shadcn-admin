import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AvailabilityOverview } from './components/availability-overview'
import { Overview } from '@/features/dashboard/components/overview'
import { RecentSales } from '@/features/dashboard/components/recent-sales'
import { AvailabilityCSVExport } from '@/components/export/csv-export-button'
import { transformDataForCSVExport } from '@/utils/csv-data-transformers'
import { ErrorBoundary, ChartErrorBoundary, TableErrorBoundary } from '@/components/ui/error-boundary'
import { ChartSkeleton, TableSkeleton } from '@/components/ui/chart-skeleton'
import { FadeIn, StaggeredFadeIn } from '@/components/ui/fade-in'
import { SmoothTransition } from '@/components/ui/smooth-transitions'
import { useSimulatedAsync } from '@/hooks/use-async-data'
import { withPerformanceMonitoring } from '@/utils/performance-monitor.tsx'
import { memo, Suspense } from 'react'

// Memoized components for better performance
const StockLevelsChart = memo(() => (
  <ChartErrorBoundary>
    <Suspense fallback={<ChartSkeleton height="h-64" />}>
      <Overview />
    </Suspense>
  </ChartErrorBoundary>
))

const RecentStockChanges = memo(() => (
  <TableErrorBoundary>
    <Suspense fallback={<TableSkeleton rows={5} />}>
      <RecentSales />
    </Suspense>
  </TableErrorBoundary>
))

const LowStockAlert = memo(({ product, category, stores, severity, color }: {
  product: string
  category: string
  stores: number
  severity: string
  color: string
}) => (
  <FadeIn className="flex items-center justify-between py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors duration-200 rounded-sm px-2">
    <div className="min-w-0 flex-1">
      <p className="font-medium truncate">{product}</p>
      <p className="text-sm text-muted-foreground">{category}</p>
    </div>
    <div className="text-right flex-shrink-0 ml-4">
      <p className={`font-medium ${color}`}>{stores} stores</p>
      <p className="text-sm text-muted-foreground">{severity}</p>
    </div>
  </FadeIn>
))

LowStockAlert.displayName = 'LowStockAlert'

const AvailabilityAnalyticsComponent = memo(() => {
  // Simulate async data loading for demonstration
  const { loading: csvLoading } = useSimulatedAsync(null, 300)
  
  // Transform data for CSV export functionality
  const csvData = transformDataForCSVExport('availability', 'overview')

  const lowStockAlerts = [
    {
      product: "Aashirvaad Whole Wheat Atta 5kg",
      category: "Atta",
      stores: 3,
      severity: "Critical",
      color: "text-red-600"
    },
    {
      product: "Aashirvaad Instant Poha",
      category: "Ready-to-Eat",
      stores: 8,
      severity: "Low",
      color: "text-orange-600"
    },
    {
      product: "Aashirvaad Turmeric Powder",
      category: "Spices",
      stores: 15,
      severity: "Watch",
      color: "text-yellow-600"
    }
  ]

  return (
    <DashboardLayout
      title="Availability Analytics"
      subtitle="Monitor Aashirvaad product availability across quick commerce platforms"
      actions={
        <SmoothTransition>
          <div className="flex flex-col sm:flex-row gap-2">
            <AvailabilityCSVExport
              data={csvData}
              size="sm"
              disabled={csvLoading}
            />
            <Button size="sm">
              Restock Alert
            </Button>
          </div>
        </SmoothTransition>
      }
    >
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts-insights">Alerts and Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 sm:space-y-6" data-export-capture>
          <FadeIn>
            <AvailabilityOverview />
          </FadeIn>
          
          <StaggeredFadeIn staggerDelay={150} initialDelay={200}>
            <div className='grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Stock Levels Overview</CardTitle>
                  <CardDescription>
                    Monitor inventory levels across all product categories
                  </CardDescription>
                </CardHeader>
                <CardContent className='pl-2'>
                  <StockLevelsChart />
                </CardContent>
              </Card>
              
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Stock Changes</CardTitle>
                  <CardDescription>
                    Latest inventory updates and movements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentStockChanges />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>
                  Products that need immediate restocking attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {lowStockAlerts.map((alert, index) => (
                    <LowStockAlert
                      key={`${alert.product}-${index}`}
                      {...alert}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggeredFadeIn>
        </TabsContent>
        
        <TabsContent value="alerts-insights" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alerts and Insights</CardTitle>
              <CardDescription>
                Advanced analytics and intelligent alerts for availability monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg mb-2">Coming Soon</p>
                  <p className="text-sm">Advanced alerts and insights will be available here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
})

AvailabilityAnalyticsComponent.displayName = 'AvailabilityAnalytics'

const AvailabilityAnalytics = withPerformanceMonitoring(AvailabilityAnalyticsComponent, 'AvailabilityAnalytics')

export default AvailabilityAnalytics