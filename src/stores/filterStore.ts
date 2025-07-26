import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { 
  platforms, 
  cities, 
  aashirvaaProducts, 
  filterOptions,
  dateRanges 
} from '@/data/mock-kpi-data'
import { useMemo } from 'react'

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface FilterState {
  // Core filter values
  selectedPlatforms: string[]
  selectedCategories: string[]
  selectedSkus: string[]
  selectedCities: string[]
  selectedDarkStores: string[]
  selectedKeywords: string[]
  dateRange: DateRange
  dateRangePreset: keyof typeof dateRanges | 'custom'
  
  // UI state
  isFilterPanelOpen: boolean
  activeTab: 'availability' | 'pricing' | 'visibility'
  isLoading: boolean
  lastUpdated: number
  
  // Filter actions
  setSelectedPlatforms: (platforms: string[]) => void
  setSelectedCategories: (categories: string[]) => void
  setSelectedSkus: (skus: string[]) => void
  setSelectedCities: (cities: string[]) => void
  setSelectedDarkStores: (stores: string[]) => void
  setSelectedKeywords: (keywords: string[]) => void
  setDateRange: (range: DateRange) => void
  setDateRangePreset: (preset: keyof typeof dateRanges | 'custom') => void
  setActiveTab: (tab: 'availability' | 'pricing' | 'visibility') => void
  
  // Loading state actions
  setLoading: (loading: boolean) => void
  updateTimestamp: () => void
  
  // Panel actions
  toggleFilterPanel: () => void
  setFilterPanelOpen: (open: boolean) => void
  
  // Utility actions
  resetFilters: () => void
  applyFilters: () => void
  hasActiveFilters: () => boolean
  getActiveFilterCount: () => number
}

// Default values
const defaultDateRange: DateRange = {
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  to: new Date()
}

const initialState = {
  selectedPlatforms: platforms.map(p => p.id),
  selectedCategories: [],
  selectedSkus: [],
  selectedCities: [],
  selectedDarkStores: [],
  selectedKeywords: [],
  dateRange: defaultDateRange,
  dateRangePreset: 'last-30-days' as const,
  isFilterPanelOpen: false,
  activeTab: 'availability' as const,
  isLoading: false,
  lastUpdated: Date.now(),
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      ...initialState,
        
        // Filter setters with timestamp updates
        setSelectedPlatforms: (selectedPlatforms) =>
          set({ selectedPlatforms, lastUpdated: Date.now() }),
        
        setSelectedCategories: (selectedCategories) =>
          set({ selectedCategories, lastUpdated: Date.now() }),
        
        setSelectedSkus: (selectedSkus) =>
          set({ selectedSkus, lastUpdated: Date.now() }),
        
        setSelectedCities: (selectedCities) =>
          set({ selectedCities, lastUpdated: Date.now() }),
        
        setSelectedDarkStores: (selectedDarkStores) =>
          set({ selectedDarkStores, lastUpdated: Date.now() }),
        
        setSelectedKeywords: (selectedKeywords) =>
          set({ selectedKeywords, lastUpdated: Date.now() }),
        
        setDateRange: (dateRange) =>
          set({ dateRange, dateRangePreset: 'custom', lastUpdated: Date.now() }),
        
        setDateRangePreset: (preset) => {
          if (preset === 'custom') {
            set({ dateRangePreset: preset, lastUpdated: Date.now() })
            return
          }
          
          const range = dateRanges[preset]
          if (range && range.days) {
            const to = new Date()
            const from = new Date(Date.now() - range.days * 24 * 60 * 60 * 1000)
            set({ 
              dateRangePreset: preset,
              dateRange: { from, to },
              lastUpdated: Date.now()
            })
          }
        },
        
        setActiveTab: (activeTab) =>
          set({ activeTab, lastUpdated: Date.now() }),
        
        // Loading state actions
        setLoading: (isLoading) =>
          set({ isLoading }),
        
        updateTimestamp: () =>
          set({ lastUpdated: Date.now() }),
      
      // Panel actions
      toggleFilterPanel: () =>
        set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen })),
      
      setFilterPanelOpen: (isFilterPanelOpen) =>
        set({ isFilterPanelOpen }),
      
      // Utility actions
      resetFilters: () =>
        set({
          ...initialState,
          isFilterPanelOpen: get().isFilterPanelOpen,
          activeTab: get().activeTab,
        }),
      
      applyFilters: () => {
        // This is where we could trigger data refetch in a real app
        // For now, just close the panel on mobile
        if (window.innerWidth < 768) {
          set({ isFilterPanelOpen: false })
        }
      },
      
      hasActiveFilters: () => {
        const state = get()
        return (
          state.selectedCategories.length > 0 ||
          state.selectedSkus.length > 0 ||
          state.selectedCities.length > 0 ||
          state.selectedDarkStores.length > 0 ||
          state.selectedKeywords.length > 0 ||
          state.selectedPlatforms.length < platforms.length
        )
      },
      
      getActiveFilterCount: () => {
        const state = get()
        let count = 0
        
        if (state.selectedCategories.length > 0) count++
        if (state.selectedSkus.length > 0) count++
        if (state.selectedCities.length > 0) count++
        if (state.selectedDarkStores.length > 0) count++
        if (state.selectedKeywords.length > 0) count++
        if (state.selectedPlatforms.length < platforms.length) count++
        
        return count
      },
    }),
    {
      name: 'kelpie-filters',
      partialize: (state) => ({
        selectedPlatforms: state.selectedPlatforms,
        selectedCategories: state.selectedCategories,
        selectedSkus: state.selectedSkus,
        selectedCities: state.selectedCities,
        selectedDarkStores: state.selectedDarkStores,
        selectedKeywords: state.selectedKeywords,
        dateRange: state.dateRange,
        dateRangePreset: state.dateRangePreset,
        activeTab: state.activeTab,
      })
    }
  )
)

