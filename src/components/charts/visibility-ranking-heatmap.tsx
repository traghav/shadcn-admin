import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { visualizationData, type VisibilityKeywordData } from '@/data/mock-kpi-data'
import { useState } from 'react'

interface VisibilityRankingHeatmapProps {
  data?: VisibilityKeywordData[]
  title?: string
  description?: string
}

export function VisibilityRankingHeatmap({ 
  data = visualizationData.visibilityKeywords,
  title = "Search Ranking Heatmap",
  description = "Brand keyword rankings across platforms"
}: VisibilityRankingHeatmapProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'ranking' | 'volume' | 'sov'>('ranking')

  // Filter data by platform if selected
  const filteredData = selectedPlatform === 'all' 
    ? data 
    : data.filter(item => item.platform === selectedPlatform)

  // Aggregate data by keyword (average across platforms if showing all)
  const aggregatedData = selectedPlatform === 'all' 
    ? Object.values(filteredData.reduce((acc, item) => {
        if (!acc[item.keyword]) {
          acc[item.keyword] = {
            keyword: item.keyword,
            ranking: 0,
            searchVolume: 0,
            shareOfVoice: 0,
            count: 0,
            skus: new Set()
          }
        }
        acc[item.keyword].ranking += item.ranking
        acc[item.keyword].searchVolume += item.searchVolume
        acc[item.keyword].shareOfVoice += item.shareOfVoice
        acc[item.keyword].skus.add(item.sku)
        acc[item.keyword].count++
        return acc
      }, {} as Record<string, any>)).map(item => ({
        keyword: item.keyword,
        ranking: Math.round(item.ranking / item.count * 10) / 10,
        searchVolume: Math.round(item.searchVolume / item.count),
        shareOfVoice: Math.round(item.shareOfVoice / item.count * 10) / 10,
        skuCount: item.skus.size
      }))
    : filteredData.map(item => ({
        keyword: item.keyword,
        ranking: item.ranking,
        searchVolume: item.searchVolume,
        shareOfVoice: item.shareOfVoice,
        skuCount: 1,
        sku: item.sku
      }))

  // Sort data
  const sortedData = [...aggregatedData].sort((a, b) => {
    switch (sortBy) {
      case 'ranking':
        return a.ranking - b.ranking
      case 'volume':
        return b.searchVolume - a.searchVolume
      case 'sov':
        return b.shareOfVoice - a.shareOfVoice
      default:
        return 0
    }
  })

  // Color functions for different metrics
  const getRankingColor = (ranking: number) => {
    if (ranking <= 1) return 'bg-green-500 text-white'
    if (ranking <= 3) return 'bg-green-400 text-white'
    if (ranking <= 5) return 'bg-yellow-400 text-gray-800'
    if (ranking <= 8) return 'bg-orange-400 text-white'
    return 'bg-red-400 text-white'
  }

  const getVolumeColor = (volume: number) => {
    if (volume >= 80000) return 'bg-purple-500 text-white'
    if (volume >= 50000) return 'bg-purple-400 text-white'
    if (volume >= 30000) return 'bg-purple-300 text-gray-800'
    if (volume >= 15000) return 'bg-purple-200 text-gray-800'
    return 'bg-purple-100 text-gray-600'
  }

  const getSovColor = (sov: number) => {
    if (sov >= 30) return 'bg-blue-500 text-white'
    if (sov >= 25) return 'bg-blue-400 text-white'
    if (sov >= 20) return 'bg-blue-300 text-gray-800'
    if (sov >= 15) return 'bg-blue-200 text-gray-800'
    return 'bg-blue-100 text-gray-600'
  }

  // Get platforms for multi-platform view
  const platforms = ['Blinkit', 'Swiggy Instamart', 'Zepto']

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: 'ranking' | 'volume' | 'sov') => setSortBy(value)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ranking">By Ranking</SelectItem>
                <SelectItem value="volume">By Volume</SelectItem>
                <SelectItem value="sov">By Share of Voice</SelectItem>
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
          {/* Summary metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Top 3 Rankings</div>
              <div className="text-lg font-bold text-green-800">
                {sortedData.filter(item => item.ranking <= 3).length}
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Total Volume</div>
              <div className="text-lg font-bold text-purple-800">
                {(sortedData.reduce((sum, item) => sum + item.searchVolume, 0) / 1000).toFixed(0)}k
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Avg Share of Voice</div>
              <div className="text-lg font-bold text-blue-800">
                {(sortedData.reduce((sum, item) => sum + item.shareOfVoice, 0) / sortedData.length).toFixed(1)}%
              </div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Keywords Tracked</div>
              <div className="text-lg font-bold text-orange-800">
                {sortedData.length}
              </div>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-4">
              <span className="font-medium">Ranking:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span>2-3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span>4-5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span>6-8</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span>9+</span>
              </div>
            </div>
          </div>

          {selectedPlatform === 'all' ? (
            /* Multi-platform view */
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Header */}
                <div className="grid grid-cols-[200px_repeat(3,120px)_120px_120px_120px] gap-1 mb-2">
                  <div className="font-medium text-sm p-2">Keyword</div>
                  {platforms.map(platform => (
                    <div key={platform} className="font-medium text-sm p-2 text-center">
                      {platform.replace(' Instamart', '')}
                    </div>
                  ))}
                  <div className="font-medium text-sm p-2 text-center">Avg Rank</div>
                  <div className="font-medium text-sm p-2 text-center">Volume</div>
                  <div className="font-medium text-sm p-2 text-center">Share of Voice</div>
                </div>
                
                {/* Data rows */}
                {sortedData.slice(0, 12).map((row) => {
                  const platformData = platforms.map(platform => {
                    const platformItem = data.find(item => 
                      item.keyword === row.keyword && item.platform === platform
                    )
                    return platformItem ? platformItem.ranking : null
                  })
                  
                  return (
                    <div key={row.keyword} className="grid grid-cols-[200px_repeat(3,120px)_120px_120px_120px] gap-1 mb-1">
                      <div className="font-medium text-sm p-2 bg-gray-50 rounded truncate" title={row.keyword}>
                        {row.keyword}
                      </div>
                      {platformData.map((ranking, index) => (
                        <div 
                          key={platforms[index]}
                          className={`
                            p-2 rounded text-center text-xs font-medium
                            ${ranking ? getRankingColor(ranking) : 'bg-gray-200 text-gray-500'}
                            transition-all duration-200 hover:scale-105 hover:shadow-md
                            cursor-pointer
                          `}
                          title={`${row.keyword} on ${platforms[index]}: ${ranking ? `Rank ${ranking}` : 'Not tracked'}`}
                        >
                          {ranking ? `#${ranking}` : 'N/A'}
                        </div>
                      ))}
                      <div className={`p-2 rounded text-center text-xs font-medium ${getRankingColor(row.ranking)}`}>
                        #{row.ranking}
                      </div>
                      <div className={`p-2 rounded text-center text-xs font-medium ${getVolumeColor(row.searchVolume)}`}>
                        {(row.searchVolume / 1000).toFixed(0)}k
                      </div>
                      <div className={`p-2 rounded text-center text-xs font-medium ${getSovColor(row.shareOfVoice)}`}>
                        {row.shareOfVoice.toFixed(1)}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Single platform view */
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Header */}
                <div className="grid grid-cols-[200px_120px_120px_120px_120px_120px] gap-1 mb-2">
                  <div className="font-medium text-sm p-2">Keyword</div>
                  <div className="font-medium text-sm p-2 text-center">SKU</div>
                  <div className="font-medium text-sm p-2 text-center">Ranking</div>
                  <div className="font-medium text-sm p-2 text-center">Volume</div>
                  <div className="font-medium text-sm p-2 text-center">Share of Voice</div>
                  <div className="font-medium text-sm p-2 text-center">Performance</div>
                </div>
                
                {/* Data rows */}
                {sortedData.slice(0, 15).map((row, index) => (
                  <div key={`${row.keyword}-${index}`} className="grid grid-cols-[200px_120px_120px_120px_120px_120px] gap-1 mb-1">
                    <div className="font-medium text-sm p-2 bg-gray-50 rounded truncate" title={row.keyword}>
                      {row.keyword}
                    </div>
                    <div className="text-xs p-2 bg-gray-50 rounded truncate text-center" title={row.sku || 'Multiple SKUs'}>
                      {row.sku ? row.sku.split(' ').slice(0, 2).join(' ') : `${row.skuCount} SKUs`}
                    </div>
                    <div className={`p-2 rounded text-center text-xs font-medium ${getRankingColor(row.ranking)}`}>
                      #{row.ranking}
                    </div>
                    <div className={`p-2 rounded text-center text-xs font-medium ${getVolumeColor(row.searchVolume)}`}>
                      {(row.searchVolume / 1000).toFixed(0)}k
                    </div>
                    <div className={`p-2 rounded text-center text-xs font-medium ${getSovColor(row.shareOfVoice)}`}>
                      {row.shareOfVoice.toFixed(1)}%
                    </div>
                    <div className={`
                      p-2 rounded text-center text-xs font-medium
                      ${row.ranking <= 3 && row.shareOfVoice >= 20 ? 'bg-green-500 text-white' :
                        row.ranking <= 5 ? 'bg-yellow-400 text-gray-800' : 'bg-red-400 text-white'}
                    `}>
                      {row.ranking <= 3 && row.shareOfVoice >= 20 ? 'Excellent' :
                       row.ranking <= 5 ? 'Good' : 'Needs Work'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}