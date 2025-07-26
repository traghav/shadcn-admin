import React from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useFilterStore } from '@/stores/filterStore'
import { 
  platforms, 
  cities, 
  aashirvaaProducts, 
  filterOptions,
  dateRanges 
} from '@/data/mock-kpi-data'

interface FilterIndicatorProps {
  className?: string
}

export function FilterIndicator({ className }: FilterIndicatorProps) {
  const {
    selectedPlatforms,
    selectedCategories,
    selectedSkus,
    selectedCities,
    selectedKeywords,
    dateRangePreset,
    activeTab,
    setSelectedPlatforms,
    setSelectedCategories,
    setSelectedSkus,
    setSelectedCities,
    setSelectedKeywords,
    hasActiveFilters,
    resetFilters,
  } = useFilterStore()

  if (!hasActiveFilters()) {
    return null
  }

  const getFilterBadges = () => {
    const badges = []

    // Platform filters
    if (selectedPlatforms.length > 0 && selectedPlatforms.length < platforms.length) {
      const platformNames = selectedPlatforms.map(id => 
        platforms.find(p => p.id === id)?.name
      ).filter(Boolean)
      
      badges.push({
        key: 'platforms',
        label: `Platforms: ${platformNames.join(', ')}`,
        onRemove: () => setSelectedPlatforms(platforms.map(p => p.id))
      })
    }

    // Category filters
    if (selectedCategories.length > 0) {
      badges.push({
        key: 'categories',
        label: `Categories: ${selectedCategories.join(', ')}`,
        onRemove: () => setSelectedCategories([])
      })
    }

    // SKU filters
    if (selectedSkus.length > 0) {
      const skuNames = selectedSkus.map(id => 
        aashirvaaProducts.find(p => p.id === id)?.name
      ).filter(Boolean)
      
      const displayText = skuNames.length > 2 
        ? `${skuNames.slice(0, 2).join(', ')} +${skuNames.length - 2} more`
        : skuNames.join(', ')
      
      badges.push({
        key: 'skus',
        label: `SKUs: ${displayText}`,
        onRemove: () => setSelectedSkus([])
      })
    }

    // City filters
    if (selectedCities.length > 0) {
      const cityNames = selectedCities.map(id => 
        cities.find(c => c.id === id)?.name
      ).filter(Boolean)
      
      badges.push({
        key: 'cities',
        label: `Cities: ${cityNames.join(', ')}`,
        onRemove: () => setSelectedCities([])
      })
    }

    // Keyword filters (visibility tab only)
    if (activeTab === 'visibility' && selectedKeywords.length > 0) {
      const displayText = selectedKeywords.length > 2 
        ? `${selectedKeywords.slice(0, 2).join(', ')} +${selectedKeywords.length - 2} more`
        : selectedKeywords.join(', ')
      
      badges.push({
        key: 'keywords',
        label: `Keywords: ${displayText}`,
        onRemove: () => setSelectedKeywords([])
      })
    }

    // Date range filter (only if not default)
    if (dateRangePreset !== 'last-30-days') {
      const rangeLabel = dateRanges[dateRangePreset as keyof typeof dateRanges]?.label || 'Custom range'
      badges.push({
        key: 'dateRange',
        label: `Period: ${rangeLabel}`,
        onRemove: () => {} // Date range can't be individually removed
      })
    }

    return badges
  }

  const filterBadges = getFilterBadges()

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Active filters:</span>
      
      {filterBadges.map((badge) => (
        <Badge
          key={badge.key}
          variant="secondary"
          className="flex items-center gap-1 max-w-64"
        >
          <span className="truncate">{badge.label}</span>
          {badge.onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={badge.onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Badge>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={resetFilters}
        className="text-xs h-6 px-2"
      >
        Clear all
      </Button>
    </div>
  )
}

// Compact version for mobile or small spaces
export function FilterIndicatorCompact({ className }: FilterIndicatorProps) {
  const { hasActiveFilters, getActiveFilterCount, resetFilters } = useFilterStore()

  if (!hasActiveFilters()) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="secondary" className="flex items-center gap-1">
        {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} active
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 hover:bg-transparent"
          onClick={resetFilters}
        >
          <X className="h-3 w-3" />
        </Button>
      </Badge>
    </div>
  )
}