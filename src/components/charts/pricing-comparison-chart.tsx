import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { visualizationData, type PricingComparisonData } from '@/data/mock-kpi-data'
import { useState } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts'

interface PricingComparisonChartProps {
  data?: PricingComparisonData[]
  title?: string
  description?: string
  height?: number
}

export function PricingComparisonChart({ 
  data = visualizationData.pricingComparison,
  title = "Competitive Pricing Analysis",
  description = "Aashirvaad pricing vs competitor averages by SKU and platform",
  height = 400
}: PricingComparisonChartProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [chartType, setChartType] = useState<'bar' | 'scatter'>('bar')

  // Filter data by platform
  const filteredData = selectedPlatform === 'all' 
    ? data 
    : data.filter(item => item.platform === selectedPlatform)

  // Aggregate data by SKU (average across platforms if showing all)
  const aggregatedData = selectedPlatform === 'all' 
    ? Object.values(filteredData.reduce((acc, item) => {
        if (!acc[item.sku]) {
          acc[item.sku] = {
            sku: item.sku,
            aashirvaaPrice: 0,
            competitorAvg: 0,
            priceIndex: 0,
            margin: 0,
            count: 0
          }
        }
        acc[item.sku].aashirvaaPrice += item.aashirvaaPrice
        acc[item.sku].competitorAvg += item.competitorAvg
        acc[item.sku].priceIndex += item.priceIndex
        acc[item.sku].margin += item.margin
        acc[item.sku].count++
        return acc
      }, {} as Record<string, any>)).map(item => ({
        ...item,
        aashirvaaPrice: Math.round(item.aashirvaaPrice / item.count),
        competitorAvg: Math.round(item.competitorAvg / item.count),
        priceIndex: Math.round(item.priceIndex / item.count * 100) / 100,
        margin: Math.round(item.margin / item.count * 100) / 100
      }))
    : filteredData

  // Sort by price index for better visualization
  const sortedData = [...aggregatedData].sort((a, b) => a.priceIndex - b.priceIndex)

  // Color function based on competitiveness
  const getBarColor = (priceIndex: number) => {
    if (priceIndex < 95) return 'hsl(var(--chart-1))' // Green - very competitive
    if (priceIndex < 100) return 'hsl(var(--chart-2))' // Orange - slightly higher
    if (priceIndex < 105) return 'hsl(var(--chart-3))' // Red - premium pricing
    return 'hsl(var(--chart-4))' // Dark red - very expensive
  }

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover text-popover-foreground p-3 border rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-sm mb-2">{label}</p>
          <p className="text-sm text-primary">
            Aashirvaad: ₹{data.aashirvaaPrice}
          </p>
          <p className="text-sm text-muted-foreground">
            Competitor Avg: ₹{data.competitorAvg}
          </p>
          <p className="text-sm text-chart-1">
            Price Index: {data.priceIndex.toFixed(1)}
          </p>
          <p className="text-sm text-chart-2">
            Margin: {data.margin > 0 ? '+' : ''}{data.margin.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for scatter chart
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover text-popover-foreground p-3 border rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-sm mb-2">{data.sku}</p>
          <p className="text-sm text-primary">
            Aashirvaad: ₹{data.aashirvaaPrice}
          </p>
          <p className="text-sm text-muted-foreground">
            Competitor: ₹{data.competitorAvg}
          </p>
          <p className="text-sm text-chart-1">
            Difference: {data.margin > 0 ? '+' : ''}₹{Math.round(data.aashirvaaPrice - data.competitorAvg)}
          </p>
        </div>
      )
    }
    return null
  }

  // Stats calculations
  const avgPriceIndex = aggregatedData.reduce((sum, item) => sum + item.priceIndex, 0) / aggregatedData.length
  const competitiveCount = aggregatedData.filter(item => item.priceIndex < 100).length
  const premiumCount = aggregatedData.filter(item => item.priceIndex >= 105).length
  const avgMargin = aggregatedData.reduce((sum, item) => sum + item.margin, 0) / aggregatedData.length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={chartType} onValueChange={(value: 'bar' | 'scatter') => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="scatter">Scatter Plot</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms (Average)</SelectItem>
                <SelectItem value="Blinkit">Blinkit</SelectItem>
                <SelectItem value="Swiggy Instamart">Swiggy Instamart</SelectItem>
                <SelectItem value="Zepto">Zepto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-chart-1/10 dark:bg-chart-1/20 p-3 rounded-lg">
              <div className="text-sm text-chart-1 font-medium">Competitive SKUs</div>
              <div className="text-lg font-bold">
                {competitiveCount}/{aggregatedData.length}
              </div>
              <div className="text-xs text-muted-foreground">Price Index &lt; 100</div>
            </div>
            <div className="bg-chart-2/10 dark:bg-chart-2/20 p-3 rounded-lg">
              <div className="text-sm text-chart-2 font-medium">Avg Price Index</div>
              <div className="text-lg font-bold">
                {avgPriceIndex.toFixed(1)}
              </div>
            </div>
            <div className="bg-chart-3/10 dark:bg-chart-3/20 p-3 rounded-lg">
              <div className="text-sm text-chart-3 font-medium">Avg Margin</div>
              <div className="text-lg font-bold">
                {avgMargin > 0 ? '+' : ''}{avgMargin.toFixed(1)}%
              </div>
            </div>
            <div className="bg-chart-4/10 dark:bg-chart-4/20 p-3 rounded-lg">
              <div className="text-sm text-chart-4 font-medium">Premium SKUs</div>
              <div className="text-lg font-bold">
                {premiumCount}/{aggregatedData.length}
              </div>
              <div className="text-xs text-muted-foreground">Price Index ≥ 105</div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis 
                    dataKey="sku" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}`}
                    label={{ value: 'Price Index', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="priceIndex" name="Price Index">
                    {sortedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.priceIndex)} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <ScatterChart data={aggregatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                  <XAxis 
                    type="number" 
                    dataKey="competitorAvg" 
                    name="Competitor Avg Price"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                    label={{ value: 'Competitor Average Price (₹)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="aashirvaaPrice" 
                    name="Aashirvaad Price"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                    label={{ value: 'Aashirvaad Price (₹)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomScatterTooltip />} />
                  <Scatter name="SKUs" fill="#8B5CF6">
                    {aggregatedData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.priceIndex < 100 ? '#10B981' : entry.priceIndex > 105 ? '#EF4444' : '#F59E0B'} 
                      />
                    ))}
                  </Scatter>
                  {/* Diagonal reference line for price parity */}
                  <line 
                    x1="5%" 
                    y1="5%" 
                    x2="95%" 
                    y2="95%" 
                    stroke="#6B7280" 
                    strokeDasharray="5 5"
                    style={{ opacity: 0.5 }}
                  />
                </ScatterChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Legend for chart colors */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Very Competitive (&lt;95)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span>Slightly Higher (95-105)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span>Premium (&gt;105)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}