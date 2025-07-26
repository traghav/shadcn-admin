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
import { useFilterStore, useFilterDateRange, useFilterDateRangePreset, useFilterCities, useFilterDarkStores, useFilterBrands, useFilterSkus, useFilterKeywords, useCurrentPlatform } from '@/stores/filterStore'
import { 
  platforms, 
  brands,
  cities, 
  brandProducts, 
  darkStores,
  dateRanges 
} from '@/data/mock-kpi-data'

interface GlobalFilterBarProps {
  className?: string
}

export function GlobalFilterBar({ className }: GlobalFilterBarProps) {
  const {
    activeTab,
    setSelectedBrands,
    setSelectedSkus,
    setSelectedCities,
    setSelectedDarkStores,
    setSelectedKeywords,
    setDateRange,
    setDateRangePreset,
    resetCurrentPlatformFilters,
    hasActiveFilters,
    getActiveFilterCount,
  } = useFilterStore()
  
  // Use the new selectors for platform-specific state
  const currentPlatform = useCurrentPlatform()
  const selectedBrands = useFilterBrands()
  const selectedSkus = useFilterSkus()
  const selectedCities = useFilterCities()
  const selectedDarkStores = useFilterDarkStores()
  const selectedKeywords = useFilterKeywords()
  const dateRange = useFilterDateRange()
  const dateRangePreset = useFilterDateRangePreset()

  // Get filtered data based on current selections
  const getFilteredSkus = () => {
    let filteredSkus = brandProducts
    
    if (selectedBrands.length > 0) {
      filteredSkus = filteredSkus.filter(product =>
        selectedBrands.includes(product.brandId)
      )
    }
    
    return filteredSkus
  }

  const getFilteredDarkStores = () => {
    // Filter stores by current platform and active status
    let filteredStores = darkStores.filter(store => 
      store.isActive && store.platformId === currentPlatform
    )
    
    if (selectedCities.length > 0) {
      filteredStores = filteredStores.filter(store =>
        selectedCities.includes(store.cityId)
      )
    }
    
    return filteredStores
  }

  // Keywords for visibility tab
  const visibilityKeywords = [
    'atta', 'wheat flour', 'whole wheat atta', 'multigrain atta',
    'instant poha', 'instant upma', 'instant khichdi',
    'turmeric powder', 'chilli powder', 'coriander powder',
    'iodized salt', 'crystal salt', 'premium brand'
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
    <div className={`bg-muted/30 dark:bg-muted/10 border-b border-border shadow-sm ${className}`}>
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-end justify-start gap-4 sm:gap-6 flex-wrap sm:justify-between">
          {/* Date Range Filter */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Date Range</Label>
            <div className="flex items-center gap-2">
              <Select
                value={dateRangePreset}
                onValueChange={(value: any) => setDateRangePreset(value)}
              >
                <SelectTrigger className={`min-w-[140px] h-9 ${dateRangePreset !== 'last-30-days' ? 'border-primary/50 bg-primary/10 dark:border-primary/30 dark:bg-primary/5' : ''}`}>
                  <SelectValue placeholder="Select period" />
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
                      <Button variant="outline" size="sm" className="h-9">
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
                      <Button variant="outline" size="sm" className="h-9">
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
          </div>

          {/* City Filter */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">City</Label>
              {selectedCities.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCities([])}
                  className="h-4 w-4 p-0 text-muted-foreground/60 hover:text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
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
              <SelectTrigger className={`min-w-[130px] h-9 ${selectedCities.length > 0 ? 'border-primary/50 bg-primary/10 dark:border-primary/30 dark:bg-primary/5' : ''}`}>
                <SelectValue placeholder="Select city">
                  {selectedCities.length === 0 ? 'All Cities' : 
                   selectedCities.length === 1 ? cities.find(c => c.id === selectedCities[0])?.name :
                   `${selectedCities.length} cities`}
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
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Dark Store</Label>
              {selectedDarkStores.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDarkStores([])}
                  className="h-4 w-4 p-0 text-muted-foreground/60 hover:text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
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
              <SelectTrigger className={`min-w-[160px] h-9 ${selectedDarkStores.length > 0 ? 'border-primary/50 bg-primary/10 dark:border-primary/30 dark:bg-primary/5' : ''}`}>
                <SelectValue placeholder="Select store">
                  {selectedDarkStores.length === 0 ? 'All Stores' : 
                   selectedDarkStores.length === 1 ? getFilteredDarkStores().find(s => s.id === selectedDarkStores[0])?.name :
                   `${selectedDarkStores.length} stores`}
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
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Brand</Label>
              {selectedBrands.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBrands([])}
                  className="h-4 w-4 p-0 text-muted-foreground/60 hover:text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
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
              <SelectTrigger className={`min-w-[130px] h-9 ${selectedBrands.length > 0 ? 'border-primary/50 bg-primary/10 dark:border-primary/30 dark:bg-primary/5' : ''}`}>
                <SelectValue placeholder="Select brand">
                  {selectedBrands.length === 0 ? 'All Brands' : 
                   selectedBrands.length === 1 ? brands.find(b => b.id === selectedBrands[0])?.name :
                   `${selectedBrands.length} brands`}
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
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">SKU</Label>
              {selectedSkus.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSkus([])}
                  className="h-4 w-4 p-0 text-muted-foreground/60 hover:text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
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
              <SelectTrigger className={`min-w-[160px] h-9 ${selectedSkus.length > 0 ? 'border-primary/50 bg-primary/10 dark:border-primary/30 dark:bg-primary/5' : ''}`}>
                <SelectValue placeholder="Select SKU">
                  {selectedSkus.length === 0 ? 'All SKUs' : 
                   selectedSkus.length === 1 ? getFilteredSkus().find(s => s.id === selectedSkus[0])?.name :
                   `${selectedSkus.length} SKUs`}
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
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Keywords</Label>
                {selectedKeywords.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedKeywords([])}
                    className="h-4 w-4 p-0 text-muted-foreground/60 hover:text-muted-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
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
                <SelectTrigger className={`min-w-[150px] h-9 ${selectedKeywords.length > 0 ? 'border-primary/50 bg-primary/10 dark:border-primary/30 dark:bg-primary/5' : ''}`}>
                  <SelectValue placeholder="Select keywords">
                    {selectedKeywords.length === 0 ? 'All Keywords' : 
                     selectedKeywords.length === 1 ? selectedKeywords[0] :
                     `${selectedKeywords.length} keywords`}
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
          )}

          {/* Active Filter Count and Clear All */}
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold opacity-0 pointer-events-none">Actions</div>
            <div className="flex items-center gap-3">
              {hasActiveFilters() && (
                <>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} active
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCurrentPlatformFilters}
                    className="h-9 px-3 text-xs border-destructive/50 text-destructive hover:bg-destructive/10 dark:border-destructive/30 dark:hover:bg-destructive/5"
                  >
                    Clear All
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}