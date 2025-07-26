import { useMemo } from 'react'
import { AvailabilityHeatmap } from './availability-heatmap'
import { useFilteredData } from '@/stores/filterStore'
import { visualizationData } from '@/data/mock-kpi-data'

interface FilteredAvailabilityHeatmapProps {
  title?: string
  description?: string
}

export function FilteredAvailabilityHeatmap({ 
  title = "Availability Heatmap",
  description = "SKU availability across cities and platforms"
}: FilteredAvailabilityHeatmapProps) {
  // No need to destructure individual filter values - use the filtered data hook

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

    // Filter by current platform (automatically handled by isPlatformSelected)
    filtered = filtered.filter(item => isPlatformSelected(item.platform))

    // Filter by selected cities
    filtered = filtered.filter(item => isCitySelected(
      // Map city name to ID (simple mapping for demo)
      item.city.toLowerCase().replace(' ', '')
    ))

    // Filter by selected categories and SKUs
    const allowedSkus = getFilteredSkus()
    const allowedSkuNames = allowedSkus.map(sku => sku.name)
    if (allowedSkuNames.length > 0) {
      filtered = filtered.filter(item => allowedSkuNames.includes(item.sku))
    }

    return filtered
  }, [
    isPlatformSelected,
    isCitySelected,
    isSkuSelected,
    getFilteredSkus,
  ])

  // Update description to show active filters
  const getFilteredDescription = () => {
    const filters = []
    
    // For now, just return a simple description
    filters.push('Current platform data')

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