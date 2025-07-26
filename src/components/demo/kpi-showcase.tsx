import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AvailabilityKpiGrid } from '@/components/kpi/availability-kpis'
import { PricingKpiGrid } from '@/components/kpi/pricing-kpis'
import { VisibilityKpiGrid } from '@/components/kpi/visibility-kpis'
import { KpiCard, KpiCardGrid } from '@/components/ui/kpi-card'
import { 
  AvailabilityIcon, 
  PriceIndexIcon, 
  ShareOfVoiceIcon,
  TrendUpIcon
} from '@/components/icons/kpi-icons'

export function KpiShowcase() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KPI Cards Showcase</h1>
          <p className="text-muted-foreground">
            Reusable KPI card components for Kelpie Analytics Dashboard
          </p>
        </div>
        <Button>Export Demo Data</Button>
      </div>

      {/* Demo Section: Individual KPI Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Individual KPI Card Examples</CardTitle>
          <CardDescription>
            Examples of individual KPI cards with different states and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KpiCardGrid className="lg:grid-cols-3">
            <KpiCard 
              size="sm"
              data={{
                title: 'Small Size Card',
                value: '94.2',
                unit: '%',
                trend: {
                  direction: 'up',
                  percentage: 2.1,
                  period: 'last week'
                },
                status: 'good',
                icon: <AvailabilityIcon />
              }}
            />
            <KpiCard 
              size="md"
              data={{
                title: 'Medium Size Card',
                value: '₹12.6',
                unit: 'M',
                trend: {
                  direction: 'down',
                  percentage: 3.5,
                  period: 'last month'
                },
                status: 'warning',
                icon: <PriceIndexIcon />,
                target: '₹15M'
              }}
            />
            <KpiCard 
              size="lg"
              data={{
                title: 'Large Size Card',
                value: '23.8',
                unit: '%',
                trend: {
                  direction: 'neutral',
                  percentage: 0.2,
                  period: 'last week'
                },
                status: 'neutral',
                icon: <ShareOfVoiceIcon />,
                description: 'Share of voice in category'
              }}
            />
          </KpiCardGrid>
        </CardContent>
      </Card>

      {/* Demo Section: Status Variations */}
      <Card>
        <CardHeader>
          <CardTitle>Status Indicator Variations</CardTitle>
          <CardDescription>
            Different status indicators: good, warning, bad, neutral
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KpiCardGrid>
            <KpiCard 
              data={{
                title: 'Good Performance',
                value: 94.5,
                unit: '%',
                status: 'good',
                trend: { direction: 'up', percentage: 5.2, period: 'last month' },
                icon: <TrendUpIcon />
              }}
            />
            <KpiCard 
              data={{
                title: 'Warning Status',
                value: 76.3,
                unit: '%',
                status: 'warning',
                trend: { direction: 'down', percentage: 2.1, period: 'last week' },
                icon: <TrendUpIcon />
              }}
            />
            <KpiCard 
              data={{
                title: 'Critical Issue',
                value: 45.2,
                unit: '%',
                status: 'bad',
                trend: { direction: 'down', percentage: 12.5, period: 'last month' },
                icon: <TrendUpIcon />
              }}
            />
            <KpiCard 
              data={{
                title: 'Neutral Metric',
                value: 127,
                status: 'neutral',
                trend: { direction: 'neutral', percentage: 0.1, period: 'last week' },
                icon: <TrendUpIcon />
              }}
            />
          </KpiCardGrid>
        </CardContent>
      </Card>

      {/* Tab-based Dashboard Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Analytics Tabs</CardTitle>
          <CardDescription>
            Complete KPI grids for each analytics tab in the Kelpie Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="availability" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="visibility">Visibility</TabsTrigger>
            </TabsList>
            
            <TabsContent value="availability" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Availability Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  brand products across Blinkit, Swiggy Instamart, and Zepto
                </p>
              </div>
              <AvailabilityKpiGrid />
            </TabsContent>
            
            <TabsContent value="pricing" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Pricing Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Price optimization and competitive intelligence
                </p>
              </div>
              <PricingKpiGrid />
            </TabsContent>
            
            <TabsContent value="visibility" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Visibility Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Search ranking and share of voice tracking
                </p>
              </div>
              <VisibilityKpiGrid />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Technical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
          <CardDescription>
            Key features and usage of the KPI card components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Flexible sizing (sm, md, lg)</li>
                <li>• Trend indicators with direction</li>
                <li>• Status badges (good, warning, bad, neutral)</li>
                <li>• Custom icons and descriptions</li>
                <li>• Target value comparisons</li>
                <li>• Responsive grid layouts</li>
                <li>• TypeScript type safety</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Components</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code>KpiCard</code> - Base component</li>
                <li>• <code>KpiCardGrid</code> - Grid layout</li>
                <li>• <code>AvailabilityKpiGrid</code> - Availability metrics</li>
                <li>• <code>PricingKpiGrid</code> - Pricing metrics</li>
                <li>• <code>VisibilityKpiGrid</code> - Visibility metrics</li>
                <li>• Custom icons for each metric type</li>
                <li>• Mock data generators for demos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}