import React from 'react'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFilterStore } from '@/stores/filterStore'
import { 
  platforms, 
  brands,
  cities, 
  aashirvaaProducts, 
  darkStores,
  dateRanges 
} from '@/data/mock-kpi-data'

interface GlobalFilterBarProps {
  className?: string
}

export function GlobalFilterBar({ className }: GlobalFilterBarProps) {
  const {
    selectedPlatforms,
    selectedBrands,
    selectedSkus,
    selectedCities,
    selectedDarkStores,
    selectedKeywords,
    dateRange,
    dateRangePreset,
    activeTab,
    setSelectedPlatforms,
    setSelectedBrands,
    setSelectedSkus,
    setSelectedCities,
    setSelectedDarkStores,
    setSelectedKeywords,
    setDateRange,
    setDateRangePreset,
    resetFilters,
    hasActiveFilters,
    getActiveFilterCount,
  } = useFilterStore()

  // Get filtered data based on current selections
  const getFilteredSkus = () => {
    let filteredSkus = aashirvaaProducts
    
    if (selectedBrands.length > 0) {
      filteredSkus = filteredSkus.filter(product =>
        selectedBrands.includes(product.brandId)
      )
    }
    
    return filteredSkus
  }

  const getFilteredDarkStores = () => {
    let filteredStores = darkStores.filter(store => store.isActive)
    
    if (selectedCities.length > 0) {
      filteredStores = filteredStores.filter(store =>
        selectedCities.includes(store.cityId)
      )
    }
    
    if (selectedPlatforms.length > 0 && selectedPlatforms.length < platforms.length) {
      filteredStores = filteredStores.filter(store =>
        selectedPlatforms.includes(store.platformId)
      )
    }
    
    return filteredStores
  }

  // Keywords for visibility tab
  const visibilityKeywords = [
    'atta', 'wheat flour', 'whole wheat atta', 'multigrain atta',
    'instant poha', 'instant upma', 'instant khichdi',
    'turmeric powder', 'chilli powder', 'coriander powder',
    'iodized salt', 'crystal salt', 'aashirvaad'
  ]

  const getDisplayText = (items: string[], getNameById: (id: string) => string, maxItems = 2) => {
    if (items.length === 0) return 'All'
    if (items.length <= maxItems) {
      return items.map(getNameById).join(', ')
    }
    const displayed = items.slice(0, maxItems).map(getNameById).join(', ')
    return `${displayed} +${items.length - maxItems} more`
  }

  return (
    <div className={`bg-background border-b ${className}`}>
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm font-medium hidden sm:inline">Date:</Label>
            <Select
              value={dateRangePreset}
              onValueChange={(value: any) => setDateRangePreset(value)}
            >
              <SelectTrigger className="w-[120px] sm:w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(dateRanges).map(([key, range]) => (
                  <SelectItem key={key} value={key}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {dateRangePreset === 'custom' && (
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      {dateRange.from ? format(dateRange.from, 'MMM d') : 'From'}
                      <CalendarIcon className="ml-2 h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      {dateRange.to ? format(dateRange.to, 'MMM d') : 'To'}
                      <CalendarIcon className="ml-2 h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                      disabled={(date) => date > new Date() || (dateRange.from && date < dateRange.from)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* City Filter */}
          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm font-medium hidden sm:inline">City:</Label>
            <Select
              value={selectedCities.length === 1 ? selectedCities[0] : selectedCities.length === 0 ? 'all' : 'multiple'}
              onValueChange={(value) => {
                if (value === 'all') {
                  setSelectedCities([])
                } else if (value === 'multiple') {
                  // Keep current selection
                } else {
                  setSelectedCities([value])
                }
              }}
            >
              <SelectTrigger className="w-[100px] sm:w-[140px] h-8">
                <SelectValue>
                  <span className="sm:hidden">
                    {selectedCities.length === 0 ? 'City' : 
                     selectedCities.length === 1 ? cities.find(c => c.id === selectedCities[0])?.name :
                     `${selectedCities.length} cities`}
                  </span>
                  <span className="hidden sm:inline">
                    {selectedCities.length === 0 ? 'All Cities' : 
                     selectedCities.length === 1 ? cities.find(c => c.id === selectedCities[0])?.name :
                     `${selectedCities.length} cities`}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dark Store Filter */}
          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm font-medium hidden sm:inline">Store:</Label>
            <Select
              value={selectedDarkStores.length === 1 ? selectedDarkStores[0] : selectedDarkStores.length === 0 ? 'all' : 'multiple'}
              onValueChange={(value) => {
                if (value === 'all') {
                  setSelectedDarkStores([])
                } else if (value === 'multiple') {
                  // Keep current selection
                } else {
                  setSelectedDarkStores([value])
                }
              }}
            >
              <SelectTrigger className="w-[100px] sm:w-[160px] h-8">
                <SelectValue>
                  <span className="sm:hidden">
                    {selectedDarkStores.length === 0 ? 'Store' : 
                     selectedDarkStores.length === 1 ? getFilteredDarkStores().find(s => s.id === selectedDarkStores[0])?.name.split(' ')[0] :
                     `${selectedDarkStores.length} stores`}
                  </span>
                  <span className="hidden sm:inline">
                    {selectedDarkStores.length === 0 ? 'All Stores' : 
                     selectedDarkStores.length === 1 ? getFilteredDarkStores().find(s => s.id === selectedDarkStores[0])?.name :
                     `${selectedDarkStores.length} stores`}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {getFilteredDarkStores().map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm font-medium hidden sm:inline">Brand:</Label>
            <Select
              value={selectedBrands.length === 1 ? selectedBrands[0] : selectedBrands.length === 0 ? 'all' : 'multiple'}
              onValueChange={(value) => {
                if (value === 'all') {
                  setSelectedBrands([])
                } else if (value === 'multiple') {
                  // Keep current selection
                } else {
                  setSelectedBrands([value])
                }
              }}
            >
              <SelectTrigger className="w-[100px] sm:w-[140px] h-8">
                <SelectValue>
                  <span className="sm:hidden">
                    {selectedBrands.length === 0 ? 'Brand' : 
                     selectedBrands.length === 1 ? brands.find(b => b.id === selectedBrands[0])?.name :
                     `${selectedBrands.length} brands`}
                  </span>
                  <span className="hidden sm:inline">
                    {selectedBrands.length === 0 ? 'All Brands' : 
                     selectedBrands.length === 1 ? brands.find(b => b.id === selectedBrands[0])?.name :
                     `${selectedBrands.length} brands`}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SKU Filter */}
          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm font-medium hidden sm:inline">SKU:</Label>
            <Select
              value={selectedSkus.length === 1 ? selectedSkus[0] : selectedSkus.length === 0 ? 'all' : 'multiple'}
              onValueChange={(value) => {
                if (value === 'all') {
                  setSelectedSkus([])
                } else if (value === 'multiple') {
                  // Keep current selection
                } else {
                  setSelectedSkus([value])
                }
              }}
            >
              <SelectTrigger className="w-[100px] sm:w-[160px] h-8">
                <SelectValue>
                  <span className="sm:hidden">
                    {selectedSkus.length === 0 ? 'SKU' : 
                     selectedSkus.length === 1 ? getFilteredSkus().find(s => s.id === selectedSkus[0])?.name.split(' ')[0] :
                     `${selectedSkus.length} SKUs`}
                  </span>
                  <span className="hidden sm:inline">
                    {selectedSkus.length === 0 ? 'All SKUs' : 
                     selectedSkus.length === 1 ? getFilteredSkus().find(s => s.id === selectedSkus[0])?.name :
                     `${selectedSkus.length} SKUs`}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SKUs</SelectItem>
                {getFilteredSkus().map((sku) => (
                  <SelectItem key={sku.id} value={sku.id}>
                    {sku.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Keywords Filter (Visibility Tab Only) */}
          {activeTab === 'visibility' && (
            <>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Label className="text-xs sm:text-sm font-medium hidden sm:inline">Keywords:</Label>
                <Select
                  value={selectedKeywords.length === 1 ? selectedKeywords[0] : selectedKeywords.length === 0 ? 'all' : 'multiple'}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      setSelectedKeywords([])
                    } else if (value === 'multiple') {
                      // Keep current selection
                    } else {
                      setSelectedKeywords([value])
                    }
                  }}
                >
                  <SelectTrigger className="w-[100px] sm:w-[160px] h-8">
                    <SelectValue>
                      <span className="sm:hidden">
                        {selectedKeywords.length === 0 ? 'Keywords' : 
                         selectedKeywords.length === 1 ? selectedKeywords[0].split(' ')[0] :
                         `${selectedKeywords.length} keywords`}
                      </span>
                      <span className="hidden sm:inline">
                        {selectedKeywords.length === 0 ? 'All Keywords' : 
                         selectedKeywords.length === 1 ? selectedKeywords[0] :
                         `${selectedKeywords.length} keywords`}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Keywords</SelectItem>
                    {visibilityKeywords.map((keyword) => (
                      <SelectItem key={keyword} value={keyword}>
                        {keyword}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Active Filter Count and Reset */}
          {hasActiveFilters() && (
            <>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <span className="sm:hidden">
                    {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''}
                  </span>
                  <span className="hidden sm:inline">
                    {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} active
                  </span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-6 px-2 text-xs"
                >
                  <span className="sm:hidden">Clear</span>
                  <span className="hidden sm:inline">Clear all</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}