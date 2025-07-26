import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useFilterStore } from '@/stores/filterStore'

export function useFilterUrlSync() {
  const router = useRouter()
  const {
    selectedPlatforms,
    selectedCategories,
    selectedSkus,
    selectedCities,
    selectedKeywords,
    dateRangePreset,
    setSelectedPlatforms,
    setSelectedCategories,
    setSelectedSkus,
    setSelectedCities,
    setSelectedKeywords,
    setDateRangePreset,
  } = useFilterStore()

  // Sync filters to URL on change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (selectedPlatforms.length > 0 && selectedPlatforms.length < 3) {
      params.set('platforms', selectedPlatforms.join(','))
    }
    
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','))
    }
    
    if (selectedSkus.length > 0) {
      params.set('skus', selectedSkus.join(','))
    }
    
    if (selectedCities.length > 0) {
      params.set('cities', selectedCities.join(','))
    }
    
    if (selectedKeywords.length > 0) {
      params.set('keywords', selectedKeywords.join(','))
    }
    
    if (dateRangePreset !== 'last-30-days') {
      params.set('period', dateRangePreset)
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
    
    // Update URL without triggering navigation
    if (newUrl !== window.location.pathname + window.location.search) {
      window.history.replaceState({}, '', newUrl)
    }
  }, [
    selectedPlatforms,
    selectedCategories,
    selectedSkus,
    selectedCities,
    selectedKeywords,
    dateRangePreset,
  ])

  // Sync URL to filters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    
    const platformsParam = params.get('platforms')
    if (platformsParam) {
      setSelectedPlatforms(platformsParam.split(','))
    }
    
    const categoriesParam = params.get('categories')
    if (categoriesParam) {
      setSelectedCategories(categoriesParam.split(','))
    }
    
    const skusParam = params.get('skus')
    if (skusParam) {
      setSelectedSkus(skusParam.split(','))
    }
    
    const citiesParam = params.get('cities')
    if (citiesParam) {
      setSelectedCities(citiesParam.split(','))
    }
    
    const keywordsParam = params.get('keywords')
    if (keywordsParam) {
      setSelectedKeywords(keywordsParam.split(','))
    }
    
    const periodParam = params.get('period')
    if (periodParam && ['last-7-days', 'last-30-days', 'last-90-days', 'custom'].includes(periodParam)) {
      setDateRangePreset(periodParam as any)
    }
  }, [])

  const generateShareableUrl = () => {
    return window.location.href
  }

  const resetFiltersAndUrl = () => {
    window.history.replaceState({}, '', window.location.pathname)
  }

  return {
    generateShareableUrl,
    resetFiltersAndUrl,
  }
}