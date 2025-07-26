import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
      subtitle="Track Aashirvaad brand visibility and search performance across platforms"
      actions={
        <div className="flex gap-2">
          <VisibilityCSVExport
            data={csvData}
            size="sm"
          />
          <Button>Optimize Visibility</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <VisibilityOverview />
        
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Search Performance</CardTitle>
              <CardDescription>
                Track how Aashirvaad products appear in search results
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
              Aashirvaad products with highest search visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Aashirvaad Whole Wheat Atta</p>
                  <p className="text-sm text-muted-foreground">Keyword: "atta"</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">#1</p>
                  <p className="text-sm text-muted-foreground">35.6% SOV</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Aashirvaad Multigrain Atta</p>
                  <p className="text-sm text-muted-foreground">Keyword: "multigrain atta"</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">#3</p>
                  <p className="text-sm text-muted-foreground">19.8% SOV</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Aashirvaad Instant Poha</p>
                  <p className="text-sm text-muted-foreground">Keyword: "instant poha"</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-600">#4</p>
                  <p className="text-sm text-muted-foreground">15.2% SOV</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}