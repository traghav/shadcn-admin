import React from 'react'
import { format } from 'date-fns'
import { 
  CalendarIcon, 
  Filter, 
  Search, 
  X, 
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFilterStore, DateRange } from '@/stores/filterStore'
import { 
  platforms, 
  cities, 
  aashirvaaProducts, 
  filterOptions,
  dateRanges 
} from '@/data/mock-kpi-data'

interface FilterPanelProps {
  className?: string
}

export function FilterPanel({ className }: FilterPanelProps) {
  const {
    selectedPlatforms,
    selectedCategories,
    selectedSkus,
    selectedCities,
    selectedKeywords,
    dateRange,
    dateRangePreset,
    activeTab,
    isFilterPanelOpen,
    setSelectedPlatforms,
    setSelectedCategories,
    setSelectedSkus,
    setSelectedCities,
    setSelectedKeywords,
    setDateRange,
    setDateRangePreset,
    toggleFilterPanel,
    resetFilters,
    applyFilters,
    hasActiveFilters,
    getActiveFilterCount,
  } = useFilterStore()

  const [searchTerms, setSearchTerms] = React.useState({
    brands: '',
    skus: '',
    keywords: '',
  })

  const [collapsedSections, setCollapsedSections] = React.useState({
    platforms: false,
    categories: false,
    skus: false,
    geography: false,
    keywords: activeTab !== 'visibility',
    dateRange: false,
  })

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Filter SKUs based on category selection and search
  const getFilteredSkus = () => {
    let filteredSkus = aashirvaaProducts
    
    if (selectedCategories.length > 0) {
      filteredSkus = filteredSkus.filter(product =>
        selectedCategories.includes(product.category)
      )
    }
    
    if (searchTerms.skus) {
      filteredSkus = filteredSkus.filter(product =>
        product.name.toLowerCase().includes(searchTerms.skus.toLowerCase())
      )
    }
    
    return filteredSkus
  }

  // Keywords for visibility tab
  const visibilityKeywords = [
    'atta', 'wheat flour', 'whole wheat atta', 'multigrain atta',
    'instant poha', 'instant upma', 'instant khichdi',
    'turmeric powder', 'chilli powder', 'coriander powder',
    'iodized salt', 'crystal salt', 'aashirvaad'
  ]

  const getFilteredKeywords = () => {
    if (!searchTerms.keywords) return visibilityKeywords
    return visibilityKeywords.filter(keyword =>
      keyword.toLowerCase().includes(searchTerms.keywords.toLowerCase())
    )
  }

  if (!isFilterPanelOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={toggleFilterPanel}
        className="fixed left-4 top-20 z-50 shadow-lg"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {hasActiveFilters() && (
          <Badge variant="secondary" className="ml-2 px-1 min-w-[1.25rem] h-5">
            {getActiveFilterCount()}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <Card className={`w-80 lg:w-80 sm:w-full h-fit max-h-[calc(100vh-8rem)] lg:max-h-[calc(100vh-8rem)] sm:max-h-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2 px-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              disabled={!hasActiveFilters()}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFilterPanel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 pt-0">
        <ScrollArea className="h-[calc(100vh-16rem)] lg:h-[calc(100vh-16rem)] sm:h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            
            {/* Date Range Filter */}
            <Collapsible
              open={!collapsedSections.dateRange}
              onOpenChange={() => toggleSection('dateRange')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Label className="text-sm font-medium">Date Range</Label>
                  {collapsedSections.dateRange ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                <Select
                  value={dateRangePreset}
                  onValueChange={(value: any) => setDateRangePreset(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time period" />
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
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full text-xs justify-start">
                            {dateRange.from ? (
                              format(dateRange.from, 'MMM d')
                            ) : (
                              'Start date'
                            )}
                            <CalendarIcon className="ml-auto h-3 w-3" />
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
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full text-xs justify-start">
                            {dateRange.to ? (
                              format(dateRange.to, 'MMM d')
                            ) : (
                              'End date'
                            )}
                            <CalendarIcon className="ml-auto h-3 w-3" />
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
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Platform Filter */}
            <Collapsible
              open={!collapsedSections.platforms}
              onOpenChange={() => toggleSection('platforms')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Label className="text-sm font-medium">Platforms</Label>
                  {collapsedSections.platforms ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPlatforms([...selectedPlatforms, platform.id])
                        } else {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id))
                        }
                      }}
                    />
                    <Label
                      htmlFor={platform.id}
                      className="text-sm font-normal flex-1 cursor-pointer"
                    >
                      {platform.name}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Category Filter */}
            <Collapsible
              open={!collapsedSections.categories}
              onOpenChange={() => toggleSection('categories')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Label className="text-sm font-medium">Categories</Label>
                  {collapsedSections.categories ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                {filterOptions.categories.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.value}
                      checked={selectedCategories.includes(category.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category.value])
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category.value))
                        }
                      }}
                    />
                    <Label
                      htmlFor={category.value}
                      className="text-sm font-normal flex-1 cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* SKU Filter */}
            <Collapsible
              open={!collapsedSections.skus}
              onOpenChange={() => toggleSection('skus')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Label className="text-sm font-medium">SKUs</Label>
                  {collapsedSections.skus ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search SKUs..."
                    value={searchTerms.skus}
                    onChange={(e) => setSearchTerms(prev => ({ ...prev, skus: e.target.value }))}
                    className="pl-8"
                  />
                </div>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {getFilteredSkus().map((product) => (
                      <div key={product.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={product.id}
                          checked={selectedSkus.includes(product.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSkus([...selectedSkus, product.id])
                            } else {
                              setSelectedSkus(selectedSkus.filter(s => s !== product.id))
                            }
                          }}
                        />
                        <div className="flex-1 cursor-pointer">
                          <Label
                            htmlFor={product.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {product.name}
                          </Label>
                          <div className="text-xs text-muted-foreground">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Geography Filter */}
            <Collapsible
              open={!collapsedSections.geography}
              onOpenChange={() => toggleSection('geography')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                  <Label className="text-sm font-medium">Geography</Label>
                  {collapsedSections.geography ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                {cities.map((city) => (
                  <div key={city.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={city.id}
                      checked={selectedCities.includes(city.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCities([...selectedCities, city.id])
                        } else {
                          setSelectedCities(selectedCities.filter(c => c !== city.id))
                        }
                      }}
                    />
                    <Label
                      htmlFor={city.id}
                      className="text-sm font-normal flex-1 cursor-pointer"
                    >
                      {city.name}
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {city.darkStores} stores
                    </span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Keywords Filter (Visibility Tab Only) */}
            {activeTab === 'visibility' && (
              <>
                <Separator />
                <Collapsible
                  open={!collapsedSections.keywords}
                  onOpenChange={() => toggleSection('keywords')}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                      <Label className="text-sm font-medium">Keywords</Label>
                      {collapsedSections.keywords ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pt-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search keywords..."
                        value={searchTerms.keywords}
                        onChange={(e) => setSearchTerms(prev => ({ ...prev, keywords: e.target.value }))}
                        className="pl-8"
                      />
                    </div>
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {getFilteredKeywords().map((keyword) => (
                          <div key={keyword} className="flex items-center space-x-2">
                            <Checkbox
                              id={`keyword-${keyword}`}
                              checked={selectedKeywords.includes(keyword)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedKeywords([...selectedKeywords, keyword])
                                } else {
                                  setSelectedKeywords(selectedKeywords.filter(k => k !== keyword))
                                }
                              }}
                            />
                            <Label
                              htmlFor={`keyword-${keyword}`}
                              className="text-sm font-normal flex-1 cursor-pointer"
                            >
                              {keyword}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Apply/Reset Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            disabled={!hasActiveFilters()}
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            size="sm"
            onClick={applyFilters}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-1" />
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook to control filter panel from other components
export function useFilterPanel() {
  const { toggleFilterPanel, setFilterPanelOpen } = useFilterStore()
  
  return {
    openFilterPanel: () => setFilterPanelOpen(true),
    closeFilterPanel: () => setFilterPanelOpen(false),
    toggleFilterPanel,
  }
}