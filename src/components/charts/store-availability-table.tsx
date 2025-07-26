import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, Loader2 } from 'lucide-react'
import { visualizationData } from '@/data/mock-kpi-data'
import { useState, useMemo } from 'react'
import { exportRawCSV } from '@/utils/csv-export'
import { toast } from 'sonner'
import { useFilterStore, useFilteredData } from '@/stores/filterStore'

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

interface StoreAvailabilityTableProps {
  title?: string
  description?: string
  data?: StoreData[]
}

type SortDirection = 'asc' | 'desc' | null

export function StoreAvailabilityTable({ 
  title = "Store Performance Analysis",
  description = "Detailed availability metrics by store location",
  data = visualizationData.storePerformance
}: StoreAvailabilityTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [localPlatformFilter, setLocalPlatformFilter] = useState<string>('all')
  const [localCityFilter, setLocalCityFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<keyof StoreData | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
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
  
  // Get unique platforms and cities for filters
  const platforms = [...new Set(data.map(store => store.platform))]
  const cities = [...new Set(data.map(store => store.city))]
  
  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(store => {
      const matchesSearch = store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.city.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Apply global platform filters if any are selected
      const matchesGlobalPlatform = selectedPlatforms.length === 0 || 
        isPlatformSelected(store.platform.toLowerCase().replace(' ', '-'))
      
      // Apply global city filters if any are selected
      const matchesGlobalCity = selectedCities.length === 0 || 
        isCitySelected(store.city.toLowerCase().replace(' ', ''))
      
      // Apply local table filters (these work on top of global filters)
      const matchesLocalPlatform = localPlatformFilter === 'all' || store.platform === localPlatformFilter
      const matchesLocalCity = localCityFilter === 'all' || store.city === localCityFilter
      
      // Filter by SKUs if specific ones are selected globally
      let matchesSkus = true
      if (selectedCategories.length > 0 || selectedSkus.length > 0) {
        const allowedSkus = getFilteredSkus()
        const allowedSkuNames = allowedSkus.map(sku => sku.name)
        // Check if any of the store's top SKUs match the filtered SKUs
        matchesSkus = store.topSkus.some(sku => allowedSkuNames.includes(sku))
      }
      
      return matchesSearch && matchesGlobalPlatform && matchesGlobalCity && 
             matchesLocalPlatform && matchesLocalCity && matchesSkus
    })
    
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aVal = a[sortField]
        let bVal = b[sortField]
        
        // Handle array fields (topSkus)
        if (Array.isArray(aVal) && Array.isArray(bVal)) {
          aVal = aVal.length
          bVal = bVal.length
        }
        
        // Handle string fields
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal)
        }
        
        // Handle numeric fields
        const numA = Number(aVal)
        const numB = Number(bVal)
        return sortDirection === 'asc' ? numA - numB : numB - numA
      })
    }
    
    return filtered
  }, [data, searchTerm, localPlatformFilter, localCityFilter, sortField, sortDirection, 
      selectedPlatforms, selectedCities, selectedCategories, selectedSkus, 
      isPlatformSelected, isCitySelected, getFilteredSkus])
  
  // Handle sorting
  const handleSort = (field: keyof StoreData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc')
      if (sortDirection === 'desc') {
        setSortField(null)
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  // Get sort icon
  const getSortIcon = (field: keyof StoreData) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
    if (sortDirection === 'asc') return <ArrowUp className="w-4 h-4" />
    if (sortDirection === 'desc') return <ArrowDown className="w-4 h-4" />
    return <ArrowUpDown className="w-4 h-4" />
  }
  
  // Get availability badge color
  const getAvailabilityBadge = (availability: number) => {
    if (availability >= 95) return 'bg-green-100 text-green-800'
    if (availability >= 90) return 'bg-yellow-100 text-yellow-800'
    if (availability >= 85) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }
  
  // Export data using our centralized CSV export utility
  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const headers = [
        'Store Name',
        'City', 
        'Platform',
        'Availability (%)',
        'Avg Order Value (₹)',
        'Monthly Orders',
        'Top SKUs',
        'Last Stockout'
      ]
      
      const rows = filteredAndSortedData.map(store => [
        store.storeName,
        store.city,
        store.platform,
        store.availability.toFixed(1),
        store.avgOrderValue.toFixed(0),
        store.monthlyOrders.toString(),
        store.topSkus.join(', '),
        new Date(store.lastStockout).toLocaleDateString()
      ])
      
      const filename = `store-availability-data_${new Date().toISOString().split('T')[0]}`
      const result = await exportRawCSV(filename, headers, rows)
      
      if (result.success) {
        toast.success(`Store data exported successfully! File saved as: ${result.filename}`)
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
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search stores or cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={localPlatformFilter} onValueChange={setLocalPlatformFilter}>
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
          <Select value={localCityFilter} onValueChange={setLocalCityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('storeName')}
                    className="h-auto p-0 font-medium"
                  >
                    Store Name
                    {getSortIcon('storeName')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('city')}
                    className="h-auto p-0 font-medium"
                  >
                    City
                    {getSortIcon('city')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('platform')}
                    className="h-auto p-0 font-medium"
                  >
                    Platform
                    {getSortIcon('platform')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('availability')}
                    className="h-auto p-0 font-medium"
                  >
                    Availability
                    {getSortIcon('availability')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('avgOrderValue')}
                    className="h-auto p-0 font-medium"
                  >
                    Avg Order Value
                    {getSortIcon('avgOrderValue')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('monthlyOrders')}
                    className="h-auto p-0 font-medium"
                  >
                    Monthly Orders
                    {getSortIcon('monthlyOrders')}
                  </Button>
                </TableHead>
                <TableHead>Top SKUs</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('lastStockout')}
                    className="h-auto p-0 font-medium"
                  >
                    Last Stockout
                    {getSortIcon('lastStockout')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.storeName}</TableCell>
                  <TableCell>{store.city}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{store.platform}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getAvailabilityBadge(store.availability)}>
                      {store.availability.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>₹{store.avgOrderValue.toFixed(0)}</TableCell>
                  <TableCell>{store.monthlyOrders.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {store.topSkus.slice(0, 2).map((sku) => (
                        <Badge key={sku} variant="secondary" className="text-xs">
                          {sku}
                        </Badge>
                      ))}
                      {store.topSkus.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{store.topSkus.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(store.lastStockout).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAndSortedData.length} of {data.length} stores
        </div>
      </CardContent>
    </Card>
  )
}