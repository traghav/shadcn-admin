import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { visualizationData } from '@/data/mock-kpi-data'
import { useState } from 'react'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'

interface MarketShareChartProps {
  title?: string
  description?: string
  height?: number
}

export function MarketShareChart({ 
  title = "Market Share Analysis",
  description = "Share of voice and competitive positioning across platforms",
  height = 400
}: MarketShareChartProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('overall')
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'radar'>('pie')

  const shareOfVoiceData = visualizationData.shareOfVoice

  // Get current data based on platform selection
  const currentData = selectedPlatform === 'overall' 
    ? shareOfVoiceData.overall 
    : shareOfVoiceData.byPlatform[selectedPlatform as keyof typeof shareOfVoiceData.byPlatform] || shareOfVoiceData.overall

  // Prepare data for different chart types
  const barData = currentData.map(item => ({
    name: item.name,
    shareOfVoice: item.value,
    fill: item.fill
  }))

  // Radar chart data (comparison across platforms for Premium Brand)
  const radarData = [
    {
      platform: 'Overall',
      premiumBrand: shareOfVoiceData.overall.find(item => item.name === 'Premium Brand')?.value || 0,
      fortune: shareOfVoiceData.overall.find(item => item.name === 'Fortune')?.value || 0,
      tataSampann: shareOfVoiceData.overall.find(item => item.name === 'Tata Sampann')?.value || 0,
      patanjali: shareOfVoiceData.overall.find(item => item.name === 'Patanjali')?.value || 0
    },
    {
      platform: 'Blinkit',
      premiumBrand: shareOfVoiceData.byPlatform.Blinkit.find(item => item.name === 'Premium Brand')?.value || 0,
      fortune: shareOfVoiceData.byPlatform.Blinkit.find(item => item.name === 'Fortune')?.value || 0,
      tataSampann: shareOfVoiceData.byPlatform.Blinkit.find(item => item.name === 'Tata Sampann')?.value || 0,
      patanjali: shareOfVoiceData.byPlatform.Blinkit.find(item => item.name === 'Patanjali')?.value || 0
    },
    {
      platform: 'Swiggy',
      premiumBrand: shareOfVoiceData.byPlatform['Swiggy Instamart'].find(item => item.name === 'Premium Brand')?.value || 0,
      fortune: shareOfVoiceData.byPlatform['Swiggy Instamart'].find(item => item.name === 'Fortune')?.value || 0,
      tataSampann: shareOfVoiceData.byPlatform['Swiggy Instamart'].find(item => item.name === 'Tata Sampann')?.value || 0,
      patanjali: shareOfVoiceData.byPlatform['Swiggy Instamart'].find(item => item.name === 'Patanjali')?.value || 0
    },
    {
      platform: 'Zepto',
      premiumBrand: shareOfVoiceData.byPlatform.Zepto.find(item => item.name === 'Premium Brand')?.value || 0,
      fortune: shareOfVoiceData.byPlatform.Zepto.find(item => item.name === 'Fortune')?.value || 0,
      tataSampann: shareOfVoiceData.byPlatform.Zepto.find(item => item.name === 'Tata Sampann')?.value || 0,
      patanjali: shareOfVoiceData.byPlatform.Zepto.find(item => item.name === 'Patanjali')?.value || 0
    }
  ]

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Don't show labels for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-sm mb-1">{label || payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(1)}%`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Calculate insights
  const premiumBrandShare = currentData.find(item => item.name === 'Premium Brand')?.value || 0
  const leadingCompetitor = currentData
    .filter(item => item.name !== 'Premium Brand' && item.name !== 'Others')
    .sort((a, b) => b.value - a.value)[0]
  
  const marketPosition = currentData
    .filter(item => item.name !== 'Others')
    .sort((a, b) => b.value - a.value)
    .findIndex(item => item.name === 'Premium Brand') + 1

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={chartType} onValueChange={(value: 'pie' | 'bar' | 'radar') => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="radar">Radar Chart</SelectItem>
              </SelectContent>
            </Select>
            {chartType !== 'radar' && (
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall Market</SelectItem>
                  <SelectItem value="Blinkit">Blinkit</SelectItem>
                  <SelectItem value="Swiggy Instamart">Swiggy Instamart</SelectItem>
                  <SelectItem value="Zepto">Zepto</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Market insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Premium Brand Share</div>
              <div className="text-lg font-bold text-purple-800">
                {premiumBrandShare.toFixed(1)}%
              </div>
              <div className="text-xs text-purple-600">
                {selectedPlatform === 'overall' ? 'Overall Market' : selectedPlatform}
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Market Position</div>
              <div className="text-lg font-bold text-blue-800">
                #{marketPosition}
              </div>
              <div className="text-xs text-blue-600">Among major brands</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Leading Competitor</div>
              <div className="text-lg font-bold text-orange-800">
                {leadingCompetitor?.name || 'N/A'}
              </div>
              <div className="text-xs text-orange-600">
                {leadingCompetitor?.value.toFixed(1)}% share
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Gap to Leader</div>
              <div className="text-lg font-bold text-green-800">
                {leadingCompetitor ? (leadingCompetitor.value - premiumBrandShare > 0 ? '+' : '') : ''}
                {leadingCompetitor ? (leadingCompetitor.value - premiumBrandShare).toFixed(1) : '0'}%
              </div>
              <div className="text-xs text-green-600">
                {leadingCompetitor && leadingCompetitor.value < premiumBrandShare ? 'Leading market' : 'Behind leader'}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={currentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {currentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share of Voice']} />
                  <Legend />
                </PieChart>
              ) : chartType === 'bar' ? (
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                    label={{ value: 'Share of Voice (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="shareOfVoice" name="Share of Voice">
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="platform" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis 
                    angle={45} 
                    domain={[0, 30]} 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Radar name="Premium Brand" dataKey="premiumBrand" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={3} />
                  <Radar name="Fortune" dataKey="fortune" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="Tata Sampann" dataKey="tataSampann" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="Patanjali" dataKey="patanjali" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} strokeWidth={2} />
                  <Legend />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Platform comparison table (for pie and bar charts) */}
          {chartType !== 'radar' && (
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-3">Platform Comparison</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-2 font-medium">Platform</th>
                      <th className="text-center p-2 font-medium">Premium Brand</th>
                      <th className="text-center p-2 font-medium">Fortune</th>
                      <th className="text-center p-2 font-medium">Tata Sampann</th>
                      <th className="text-center p-2 font-medium">Patanjali</th>
                      <th className="text-center p-2 font-medium">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(shareOfVoiceData.byPlatform).map(([platform, data]) => {
                      const premiumBrandValue = data.find(item => item.name === 'Premium Brand')?.value || 0
                      const fortuneValue = data.find(item => item.name === 'Fortune')?.value || 0
                      const tataValue = data.find(item => item.name === 'Tata Sampann')?.value || 0
                      const patanjaliValue = data.find(item => item.name === 'Patanjali')?.value || 0
                      
                      const position = data
                        .filter(item => item.name !== 'Others')
                        .sort((a, b) => b.value - a.value)
                        .findIndex(item => item.name === 'Premium Brand') + 1

                      return (
                        <tr key={platform} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{platform}</td>
                          <td className="p-2 text-center font-bold text-purple-600">{premiumBrandValue.toFixed(1)}%</td>
                          <td className="p-2 text-center">{fortuneValue.toFixed(1)}%</td>
                          <td className="p-2 text-center">{tataValue.toFixed(1)}%</td>
                          <td className="p-2 text-center">{patanjaliValue.toFixed(1)}%</td>
                          <td className="p-2 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              position === 1 ? 'bg-green-100 text-green-800' :
                              position === 2 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              #{position}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}