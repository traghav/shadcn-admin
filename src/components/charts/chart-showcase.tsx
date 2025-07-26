import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  AvailabilityHeatmap,
  PricingTrendChart,
  PricingComparisonChart,
  VisibilityRankingHeatmap,
  KeywordPerformanceChart,
  MarketShareChart,
  StorePerformanceTable
} from './index'
import { ResponsiveChartContainer, ChartGrid } from './responsive-chart-container'

interface ChartShowcaseProps {
  className?: string
}

export function ChartShowcase({ className = '' }: ChartShowcaseProps) {
  return (
    <div className={`w-full space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Kelpie Dashboard - Data Visualizations
            <Badge variant="secondary" className="ml-2">
              Interactive
            </Badge>
          </CardTitle>
          <CardDescription>
            Comprehensive analytics charts for quick commerce visibility, pricing, and availability insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="availability" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="visibility">Visibility</TabsTrigger>
              <TabsTrigger value="competitive">Competitive</TabsTrigger>
            </TabsList>

            {/* Availability Analytics */}
            <TabsContent value="availability" className="space-y-6 mt-6">
              <div className="grid gap-6">
                <ResponsiveChartContainer
                  title="SKU Availability Heatmap"
                  description="Interactive heatmap showing product availability across cities and platforms"
                  allowFullscreen
                >
                  <AvailabilityHeatmap />
                </ResponsiveChartContainer>
                
                <ResponsiveChartContainer
                  title="Store Performance Analysis"
                  description="Detailed store-level performance metrics with advanced filtering"
                  allowFullscreen
                >
                  <StorePerformanceTable />
                </ResponsiveChartContainer>
              </div>
            </TabsContent>

            {/* Pricing Analytics */}
            <TabsContent value="pricing" className="space-y-6 mt-6">
              <ChartGrid columns={2}>
                <ResponsiveChartContainer
                  title="Price Index Trends"
                  description="Time-series comparison of brand vs competitors"
                  allowFullscreen
                >
                  <PricingTrendChart height={450} />
                </ResponsiveChartContainer>
                
                <ResponsiveChartContainer
                  title="Competitive Pricing Analysis"
                  description="SKU-level pricing comparison with market positioning"
                  allowFullscreen
                >
                  <PricingComparisonChart height={450} />
                </ResponsiveChartContainer>
              </ChartGrid>
            </TabsContent>

            {/* Visibility Analytics */}
            <TabsContent value="visibility" className="space-y-6 mt-6">
              <ChartGrid columns={2}>
                <ResponsiveChartContainer
                  title="Search Ranking Heatmap"
                  description="Keyword rankings across platforms with performance insights"
                  allowFullscreen
                >
                  <VisibilityRankingHeatmap />
                </ResponsiveChartContainer>
                
                <ResponsiveChartContainer
                  title="Keyword Performance Analysis"
                  description="Multi-dimensional view of keyword effectiveness and opportunity"
                  allowFullscreen
                >
                  <KeywordPerformanceChart height={450} />
                </ResponsiveChartContainer>
              </ChartGrid>
            </TabsContent>

            {/* Competitive Analytics */}
            <TabsContent value="competitive" className="space-y-6 mt-6">
              <div className="grid gap-6">
                <ResponsiveChartContainer
                  title="Market Share & Competitive Positioning"
                  description="Share of voice analysis with platform-wise breakdown"
                  allowFullscreen
                >
                  <MarketShareChart height={500} />
                </ResponsiveChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Chart Features Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Visualization Features</CardTitle>
          <CardDescription>
            Key capabilities of the Kelpie Dashboard analytics suite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Interactive Elements</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Hover tooltips with detailed metrics</li>
                <li>• Click interactions and drill-downs</li>
                <li>• Dynamic filtering and sorting</li>
                <li>• Real-time data updates</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Responsive Design</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Mobile-optimized layouts</li>
                <li>• Fullscreen chart viewing</li>
                <li>• Adaptive grid systems</li>
                <li>• Touch-friendly interactions</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Advanced Analytics</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Multi-platform comparisons</li>
                <li>• Time-series trend analysis</li>
                <li>• Performance benchmarking</li>
                <li>• Competitive intelligence</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">Data Visualization</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Color-coded heatmaps</li>
                <li>• Multi-chart comparisons</li>
                <li>• Statistical summaries</li>
                <li>• Export capabilities</li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Performance Insights</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Availability tracking</li>
                <li>• Price competitiveness</li>
                <li>• Visibility rankings</li>
                <li>• Market positioning</li>
              </ul>
            </div>
            
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-medium text-emerald-800 mb-2">Business Intelligence</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• KPI monitoring</li>
                <li>• Trend identification</li>
                <li>• Problem detection</li>
                <li>• Strategic insights</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}