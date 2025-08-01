import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { VisibilityOverview } from './components/visibility-overview'
import { VisibilityCSVExport } from '@/components/export/csv-export-button'
import { transformDataForCSVExport } from '@/utils/csv-data-transformers'

export default function VisibilityAnalytics() {
  // Transform data for CSV export functionality
  const csvData = transformDataForCSVExport('visibility', 'overview')

  return (
    <DashboardLayout
      title="Visibility Analytics"
      subtitle="Track brand visibility and search performance across platforms"
      actions={
        <VisibilityCSVExport
          data={csvData}
          size="sm"
        />
      }
    >
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts-insights">Alerts and Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <VisibilityOverview />
          
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Search Performance</CardTitle>
                <CardDescription>
                  Track how brand products appear in search results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  Search performance chart placeholder
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Rankings</CardTitle>
                <CardDescription>
                  Monitor position across different product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  Category rankings chart placeholder
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Keywords</CardTitle>
              <CardDescription>
                Brand products with highest search visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Premium Whole Wheat Atta</p>
                    <p className="text-sm text-muted-foreground">Keyword: "atta"</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-chart-1">#1</p>
                    <p className="text-sm text-muted-foreground">35.6% SOV</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">Premium Multigrain Atta</p>
                    <p className="text-sm text-muted-foreground">Keyword: "multigrain atta"</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-chart-2">#3</p>
                    <p className="text-sm text-muted-foreground">19.8% SOV</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">Premium Instant Poha</p>
                    <p className="text-sm text-muted-foreground">Keyword: "instant poha"</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-chart-3">#4</p>
                    <p className="text-sm text-muted-foreground">15.2% SOV</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts-insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alerts and Insights</CardTitle>
              <CardDescription>
                Search visibility alerts and keyword performance insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg mb-2">Coming Soon</p>
                  <p className="text-sm">Advanced visibility alerts and insights will be available here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}