// Optimized selectors using shallow equality
export const useFilterPlatforms = () => useFilterStore(state => state.selectedPlatforms)
export const useFilterCategories = () => useFilterStore(state => state.selectedCategories)
export const useFilterSkus = () => useFilterStore(state => state.selectedSkus)
export const useFilterCities = () => useFilterStore(state => state.selectedCities)
export const useFilterDateRange = () => useFilterStore(state => state.dateRange)
export const useFilterActiveTab = () => useFilterStore(state => state.activeTab)
export const useFilterLoading = () => useFilterStore(state => state.isLoading)
export const useFilterLastUpdated = () => useFilterStore(state => state.lastUpdated)

// Computed selectors with memoization
export const useHasActiveFilters = () => useFilterStore(state => state.hasActiveFilters())
export const useActiveFilterCount = () => useFilterStore(state => state.getActiveFilterCount())

// Derived selectors for computed values with memoization
export const useFilteredData = () => {
  const selectedPlatforms = useFilterPlatforms()
  const selectedCategories = useFilterCategories()
  const selectedSkus = useFilterSkus()
  const selectedCities = useFilterCities()
  
  return useMemo(() => {
    // Helper to check if a platform is selected
    const isPlatformSelected = (platformId: string) =>
      selectedPlatforms.includes(platformId)
    
    // Helper to check if a category is selected
    const isCategorySelected = (category: string) =>
      selectedCategories.length === 0 || 
      selectedCategories.includes(category)
    
    // Helper to check if a SKU is selected
    const isSkuSelected = (skuId: string) =>
      selectedSkus.length === 0 || 
      selectedSkus.includes(skuId)
    
    // Helper to check if a city is selected
    const isCitySelected = (cityId: string) =>
      selectedCities.length === 0 || 
      selectedCities.includes(cityId)
    
    // Get filtered SKUs based on category selection
    const getFilteredSkus = () => {
      if (selectedCategories.length === 0) {
        return aashirvaaProducts
      }
      return aashirvaaProducts.filter(product =>
        selectedCategories.includes(product.category)
      )
    }
    
    // Get filtered cities based on selection
    const getFilteredCities = () => {
      if (selectedCities.length === 0) {
        return cities
      }
      return cities.filter(city =>
        selectedCities.includes(city.id)
      )
    }
    
    return {
      isPlatformSelected,
      isCategorySelected,
      isSkuSelected,
      isCitySelected,
      getFilteredSkus,
      getFilteredCities,
    }
  }, [selectedPlatforms, selectedCategories, selectedSkus, selectedCities])
}

// Hook for URL synchronization (to be implemented)
export const useFilterUrlSync = () => {
  // This would sync filters with URL params for shareable links
  // Implementation would depend on the router being used
  return {
    syncToUrl: () => {},
    syncFromUrl: () => {},
  }
}