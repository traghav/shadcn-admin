import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { visualizationData, type TrendData } from '@/data/mock-kpi-data'
import { useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

interface PricingTrendChartProps {
  data?: TrendData[]
  title?: string
  description?: string
  height?: number
}

export function PricingTrendChart({ 
  data = visualizationData.pricingTrends,
  title = "Price Index Trends",
  description = "Comparative price index trends across competitors",
  height = 400
}: PricingTrendChartProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['premiumBrand', 'fortune', 'tataSampann'])
  const [timeRange, setTimeRange] = useState<string>('30')

  // Filter data based on time range
  const filteredData = data.slice(-parseInt(timeRange))

  // Brand configuration with colors
  const brandConfig = {
    premiumBrand: { 
      name: 'Premium Brand', 
      color: '#8B5CF6', 
      strokeWidth: 3 
    },
    fortune: { 
      name: 'Fortune', 
      color: '#06B6D4', 
      strokeWidth: 2 
    },
    tataSampann: { 
      name: 'Tata Sampann', 
      color: '#10B981', 
      strokeWidth: 2 
    },
    patanjali: { 
      name: 'Patanjali', 
      color: '#F59E0B', 
      strokeWidth: 2 
    }
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-sm mb-2">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(1)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Calculate average and market position
  const latestData = filteredData[filteredData.length - 1]
  const marketAverage = latestData ? 
    (latestData.premiumBrand + latestData.fortune + latestData.tataSampann + latestData.patanjali) / 4 : 100

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Brand selector buttons */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(brandConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  if (selectedBrands.includes(key)) {
                    setSelectedBrands(selectedBrands.filter(b => b !== key))
                  } else {
                    setSelectedBrands([...selectedBrands, key])
                  }
                }}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium transition-all
                  ${selectedBrands.includes(key) 
                    ? 'text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                style={{ 
                  backgroundColor: selectedBrands.includes(key) ? config.color : undefined 
                }}
              >
                {config.name}
              </button>
            ))}
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Premium Brand Position</div>
              <div className="text-lg font-bold text-purple-800">
                {latestData ? (latestData.premiumBrand > marketAverage ? 'Above' : 'Below') : '-'} Market
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Market Average</div>
              <div className="text-lg font-bold text-blue-800">
                {marketAverage.toFixed(1)}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Price Volatility</div>
              <div className="text-lg font-bold text-green-800">
                {latestData ? Math.abs(latestData.premiumBrand - filteredData[0].premiumBrand).toFixed(1) : '0'}%
              </div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">vs. Lowest</div>
              <div className="text-lg font-bold text-orange-800">
                {latestData ? 
                  (latestData.premiumBrand - Math.min(latestData.fortune, latestData.tataSampann, latestData.patanjali)).toFixed(1) 
                  : '0'}%
              </div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tickFormatter={(value) => `${value.toFixed(0)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Reference line for market average */}
                <ReferenceLine 
                  y={marketAverage} 
                  stroke="#6B7280" 
                  strokeDasharray="5 5" 
                  label={{ value: "Market Avg", position: "topRight" }}
                />
                
                {/* Lines for selected brands */}
                {selectedBrands.includes('premiumBrand') && (
                  <Line
                    type="monotone"
                    dataKey="premiumBrand"
                    name={brandConfig.premiumBrand.name}
                    stroke={brandConfig.premiumBrand.color}
                    strokeWidth={brandConfig.premiumBrand.strokeWidth}
                    dot={{ fill: brandConfig.premiumBrand.color, r: 4 }}
                    activeDot={{ r: 6, fill: brandConfig.premiumBrand.color }}
                  />
                )}
                {selectedBrands.includes('fortune') && (
                  <Line
                    type="monotone"
                    dataKey="fortune"
                    name={brandConfig.fortune.name}
                    stroke={brandConfig.fortune.color}
                    strokeWidth={brandConfig.fortune.strokeWidth}
                    dot={{ fill: brandConfig.fortune.color, r: 3 }}
                    activeDot={{ r: 5, fill: brandConfig.fortune.color }}
                  />
                )}
                {selectedBrands.includes('tataSampann') && (
                  <Line
                    type="monotone"
                    dataKey="tataSampann"
                    name={brandConfig.tataSampann.name}
                    stroke={brandConfig.tataSampann.color}
                    strokeWidth={brandConfig.tataSampann.strokeWidth}
                    dot={{ fill: brandConfig.tataSampann.color, r: 3 }}
                    activeDot={{ r: 5, fill: brandConfig.tataSampann.color }}
                  />
                )}
                {selectedBrands.includes('patanjali') && (
                  <Line
                    type="monotone"
                    dataKey="patanjali"
                    name={brandConfig.patanjali.name}
                    stroke={brandConfig.patanjali.color}
                    strokeWidth={brandConfig.patanjali.strokeWidth}
                    dot={{ fill: brandConfig.patanjali.color, r: 3 }}
                    activeDot={{ r: 5, fill: brandConfig.patanjali.color }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}