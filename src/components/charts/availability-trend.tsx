import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { generateTimeSeriesData } from '@/data/mock-kpi-data'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AvailabilityTrendProps {
  title?: string
  description?: string
  height?: number
}

// Generate trend data for different platforms
const generatePlatformTrends = (days: number = 30) => {
  const dates = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates.map(date => ({
    date,
    blinkit: 94 + Math.random() * 6, // 94-100%
    swiggyInstamart: 92 + Math.random() * 6, // 92-98%
    zepto: 90 + Math.random() * 6, // 90-96%
    overall: 92 + Math.random() * 6 // 92-98%
  }))
}

export function AvailabilityTrend({ 
  title = "Availability Trend Analysis",
  description = "Availability trends across platforms over time",
  height = 400
}: AvailabilityTrendProps) {
  const [dateRange, setDateRange] = useState<string>('30')
  const [selectedMetric, setSelectedMetric] = useState<string>('platforms')
  
  // Generate data based on selected date range
  const trendData = generatePlatformTrends(parseInt(dateRange))
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value.toFixed(1)}%`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platforms">By Platform</SelectItem>
                <SelectItem value="overall">Overall Trend</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              stroke="#666"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {selectedMetric === 'platforms' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="blinkit" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Blinkit"
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="swiggyInstamart" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  name="Swiggy Instamart"
                  dot={{ fill: '#06B6D4', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="zepto" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Zepto"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </>
            ) : (
              <Line 
                type="monotone" 
                dataKey="overall" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="Overall Availability"
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        
        {/* Summary statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-600">Blinkit Avg</div>
            <div className="text-lg font-semibold text-purple-600">
              {(trendData.reduce((sum, item) => sum + item.blinkit, 0) / trendData.length).toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-cyan-50 rounded-lg">
            <div className="text-sm text-gray-600">Swiggy Avg</div>
            <div className="text-lg font-semibold text-cyan-600">
              {(trendData.reduce((sum, item) => sum + item.swiggyInstamart, 0) / trendData.length).toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-emerald-50 rounded-lg">
            <div className="text-sm text-gray-600">Zepto Avg</div>
            <div className="text-lg font-semibold text-emerald-600">
              {(trendData.reduce((sum, item) => sum + item.zepto, 0) / trendData.length).toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Overall Avg</div>
            <div className="text-lg font-semibold text-gray-700">
              {(trendData.reduce((sum, item) => sum + item.overall, 0) / trendData.length).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}