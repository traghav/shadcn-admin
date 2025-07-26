import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { visualizationData, type VisibilityKeywordData } from '@/data/mock-kpi-data'
import { useState, useMemo } from 'react'
import { useFilterStore, useFilteredData } from '@/stores/filterStore'
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts'

interface KeywordPerformanceChartProps {
  data?: VisibilityKeywordData[]
  title?: string
  description?: string
  height?: number
}

export function KeywordPerformanceChart({ 
  data = visualizationData.visibilityKeywords,
  title = "Keyword Performance Analysis",
  description = "Search volume vs ranking performance for brand keywords",
  height = 400
}: KeywordPerformanceChartProps) {
  const [localPlatformFilter, setLocalPlatformFilter] = useState<string>('all')
  const [chartType, setChartType] = useState<'scatter' | 'bar' | 'pie'>('scatter')
  
  // Get global filter state
  const {
    selectedPlatforms,
    selectedCategories,
    selectedSkus,
    selectedKeywords,
  } = useFilterStore()
  
  const { 
    isPlatformSelected,
    getFilteredSkus,
  } = useFilteredData()

  // Filter data based on global and local filters
  const filteredData = useMemo(() => {
    let filtered = data
    
    // Apply global platform filters
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter(item => 
        isPlatformSelected(item.platform.toLowerCase().replace(' ', '-'))
      )
    }
    
    // Apply local platform filter (on top of global filters)
    if (localPlatformFilter !== 'all') {
      filtered = filtered.filter(item => item.platform === localPlatformFilter)
    }
    
    // Apply global keyword filters
    if (selectedKeywords.length > 0) {
      filtered = filtered.filter(item => 
        selectedKeywords.some(keyword => 
          item.keyword.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(item.keyword.toLowerCase())
        )
      )
    }
    
    // Apply category/SKU filters by filtering keywords related to those products
    if (selectedCategories.length > 0 || selectedSkus.length > 0) {
      const allowedSkus = getFilteredSkus()
      const allowedKeywords = new Set<string>()
      
      allowedSkus.forEach(sku => {
        // Generate related keywords for each SKU
        const skuWords = sku.name.toLowerCase().split(' ')
        skuWords.forEach(word => {
          if (word.length > 2) allowedKeywords.add(word)
        })
        
        // Add category-related keywords
        if (sku.category === 'Atta') {
          allowedKeywords.add('atta')
          allowedKeywords.add('wheat')
          allowedKeywords.add('flour')
        } else if (sku.category === 'Ready-to-Eat') {
          allowedKeywords.add('instant')
          allowedKeywords.add('poha')
          allowedKeywords.add('upma')
          allowedKeywords.add('khichdi')
        } else if (sku.category === 'Spices') {
          allowedKeywords.add('turmeric')
          allowedKeywords.add('chilli')
          allowedKeywords.add('coriander')
          allowedKeywords.add('powder')
          allowedKeywords.add('spice')
        } else if (sku.category === 'Salt & Sugar') {
          allowedKeywords.add('salt')
          allowedKeywords.add('sugar')
          allowedKeywords.add('iodized')
        }
      })
      
      if (allowedKeywords.size > 0) {
        filtered = filtered.filter(item => 
          Array.from(allowedKeywords).some(keyword => 
            item.keyword.toLowerCase().includes(keyword) ||
            keyword.includes(item.keyword.toLowerCase())
          )
        )
      }
    }
    
    return filtered
  }, [data, selectedPlatforms, selectedKeywords, selectedCategories, selectedSkus, 
      localPlatformFilter, isPlatformSelected, getFilteredSkus])

  // Aggregate filtered data by keyword for better visualization
  const aggregatedData = Object.values(filteredData.reduce((acc, item) => {
    if (!acc[item.keyword]) {
      acc[item.keyword] = {
        keyword: item.keyword,
        ranking: 0,
        searchVolume: 0,
        shareOfVoice: 0,
        count: 0
      }
    }
    acc[item.keyword].ranking += item.ranking
    acc[item.keyword].searchVolume += item.searchVolume
    acc[item.keyword].shareOfVoice += item.shareOfVoice
    acc[item.keyword].count++
    return acc
  }, {} as Record<string, any>)).map(item => ({
    keyword: item.keyword,
    ranking: Math.round(item.ranking / item.count * 10) / 10,
    searchVolume: Math.round(item.searchVolume / item.count),
    shareOfVoice: Math.round(item.shareOfVoice / item.count * 10) / 10,
    // Performance score based on ranking and SOV
    performanceScore: Math.round(((11 - (item.ranking / item.count)) * 5 + (item.shareOfVoice / item.count)) * 10) / 10
  }))

  // Sort data for bar chart
  const sortedData = [...aggregatedData].sort((a, b) => b.performanceScore - a.performanceScore)

  // Prepare data for pie chart (top performing vs others)
  const topKeywords = sortedData.slice(0, 5)
  const otherKeywords = sortedData.slice(5)
  const pieData = [
    ...topKeywords.map(item => ({
      name: item.keyword,
      value: item.shareOfVoice,
      fill: getKeywordColor(item.keyword)
    })),
    {
      name: 'Others',
      value: otherKeywords.reduce((sum, item) => sum + item.shareOfVoice, 0),
      fill: '#6B7280'
    }
  ]

  // Color function for keywords
  function getKeywordColor(keyword: string) {
    const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5A2B', '#EC4899', '#14B8A6']
    const index = keyword.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  // Custom tooltip for scatter chart
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-sm mb-2">{data.keyword}</p>
          <p className="text-sm text-blue-600">Search Volume: {data.searchVolume.toLocaleString()}</p>
          <p className="text-sm text-green-600">Ranking: #{data.ranking}</p>
          <p className="text-sm text-purple-600">Share of Voice: {data.shareOfVoice.toFixed(1)}%</p>
          <p className="text-sm text-orange-600">Performance Score: {data.performanceScore}</p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-sm mb-2">{label}</p>
          <p className="text-sm text-purple-600">Performance Score: {data.performanceScore}</p>
          <p className="text-sm text-green-600">Ranking: #{data.ranking}</p>
          <p className="text-sm text-blue-600">Share of Voice: {data.shareOfVoice.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  // Performance categories
  const excellentKeywords = aggregatedData.filter(item => item.ranking <= 3 && item.shareOfVoice >= 25)
  const goodKeywords = aggregatedData.filter(item => item.ranking <= 5 && item.shareOfVoice >= 15)
  const needsImprovementKeywords = aggregatedData.filter(item => item.ranking > 5 || item.shareOfVoice < 15)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={chartType} onValueChange={(value: 'scatter' | 'bar' | 'pie') => setChartType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scatter">Scatter Plot</SelectItem>
                <SelectItem value="bar">Performance</SelectItem>
                <SelectItem value="pie">Share of Voice</SelectItem>
              </SelectContent>
            </Select>
            <Select value={localPlatformFilter} onValueChange={setLocalPlatformFilter}>
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
          {/* Performance summary */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Excellent Performance</div>
              <div className="text-lg font-bold text-green-800">
                {excellentKeywords.length}
              </div>
              <div className="text-xs text-green-600">Rank ≤3 & SOV ≥25%</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Good Performance</div>
              <div className="text-lg font-bold text-yellow-800">
                {goodKeywords.length}
              </div>
              <div className="text-xs text-yellow-600">Rank ≤5 & SOV ≥15%</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-sm text-red-600 font-medium">Needs Improvement</div>
              <div className="text-lg font-bold text-red-800">
                {needsImprovementKeywords.length}
              </div>
              <div className="text-xs text-red-600">Rank &gt;5 or SOV &lt;15%</div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'scatter' ? (
                <ScatterChart data={aggregatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    type="number" 
                    dataKey="searchVolume" 
                    name="Search Volume"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    label={{ value: 'Search Volume', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="ranking" 
                    name="Ranking"
                    tick={{ fontSize: 12 }}
                    domain={[0, 10]}
                    reversed={true}
                    tickFormatter={(value) => `#${value}`}
                    label={{ value: 'Ranking (lower is better)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomScatterTooltip />} />
                  <Scatter name="Keywords" fill="#8B5CF6">
                    {aggregatedData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.ranking <= 3 && entry.shareOfVoice >= 25 ? '#10B981' : 
                              entry.ranking <= 5 && entry.shareOfVoice >= 15 ? '#F59E0B' : '#EF4444'} 
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              ) : chartType === 'bar' ? (
                <BarChart data={sortedData.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="keyword" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Performance Score', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="performanceScore" name="Performance Score">
                    {sortedData.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getKeywordColor(entry.keyword)} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Share of Voice']} />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Top performing keywords list */}
          <div className="mt-6">
            <h4 className="font-medium text-sm mb-3">Top Performing Keywords</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sortedData.slice(0, 6).map((keyword, index) => (
                <div key={keyword.keyword} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getKeywordColor(keyword.keyword) }}
                    ></div>
                    <span className="font-medium">{keyword.keyword}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>#{keyword.ranking}</span>
                    <span>{keyword.shareOfVoice.toFixed(1)}%</span>
                    <span className="font-medium">{keyword.performanceScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}