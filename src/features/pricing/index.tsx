import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PricingOverview } from './components/pricing-overview'
import { StorePerformanceTable } from '@/components/charts/store-performance-table'
import { PricingCSVExport } from '@/components/export/csv-export-button'
import { transformDataForCSVExport } from '@/utils/csv-data-transformers'

export default function PricingAnalytics() {
  // Transform data for CSV export functionality
  const csvData = transformDataForCSVExport('pricing', 'overview')

  return (
    <DashboardLayout
      title="Pricing Analytics"
      subtitle="Monitor Aashirvaad pricing strategy and competitive positioning"
      actions={
        <div className="flex gap-2">
          <PricingCSVExport
            data={csvData}
            size="sm"
          />
          <Button>Price Alert</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <PricingOverview />
        
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Price Trends</CardTitle>
              <CardDescription>
                Monitor price changes over time across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Price trend chart placeholder
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
              <CardDescription>
                Compare pricing with competitors in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Competitive analysis chart placeholder
              </div>
            </CardContent>
          </Card>
        </div>
        
        <StorePerformanceTable 
          title="Pricing Performance by Store"
          description="Store-level pricing performance and order value metrics"
        />
      </div>
    </DashboardLayout>
  )
}