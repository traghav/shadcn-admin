import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { visualizationData } from '@/data/mock-kpi-data'
import { useState, useMemo } from 'react'
import { useFilterStore, useFilteredData } from '@/stores/filterStore'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  ArrowUpDownIcon,
  SearchIcon,
  FilterIcon,
  Download,
  Loader2
} from 'lucide-react'
import { exportRawCSV } from '@/utils/csv-export'
import { toast } from 'sonner'

interface StorePerformanceTableProps {
  title?: string
  description?: string
}

type SortField = 'storeName' | 'city' | 'platform' | 'availability' | 'avgOrderValue' | 'monthlyOrders' | 'lastStockout'
type SortDirection = 'asc' | 'desc'

interface StoreData {
  id: string
  storeName: string
  city: string
  platform: string
  availability: number
  avgOrderValue: number
  monthlyOrders: number
  topSkus: string[]
  lastStockout: string
}

export function StorePerformanceTable({ 
  title = "Store Performance Analysis",
  description = "Detailed performance metrics for individual stores across platforms"
}: StorePerformanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [localSelectedCity, setLocalSelectedCity] = useState<string>('all')
  const [localSelectedPlatform, setLocalSelectedPlatform] = useState<string>('all')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('availability')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)

  // Get global filter state
  const {
    selectedPlatforms,
    selectedCategories,
    selectedSkus,
    selectedCities,
  } = useFilterStore()
  
  const { 
    isPlatformSelected,
    isCitySelected,
    getFilteredSkus,
  } = useFilteredData()

  const storeData: StoreData[] = visualizationData.storePerformance

  // Get unique values for filters
  const cities = [...new Set(storeData.map(store => store.city))].sort()
  const platforms = [...new Set(storeData.map(store => store.platform))].sort()

  // Filter and sort data
  const { filteredData, totalPages } = useMemo(() => {
    let filtered = storeData.filter(store => {
      const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.platform.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Apply global platform filters if any are selected
      const matchesGlobalPlatform = selectedPlatforms.length === 0 || 
        isPlatformSelected(store.platform.toLowerCase().replace(' ', '-'))
      
      // Apply global city filters if any are selected
      const matchesGlobalCity = selectedCities.length === 0 || 
        isCitySelected(store.city.toLowerCase().replace(' ', ''))
      
      // Apply local table filters (these work on top of global filters)
      const matchesLocalCity = localSelectedCity === 'all' || store.city === localSelectedCity
      const matchesLocalPlatform = localSelectedPlatform === 'all' || store.platform === localSelectedPlatform
      
      // Filter by SKUs if specific ones are selected globally
      let matchesSkus = true
      if (selectedCategories.length > 0 || selectedSkus.length > 0) {
        const allowedSkus = getFilteredSkus()
        const allowedSkuNames = allowedSkus.map(sku => sku.name)
        // Check if any of the store's top SKUs match the filtered SKUs
        matchesSkus = store.topSkus.some(sku => allowedSkuNames.includes(sku))
      }
      
      let matchesAvailability = true
      if (availabilityFilter === 'high') matchesAvailability = store.availability >= 95
      else if (availabilityFilter === 'medium') matchesAvailability = store.availability >= 85 && store.availability < 95
      else if (availabilityFilter === 'low') matchesAvailability = store.availability < 85

      return matchesSearch && matchesGlobalPlatform && matchesGlobalCity && 
             matchesLocalCity && matchesLocalPlatform && matchesSkus && matchesAvailability
    })

    // Sort data
    filtered.sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (sortField === 'lastStockout') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage)

    return { filteredData: paginatedData, totalPages, totalCount: filtered.length }
  }, [storeData, searchTerm, localSelectedCity, localSelectedPlatform, availabilityFilter, sortField, sortDirection, currentPage, itemsPerPage,
      selectedPlatforms, selectedCities, selectedCategories, selectedSkus, 
      isPlatformSelected, isCitySelected, getFilteredSkus])

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDownIcon className="w-4 h-4" />
    return sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
  }

  // Get availability badge
  const getAvailabilityBadge = (availability: number) => {
    if (availability >= 95) return { color: 'bg-green-100 text-green-800', label: 'Excellent' }
    if (availability >= 90) return { color: 'bg-lime-100 text-lime-800', label: 'Very Good' }
    if (availability >= 85) return { color: 'bg-yellow-100 text-yellow-800', label: 'Good' }
    if (availability >= 80) return { color: 'bg-orange-100 text-orange-800', label: 'Fair' }
    return { color: 'bg-red-100 text-red-800', label: 'Poor' }
  }

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const allFiltered = storeData.filter(store => {
      const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.platform.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesGlobalPlatform = selectedPlatforms.length === 0 || 
        isPlatformSelected(store.platform.toLowerCase().replace(' ', '-'))
      const matchesGlobalCity = selectedCities.length === 0 || 
        isCitySelected(store.city.toLowerCase().replace(' ', ''))
      const matchesLocalCity = localSelectedCity === 'all' || store.city === localSelectedCity
      const matchesLocalPlatform = localSelectedPlatform === 'all' || store.platform === localSelectedPlatform
      
      let matchesSkus = true
      if (selectedCategories.length > 0 || selectedSkus.length > 0) {
        const allowedSkus = getFilteredSkus()
        const allowedSkuNames = allowedSkus.map(sku => sku.name)
        matchesSkus = store.topSkus.some(sku => allowedSkuNames.includes(sku))
      }
      
      let matchesAvailability = true
      if (availabilityFilter === 'high') matchesAvailability = store.availability >= 95
      else if (availabilityFilter === 'medium') matchesAvailability = store.availability >= 85 && store.availability < 95
      else if (availabilityFilter === 'low') matchesAvailability = store.availability < 85
      
      return matchesSearch && matchesGlobalPlatform && matchesGlobalCity && 
             matchesLocalCity && matchesLocalPlatform && matchesSkus && matchesAvailability
    })

    const avgAvailability = allFiltered.reduce((sum, store) => sum + store.availability, 0) / allFiltered.length || 0
    const avgOrderValue = allFiltered.reduce((sum, store) => sum + store.avgOrderValue, 0) / allFiltered.length || 0
    const totalOrders = allFiltered.reduce((sum, store) => sum + store.monthlyOrders, 0)
    const excellentStores = allFiltered.filter(store => store.availability >= 95).length

    return {
      totalStores: allFiltered.length,
      avgAvailability,
      avgOrderValue,
      totalOrders,
      excellentStores
    }
  }, [storeData, searchTerm, localSelectedCity, localSelectedPlatform, availabilityFilter,
      selectedPlatforms, selectedCities, selectedCategories, selectedSkus, 
      isPlatformSelected, isCitySelected, getFilteredSkus])

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('')
    setLocalSelectedCity('all')
    setLocalSelectedPlatform('all')
    setAvailabilityFilter('all')
    setSortField('availability')
    setSortDirection('desc')
    setCurrentPage(1)
  }

  // Export all filtered data to CSV
  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Get all filtered data (not just current page)
      const allFiltered = storeData.filter(store => {
        const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             store.platform.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesGlobalPlatform = selectedPlatforms.length === 0 || 
          isPlatformSelected(store.platform.toLowerCase().replace(' ', '-'))
        const matchesGlobalCity = selectedCities.length === 0 || 
          isCitySelected(store.city.toLowerCase().replace(' ', ''))
        const matchesLocalCity = localSelectedCity === 'all' || store.city === localSelectedCity
        const matchesLocalPlatform = localSelectedPlatform === 'all' || store.platform === localSelectedPlatform
        
        let matchesSkus = true
        if (selectedCategories.length > 0 || selectedSkus.length > 0) {
          const allowedSkus = getFilteredSkus()
          const allowedSkuNames = allowedSkus.map(sku => sku.name)
          matchesSkus = store.topSkus.some(sku => allowedSkuNames.includes(sku))
        }
        
        let matchesAvailability = true
        if (availabilityFilter === 'high') matchesAvailability = store.availability >= 95
        else if (availabilityFilter === 'medium') matchesAvailability = store.availability >= 85 && store.availability < 95
        else if (availabilityFilter === 'low') matchesAvailability = store.availability < 85
        
        return matchesSearch && matchesGlobalPlatform && matchesGlobalCity && 
               matchesLocalCity && matchesLocalPlatform && matchesSkus && matchesAvailability
      })

      const headers = [
        'Store Name',
        'Store ID',
        'City',
        'Platform', 
        'Availability (%)',
        'Performance Level',
        'Avg Order Value (₹)',
        'Monthly Orders',
        'Top SKUs',
        'Last Stockout Date',
        'Days Since Stockout'
      ]
      
      const rows = allFiltered.map(store => {
        const availabilityBadge = getAvailabilityBadge(store.availability)
        const daysSinceStockout = Math.floor((Date.now() - new Date(store.lastStockout).getTime()) / (1000 * 60 * 60 * 24))
        
        return [
          store.storeName,
          store.id,
          store.city,
          store.platform,
          store.availability.toFixed(1),
          availabilityBadge.label,
          store.avgOrderValue.toFixed(0),
          store.monthlyOrders.toString(),
          store.topSkus.join(', '),
          new Date(store.lastStockout).toLocaleDateString(),
          daysSinceStockout.toString()
        ]
      })
      
      const filename = `store-performance-analysis_${new Date().toISOString().split('T')[0]}`
      const result = await exportRawCSV(filename, headers, rows)
      
      if (result.success) {
        toast.success(`Performance data exported successfully! File saved as: ${result.filename}`)
      } else {
        toast.error(`Export failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button 
            onClick={handleExport} 
            variant="outline" 
            size="sm"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total Stores</div>
              <div className="text-lg font-bold text-blue-800">
                {summaryStats.totalStores}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Avg Availability</div>
              <div className="text-lg font-bold text-green-800">
                {summaryStats.avgAvailability.toFixed(1)}%
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Avg Order Value</div>
              <div className="text-lg font-bold text-purple-800">
                ₹{summaryStats.avgOrderValue.toFixed(0)}
              </div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Total Orders</div>
              <div className="text-lg font-bold text-orange-800">
                {(summaryStats.totalOrders / 1000).toFixed(0)}k
              </div>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <div className="text-sm text-emerald-600 font-medium">Excellent Stores</div>
              <div className="text-lg font-bold text-emerald-800">
                {summaryStats.excellentStores}
              </div>
              <div className="text-xs text-emerald-600">≥95% availability</div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-64">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search stores, cities, or platforms..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={localSelectedCity} onValueChange={(value) => { setLocalSelectedCity(value); setCurrentPage(1) }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={localSelectedPlatform} onValueChange={(value) => { setLocalSelectedPlatform(value); setCurrentPage(1) }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={availabilityFilter} onValueChange={(value) => { setAvailabilityFilter(value); setCurrentPage(1) }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Performance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Performance</SelectItem>
                  <SelectItem value="high">High (≥95%)</SelectItem>
                  <SelectItem value="medium">Medium (85-94%)</SelectItem>
                  <SelectItem value="low">Low (&lt;85%)</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <FilterIcon className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('storeName')}
                      className="font-medium p-0 h-auto"
                    >
                      Store Name {getSortIcon('storeName')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('city')}
                      className="font-medium p-0 h-auto"
                    >
                      City {getSortIcon('city')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('platform')}
                      className="font-medium p-0 h-auto"
                    >
                      Platform {getSortIcon('platform')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('availability')}
                      className="font-medium p-0 h-auto"
                    >
                      Availability {getSortIcon('availability')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('avgOrderValue')}
                      className="font-medium p-0 h-auto"
                    >
                      Avg Order Value {getSortIcon('avgOrderValue')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('monthlyOrders')}
                      className="font-medium p-0 h-auto"
                    >
                      Monthly Orders {getSortIcon('monthlyOrders')}
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">Top SKUs</TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('lastStockout')}
                      className="font-medium p-0 h-auto"
                    >
                      Last Stockout {getSortIcon('lastStockout')}
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((store) => {
                  const availabilityBadge = getAvailabilityBadge(store.availability)
                  const daysSinceStockout = Math.floor((Date.now() - new Date(store.lastStockout).getTime()) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <TableRow key={store.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium text-sm">{store.storeName}</div>
                          <div className="text-xs text-gray-500">{store.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{store.city}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {store.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-1">
                          <div className="font-medium">{store.availability.toFixed(1)}%</div>
                          <Badge className={`text-xs ${availabilityBadge.color} border-0`}>
                            {availabilityBadge.label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        ₹{store.avgOrderValue.toFixed(0)}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {store.monthlyOrders.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {store.topSkus.slice(0, 2).map((sku, index) => (
                            <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                              {sku.split(' ').slice(0, 2).join(' ')}
                            </Badge>
                          ))}
                          {store.topSkus.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{store.topSkus.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-1">
                          <div className="text-sm">{daysSinceStockout} days ago</div>
                          <div className="text-xs text-gray-500">
                            {new Date(store.lastStockout).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Items per page:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(parseInt(value))
                setCurrentPage(1)
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} 
                ({summaryStats.totalStores} total stores)
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}