import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { visualizationData, type HeatmapData } from '@/data/mock-kpi-data'
import { useState, useMemo, useCallback, memo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChartErrorBoundary } from '@/components/ui/error-boundary'
import { HeatmapSkeleton } from '@/components/ui/chart-skeleton'
import { useSimulatedAsync } from '@/hooks/use-async-data'

interface AvailabilityHeatmapProps {
  data?: HeatmapData[]
  title?: string
  description?: string
}

interface CellData {
  sku: string
  city: string
  availability: number
  outOfStockHours: number
  platform: string
}

// Memoized cell component for better performance
const HeatmapCell = memo(({ 
  availability, 
  outOfStockHours, 
  sku, 
  city, 
  platform,
  onHover,
  onLeave
}: {
  availability: number
  outOfStockHours: number
  sku: string
  city: string
  platform: string
  onHover: (data: CellData) => void
  onLeave: () => void
}) => {
  const getColor = useCallback((value: number) => {
    if (value >= 98) return 'bg-emerald-600'
    if (value >= 95) return 'bg-green-500'
    if (value >= 92) return 'bg-green-400'
    if (value >= 90) return 'bg-lime-400'
    if (value >= 87) return 'bg-yellow-400'
    if (value >= 85) return 'bg-yellow-500'
    if (value >= 82) return 'bg-orange-400'
    if (value >= 80) return 'bg-orange-500'
    if (value >= 75) return 'bg-red-400'
    if (value > 0) return 'bg-red-500'
    return 'bg-gray-200'
  }, [])
  
  const getTextColor = useCallback((value: number) => {
    if (value >= 87) return 'text-white'
    if (value >= 82) return 'text-gray-800'
    return 'text-white'
  }, [])

  const getPerformanceBadge = useCallback((availability: number) => {
    if (availability >= 95) return { color: 'bg-green-100 text-green-800', label: 'Excellent' }
    if (availability >= 90) return { color: 'bg-yellow-100 text-yellow-800', label: 'Good' }
    if (availability >= 80) return { color: 'bg-orange-100 text-orange-800', label: 'Fair' }
    return { color: 'bg-red-100 text-red-800', label: 'Poor' }
  }, [])

  const handleMouseEnter = useCallback(() => {
    onHover({
      sku,
      city,
      availability,
      outOfStockHours,
      platform
    })
  }, [sku, city, availability, outOfStockHours, platform, onHover])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`
            p-2 rounded text-center text-xs font-medium
            ${getColor(availability)} ${getTextColor(availability)}
            transition-all duration-200 hover:scale-105 hover:shadow-lg hover:z-10
            cursor-pointer relative
            ${availability < 90 ? 'ring-2 ring-red-300 ring-opacity-50' : ''}
          `}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={onLeave}
        >
          {availability > 0 ? `${availability.toFixed(1)}%` : 'N/A'}
          {availability < 90 && availability > 0 && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div className="font-medium">{sku} in {city}</div>
          <div>Availability: {availability.toFixed(1)}%</div>
          <div>Out of Stock: {outOfStockHours.toFixed(0)} hours</div>
          <div className={`mt-1 text-xs px-2 py-1 rounded ${getPerformanceBadge(availability).color}`}>
            {getPerformanceBadge(availability).label}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
})

HeatmapCell.displayName = 'HeatmapCell'

