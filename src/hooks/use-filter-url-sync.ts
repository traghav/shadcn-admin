import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { 
  useFilterBrands, 
  useFilterCategories, 
  useFilterSkus, 
  useFilterCities, 
  useFilterKeywords, 
  useFilterDateRangePreset,
  useCurrentPlatform,
  useFilterStore 
} from '@/stores/filterStore'

export function useFilterUrlSync() {
  const router = useRouter()
  const currentPlatform = useCurrentPlatform()
  const selectedBrands = useFilterBrands()
  const selectedCategories = useFilterCategories()
  const selectedSkus = useFilterSkus()
  const selectedCities = useFilterCities()
  const selectedKeywords = useFilterKeywords()
  const dateRangePreset = useFilterDateRangePreset()
  
  const {
    setSelectedCategories,
    setSelectedSkus,
    setSelectedCities,
    setSelectedKeywords,
    setDateRangePreset,
    setCurrentPlatform,
  } = useFilterStore()

  // Sync filters to URL on change
  useEffect(() => {
    const params = new URLSearchParams()
    
    // Include current platform
    params.set('platform', currentPlatform)
    
    if (selectedCategories && selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','))
    }
    
    if (selectedSkus && selectedSkus.length > 0) {
      params.set('skus', selectedSkus.join(','))
    }
    
    if (selectedCities && selectedCities.length > 0) {
      params.set('cities', selectedCities.join(','))
    }
    
    if (selectedKeywords && selectedKeywords.length > 0) {
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
    currentPlatform,
    selectedCategories,
    selectedSkus,
    selectedCities,
    selectedKeywords,
    dateRangePreset,
  ])

  // Sync URL to filters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    
    const platformParam = params.get('platform')
    if (platformParam) {
      setCurrentPlatform(platformParam)
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