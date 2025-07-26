import { useMemo } from 'react'
import { AvailabilityHeatmap } from './availability-heatmap'
import { useFilterStore, useFilteredData } from '@/stores/filterStore'
import { visualizationData, type HeatmapData } from '@/data/mock-kpi-data'

interface FilteredAvailabilityHeatmapProps {
  title?: string
  description?: string
}

export function FilteredAvailabilityHeatmap({ 
  title = "Availability Heatmap",
  description = "SKU availability across cities and platforms"
}: FilteredAvailabilityHeatmapProps) {
  const {
    selectedPlatforms,
    selectedCategories,
    selectedSkus,
    selectedCities,
    dateRange,
  } = useFilterStore()

  const { 
    isPlatformSelected,
    isCategorySelected,
    isSkuSelected,
    isCitySelected,
    getFilteredSkus,
    getFilteredCities,
  } = useFilteredData()

  // Filter the heatmap data based on current filter selections
  const filteredData = useMemo(() => {
    let filtered = visualizationData.availabilityHeatmap

    // Filter by selected platforms
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter(item => isPlatformSelected(item.platform))
    }

    // Filter by selected cities
    if (selectedCities.length > 0) {
      filtered = filtered.filter(item => isCitySelected(
        // Map city name to ID (simple mapping for demo)
        item.city.toLowerCase().replace(' ', '')
      ))
    }

    // Filter by selected categories and SKUs
    const allowedSkus = getFilteredSkus()
    if (selectedCategories.length > 0 || selectedSkus.length > 0) {
      const allowedSkuNames = allowedSkus.map(sku => sku.name)
      filtered = filtered.filter(item => allowedSkuNames.includes(item.sku))
    }

    return filtered
  }, [
    selectedPlatforms,
    selectedCategories,
    selectedSkus,
    selectedCities,
    isPlatformSelected,
    isCitySelected,
    isSkuSelected,
    getFilteredSkus,
  ])

  // Update description to show active filters
  const getFilteredDescription = () => {
    const filters = []
    
    if (selectedPlatforms.length > 0 && selectedPlatforms.length < 3) {
      filters.push(`${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}`)
    }
    
    if (selectedCategories.length > 0) {
      filters.push(`${selectedCategories.length} categor${selectedCategories.length > 1 ? 'ies' : 'y'}`)
    }
    
    if (selectedSkus.length > 0) {
      filters.push(`${selectedSkus.length} SKU${selectedSkus.length > 1 ? 's' : ''}`)
    }
    
    if (selectedCities.length > 0) {
      filters.push(`${selectedCities.length} cit${selectedCities.length > 1 ? 'ies' : 'y'}`)
    }

    if (filters.length === 0) {
      return description
    }

    return `${description} (Filtered by: ${filters.join(', ')})`
  }

  return (
    <AvailabilityHeatmap
      data={filteredData}
      title={title}
      description={getFilteredDescription()}
    />
  )
}