// Enhanced heatmap component with better interactivity and performance
const AvailabilityHeatmapComponent = memo(({ 
  data = visualizationData.availabilityHeatmap,
  title = "Availability Heatmap",
  description = "SKU availability across cities and platforms"
}: AvailabilityHeatmapProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedSku, setSelectedSku] = useState<string>('all')
  const [hoveredCell, setHoveredCell] = useState<CellData | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'performance'>('name')
  
  // Memoized callbacks for better performance
  const handleHoverCell = useCallback((cellData: CellData) => {
    setHoveredCell(cellData)
  }, [])
  
  const handleLeaveCell = useCallback(() => {
    setHoveredCell(null)
  }, [])
  
  const handlePlatformChange = useCallback((value: string) => {
    setSelectedPlatform(value)
  }, [])
  
  const handleSkuChange = useCallback((value: string) => {
    setSelectedSku(value)
  }, [])
  
  const handleSortChange = useCallback((value: 'name' | 'performance') => {
    setSortBy(value)
  }, [])
  
  const handleResetFilters = useCallback(() => {
    setSelectedPlatform('all')
    setSelectedSku('all')
    setSortBy('name')
  }, [])
  
  const handleShowWorstPerforming = useCallback(() => {
    setSortBy('performance')
  }, [])
  
  const handleFocusProblemSku = useCallback(() => {
    // This will be calculated in the useMemo
  }, [])
  
  // Memoized calculations for better performance
  const { filteredData, cities, gridData, skuList, cityStats, skuStats } = useMemo(() => {
    // Filter data by platform and SKU
    let filtered = selectedPlatform === 'all' 
      ? data 
      : data.filter(item => item.platform === selectedPlatform)
    
    if (selectedSku !== 'all') {
      filtered = filtered.filter(item => item.sku === selectedSku)
    }
    
    // Get unique SKUs and cities for grid layout
    const uniqueSkus = [...new Set(filtered.map(item => item.sku))]
    const uniqueCities = [...new Set(filtered.map(item => item.city))]
    
    // Create grid data structure with enhanced information
    const grid = uniqueSkus.map(sku => {
      const skuData: Record<string, any> = { sku }
      let totalAvailability = 0
      let cityCount = 0
      
      uniqueCities.forEach(city => {
        const cellData = filtered.find(item => item.sku === sku && item.city === city)
        if (selectedPlatform === 'all' && cellData) {
          // Average across all platforms for this SKU-City combination
          const allPlatformData = data.filter(item => item.sku === sku && item.city === city)
          const avgAvailability = allPlatformData.reduce((sum, item) => sum + item.availability, 0) / allPlatformData.length
          const avgOutOfStock = allPlatformData.reduce((sum, item) => sum + item.outOfStockHours, 0) / allPlatformData.length
          
          skuData[city] = {
            availability: avgAvailability,
            outOfStockHours: avgOutOfStock,
            platformCount: allPlatformData.length
          }
          totalAvailability += avgAvailability
          cityCount++
        } else if (cellData) {
          skuData[city] = {
            availability: cellData.availability,
            outOfStockHours: cellData.outOfStockHours,
            platformCount: 1
          }
          totalAvailability += cellData.availability
          cityCount++
        } else {
          skuData[city] = {
            availability: 0,
            outOfStockHours: 0,
            platformCount: 0
          }
        }
      })
      
      skuData.avgAvailability = cityCount > 0 ? totalAvailability / cityCount : 0
      return skuData
    })

    // Sort SKUs based on selection
    const sortedGrid = sortBy === 'performance' 
      ? grid.sort((a, b) => (b.avgAvailability || 0) - (a.avgAvailability || 0))
      : grid.sort((a, b) => (a.sku as string).localeCompare(b.sku as string))
    
    // Calculate city statistics
    const cityStatistics = uniqueCities.map(city => {
      const cityData = filtered.filter(item => item.city === city)
      const avgAvailability = cityData.length > 0 
        ? cityData.reduce((sum, item) => sum + item.availability, 0) / cityData.length 
        : 0
      const outOfStockSkus = cityData.filter(item => item.availability < 90).length
      
      return {
        city,
        avgAvailability,
        outOfStockSkus,
        totalSkus: cityData.length
      }
    })
    
    // Calculate SKU statistics
    const skuStatistics = uniqueSkus.map(sku => {
      const skuData = filtered.filter(item => item.sku === sku)
      const avgAvailability = skuData.length > 0 
        ? skuData.reduce((sum, item) => sum + item.availability, 0) / skuData.length 
        : 0
      const problemCities = skuData.filter(item => item.availability < 90).length
      
      return {
        sku,
        avgAvailability,
        problemCities,
        totalCities: skuData.length
      }
    })
    
    return {
      filteredData: filtered,
      cities: uniqueCities,
      gridData: sortedGrid,
      skuList: uniqueSkus,
      cityStats: cityStatistics,
      skuStats: skuStatistics
    }
  }, [data, selectedPlatform, selectedSku, sortBy])

  // Get performance badge color (moved outside for reuse)
  const getPerformanceBadge = useCallback((availability: number) => {
    if (availability >= 95) return { color: 'bg-green-100 text-green-800', label: 'Excellent' }
    if (availability >= 90) return { color: 'bg-yellow-100 text-yellow-800', label: 'Good' }
    if (availability >= 80) return { color: 'bg-orange-100 text-orange-800', label: 'Fair' }
    return { color: 'bg-red-100 text-red-800', label: 'Poor' }
  }, [])
  
  // Update focus problem SKU logic
  const focusProblemSku = useCallback(() => {
    const problemSkus = skuStats
      .filter(sku => sku.problemCities > 0)
      .sort((a, b) => b.problemCities - a.problemCities)
    if (problemSkus.length > 0) {
      setSelectedSku(problemSkus[0].sku)
    }
  }, [skuStats])
  
  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="performance">Sort by Performance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSku} onValueChange={handleSkuChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select SKU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SKUs</SelectItem>
                  {skuList.map(sku => (
                    <SelectItem key={sku} value={sku}>{sku}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select platform" />
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
          <div className="space-y-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-600 font-medium">High Availability</div>
                <div className="text-lg font-bold text-green-800">
                  {Math.round((filteredData.filter(item => item.availability >= 95).length / filteredData.length) * 100)}%
                </div>
                <div className="text-xs text-green-600">SKU-City combinations ≥95%</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">Avg Availability</div>
                <div className="text-lg font-bold text-yellow-800">
                  {(filteredData.reduce((sum, item) => sum + item.availability, 0) / filteredData.length).toFixed(1)}%
                </div>
                <div className="text-xs text-yellow-600">Across all selections</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Problem Areas</div>
                <div className="text-lg font-bold text-orange-800">
                  {filteredData.filter(item => item.availability < 90).length}
                </div>
                <div className="text-xs text-orange-600">SKU-City combinations &lt;90%</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Out of Stock</div>
                <div className="text-lg font-bold text-red-800">
                  {filteredData.filter(item => item.availability === 0).length}
                </div>
                <div className="text-xs text-red-600">Complete stockouts</div>
              </div>
            </div>

            {/* Enhanced Legend */}
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <span className="font-medium">Availability Scale:</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-emerald-600 rounded"></div>
                  <span className="text-xs">98%+</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-xs">95-97%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-lime-400 rounded"></div>
                  <span className="text-xs">90-94%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span className="text-xs">85-89%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-400 rounded"></div>
                  <span className="text-xs">80-84%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span className="text-xs">&lt;80%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span className="text-xs">No Data</span>
                </div>
              </div>
              {hoveredCell && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="font-medium text-sm text-blue-800 mb-1">
                    {hoveredCell.sku} in {hoveredCell.city}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-blue-600">Availability:</span>
                      <div className="font-bold">{hoveredCell.availability.toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Out of Stock:</span>
                      <div className="font-bold">{hoveredCell.outOfStockHours.toFixed(0)}h</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Platform:</span>
                      <div className="font-bold">{hoveredCell.platform}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Header with city names and stats */}
                <div className={`grid grid-cols-[250px_repeat(${cities.length},120px)_120px] gap-1 mb-2`}>
                  <div className="font-medium text-sm p-2">SKU / Performance</div>
                  {cities.map(city => {
                    const cityInfo = cityStats.find(c => c.city === city)
                    return (
                      <Tooltip key={city}>
                        <TooltipTrigger asChild>
                          <div className="font-medium text-sm p-2 text-center cursor-help border rounded bg-gray-50">
                            <div>{city}</div>
                            {cityInfo && (
                              <div className="text-xs text-gray-500 mt-1">
                                {cityInfo.avgAvailability.toFixed(1)}%
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">{city} Statistics</div>
                            <div>Average: {cityInfo?.avgAvailability.toFixed(1)}%</div>
                            <div>Problem SKUs: {cityInfo?.outOfStockSkus}/{cityInfo?.totalSkus}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                  <div className="font-medium text-sm p-2 text-center">Avg</div>
                </div>
                
                {/* Data rows with enhanced interactivity */}
                {gridData.map((row, rowIndex) => {
                  const skuInfo = skuStats.find(s => s.sku === row.sku)
                  const performanceBadge = getPerformanceBadge(row.avgAvailability || 0)
                  
                  return (
                    <div key={row.sku} className={`grid grid-cols-[250px_repeat(${cities.length},120px)_120px] gap-1 mb-1`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="font-medium text-sm p-2 bg-gray-50 rounded cursor-help">
                            <div className="truncate" title={typeof row.sku === 'string' ? row.sku : ''}>
                              {typeof row.sku === 'string' ? row.sku : ''}
                            </div>
                            <Badge className={`text-xs mt-1 ${performanceBadge.color} border-0`}>
                              {performanceBadge.label}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">{row.sku} Performance</div>
                            <div>Average: {skuInfo?.avgAvailability.toFixed(1)}%</div>
                            <div>Problem Cities: {skuInfo?.problemCities}/{skuInfo?.totalCities}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      
                      {cities.map(city => {
                        const cellData = row[city]
                        const availability = cellData?.availability || 0
                        const outOfStockHours = cellData?.outOfStockHours || 0
                        
                        return (
                          <HeatmapCell
                            key={city}
                            availability={availability}
                            outOfStockHours={outOfStockHours}
                            sku={row.sku as string}
                            city={city}
                            platform={selectedPlatform === 'all' ? 'All Platforms' : selectedPlatform}
                            onHover={handleHoverCell}
                            onLeave={handleLeaveCell}
                          />
                        )
                      })}
                      
                      {/* Average column */}
                      <div className={`
                        p-2 rounded text-center text-xs font-medium border
                        ${getPerformanceBadge(row.avgAvailability || 0).color}
                      `}>
                        {(row.avgAvailability || 0).toFixed(1)}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowWorstPerforming}
              >
                Show Worst Performing
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={focusProblemSku}
              >
                Focus Problem SKU
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
})

AvailabilityHeatmapComponent.displayName = 'AvailabilityHeatmapComponent'

// Main export with loading states and error boundary
export function AvailabilityHeatmap(props: AvailabilityHeatmapProps) {
  // Simulate loading for demonstration (remove in production)
  const { data: loadedData, loading, error } = useSimulatedAsync(
    props.data || visualizationData.availabilityHeatmap,
    500, // 500ms delay
    false // no error simulation
  )

  if (loading) {
    return <HeatmapSkeleton rows={6} cols={5} />
  }

  if (error) {
    return (
      <Card className="h-80 flex items-center justify-center">
        <CardContent className="text-center">
          <div className="text-red-500 mb-2">Failed to load heatmap data</div>
          <Button onClick={() => window.location.reload()} size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <ChartErrorBoundary>
      <AvailabilityHeatmapComponent {...props} data={loadedData} />
    </ChartErrorBoundary>
  )
}