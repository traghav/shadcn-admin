import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { 
  platforms, 
  brands,
  cities, 
  aashirvaaProducts, 
  darkStores,
  filterOptions,
  dateRanges 
} from '@/data/mock-kpi-data'
import { useMemo } from 'react'

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

// Platform-specific filter state
export interface PlatformFilters {
  selectedBrands: string[]
  selectedCategories: string[]
  selectedSkus: string[]
  selectedCities: string[]
  selectedDarkStores: string[]
  selectedKeywords: string[]
  dateRange: DateRange
  dateRangePreset: keyof typeof dateRanges | 'custom'
  lastUpdated: number
}

export interface FilterState {
  // Platform management
  currentPlatform: string
  platformFilters: { [platformId: string]: PlatformFilters }
  
  // Global UI state
  isFilterPanelOpen: boolean
  activeTab: 'availability' | 'pricing' | 'visibility'
  isLoading: boolean
  
  // Platform actions
  setCurrentPlatform: (platformId: string) => void
  getCurrentPlatformFilters: () => PlatformFilters
  
  // Filter actions (work on current platform)
  setSelectedBrands: (brands: string[]) => void
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
  resetCurrentPlatformFilters: () => void
  applyFilters: () => void
  hasActiveFilters: () => boolean
  getActiveFilterCount: () => number
  
  // Derived getters for current platform
  getSelectedBrands: () => string[]
  getSelectedCategories: () => string[]
  getSelectedSkus: () => string[]
  getSelectedCities: () => string[]
  getSelectedDarkStores: () => string[]
  getSelectedKeywords: () => string[]
  getDateRange: () => DateRange
  getDateRangePreset: () => keyof typeof dateRanges | 'custom'
  getLastUpdated: () => number
}

// Default values
const defaultDateRange: DateRange = {
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  to: new Date()
}

const createDefaultPlatformFilters = (): PlatformFilters => ({
  selectedBrands: [],
  selectedCategories: [],
  selectedSkus: [],
  selectedCities: [],
  selectedDarkStores: [],
  selectedKeywords: [],
  dateRange: defaultDateRange,
  dateRangePreset: 'last-30-days' as const,
  lastUpdated: Date.now(),
})

const createInitialPlatformFilters = () => {
  const filters: { [key: string]: PlatformFilters } = {}
  platforms.forEach(platform => {
    filters[platform.id] = createDefaultPlatformFilters()
  })
  return filters
}

const initialState = {
  currentPlatform: platforms[0]?.id || 'blinkit',
  platformFilters: createInitialPlatformFilters(),
  isFilterPanelOpen: false,
  activeTab: 'availability' as const,
  isLoading: false,
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => {
      // Helper to update current platform filters
      const updateCurrentPlatformFilters = (updates: Partial<PlatformFilters>) => {
        const state = get()
        const currentFilters = state.platformFilters[state.currentPlatform] || createDefaultPlatformFilters()
        set({
          platformFilters: {
            ...state.platformFilters,
            [state.currentPlatform]: {
              ...currentFilters,
              ...updates,
              lastUpdated: Date.now()
            }
          }
        })
      }

      return {
        ...initialState,
        
        // Platform management
        setCurrentPlatform: (platformId) => {
          set({ currentPlatform: platformId })
        },
        
        getCurrentPlatformFilters: () => {
          const state = get()
          return state.platformFilters[state.currentPlatform] || createDefaultPlatformFilters()
        },
        
      // Filter setters with timestamp updates (work on current platform)
      setSelectedBrands: (selectedBrands) => {
        updateCurrentPlatformFilters({ selectedBrands })
      },
      
      setSelectedCategories: (selectedCategories) => {
        updateCurrentPlatformFilters({ selectedCategories })
      },
      
      setSelectedSkus: (selectedSkus) => {
        updateCurrentPlatformFilters({ selectedSkus })
      },
      
      setSelectedCities: (selectedCities) => {
        updateCurrentPlatformFilters({ selectedCities })
      },
      
      setSelectedDarkStores: (selectedDarkStores) => {
        updateCurrentPlatformFilters({ selectedDarkStores })
      },
      
      setSelectedKeywords: (selectedKeywords) => {
        updateCurrentPlatformFilters({ selectedKeywords })
      },
      
      setDateRange: (dateRange) => {
        updateCurrentPlatformFilters({ dateRange, dateRangePreset: 'custom' })
      },
      
      setDateRangePreset: (preset) => {
        if (preset === 'custom') {
          updateCurrentPlatformFilters({ dateRangePreset: preset })
          return
        }
        
        const range = dateRanges[preset]
        if (range && range.days) {
          const to = new Date()
          const from = new Date(Date.now() - range.days * 24 * 60 * 60 * 1000)
          updateCurrentPlatformFilters({ 
            dateRangePreset: preset,
            dateRange: { from, to }
          })
        }
      },
      
      setActiveTab: (activeTab) => {
        set({ activeTab })
      },
        
      // Loading state actions
      setLoading: (isLoading) =>
        set({ isLoading }),
      
      updateTimestamp: () => {
        updateCurrentPlatformFilters({})
      },
      
      // Panel actions
      toggleFilterPanel: () =>
        set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen })),
      
      setFilterPanelOpen: (isFilterPanelOpen) =>
        set({ isFilterPanelOpen }),
      
      // Utility actions
      resetFilters: () => {
        set({
          ...initialState,
          currentPlatform: get().currentPlatform,
          isFilterPanelOpen: get().isFilterPanelOpen,
          activeTab: get().activeTab,
        })
      },
      
      resetCurrentPlatformFilters: () => {
        const state = get()
        set({
          platformFilters: {
            ...state.platformFilters,
            [state.currentPlatform]: createDefaultPlatformFilters()
          }
        })
      },
      
      applyFilters: () => {
        // This is where we could trigger data refetch in a real app
        // For now, just close the panel on mobile
        if (window.innerWidth < 768) {
          set({ isFilterPanelOpen: false })
        }
      },
      
      hasActiveFilters: () => {
        const currentFilters = get().getCurrentPlatformFilters()
        return (
          currentFilters.selectedBrands.length > 0 ||
          currentFilters.selectedCategories.length > 0 ||
          currentFilters.selectedSkus.length > 0 ||
          currentFilters.selectedCities.length > 0 ||
          currentFilters.selectedDarkStores.length > 0 ||
          currentFilters.selectedKeywords.length > 0 ||
          currentFilters.dateRangePreset !== 'last-30-days'
        )
      },
      
      getActiveFilterCount: () => {
        const currentFilters = get().getCurrentPlatformFilters()
        let count = 0
        
        if (currentFilters.selectedBrands.length > 0) count++
        if (currentFilters.selectedCategories.length > 0) count++
        if (currentFilters.selectedSkus.length > 0) count++
        if (currentFilters.selectedCities.length > 0) count++
        if (currentFilters.selectedDarkStores.length > 0) count++
        if (currentFilters.selectedKeywords.length > 0) count++
        if (currentFilters.dateRangePreset !== 'last-30-days') count++
        
        return count
      },
      
      // Derived getters for current platform
      getSelectedBrands: () => get().getCurrentPlatformFilters().selectedBrands,
      getSelectedCategories: () => get().getCurrentPlatformFilters().selectedCategories,
      getSelectedSkus: () => get().getCurrentPlatformFilters().selectedSkus,
      getSelectedCities: () => get().getCurrentPlatformFilters().selectedCities,
      getSelectedDarkStores: () => get().getCurrentPlatformFilters().selectedDarkStores,
      getSelectedKeywords: () => get().getCurrentPlatformFilters().selectedKeywords,
      getDateRange: () => get().getCurrentPlatformFilters().dateRange,
      getDateRangePreset: () => get().getCurrentPlatformFilters().dateRangePreset,
      getLastUpdated: () => get().getCurrentPlatformFilters().lastUpdated,
      }
    },
    {
      name: 'kelpie-filters',
      partialize: (state) => ({
        currentPlatform: state.currentPlatform,
        platformFilters: state.platformFilters,
        activeTab: state.activeTab,
      })
    }
  )
)

// Optimized selectors using shallow equality
export const useCurrentPlatform = () => useFilterStore(state => state.currentPlatform)
export const useFilterBrands = () => useFilterStore(state => state.getSelectedBrands())
export const useFilterCategories = () => useFilterStore(state => state.getSelectedCategories())
export const useFilterSkus = () => useFilterStore(state => state.getSelectedSkus())
export const useFilterCities = () => useFilterStore(state => state.getSelectedCities())
export const useFilterDarkStores = () => useFilterStore(state => state.getSelectedDarkStores())
export const useFilterKeywords = () => useFilterStore(state => state.getSelectedKeywords())
export const useFilterDateRange = () => useFilterStore(state => state.getDateRange())
export const useFilterDateRangePreset = () => useFilterStore(state => state.getDateRangePreset())
export const useFilterActiveTab = () => useFilterStore(state => state.activeTab)
export const useFilterLoading = () => useFilterStore(state => state.isLoading)
export const useFilterLastUpdated = () => useFilterStore(state => state.getLastUpdated())

// Computed selectors with memoization
export const useHasActiveFilters = () => useFilterStore(state => state.hasActiveFilters())
export const useActiveFilterCount = () => useFilterStore(state => state.getActiveFilterCount())

// Derived selectors for computed values with memoization
export const useFilteredData = () => {
  const currentPlatform = useCurrentPlatform()
  const selectedBrands = useFilterBrands()
  const selectedCategories = useFilterCategories()
  const selectedSkus = useFilterSkus()
  const selectedCities = useFilterCities()
  const selectedDarkStores = useFilterDarkStores()
  
  return useMemo(() => {
    // Helper to check if current platform matches
    const isPlatformSelected = (platformId: string) =>
      platformId === currentPlatform
    
    // Helper to check if a brand is selected
    const isBrandSelected = (brandId: string) =>
      selectedBrands.length === 0 || 
      selectedBrands.includes(brandId)
    
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
    
    // Helper to check if a dark store is selected
    const isDarkStoreSelected = (storeId: string) =>
      selectedDarkStores.length === 0 || 
      selectedDarkStores.includes(storeId)
    
    // Get filtered SKUs based on brand and category selection
    const getFilteredSkus = () => {
      let filteredSkus = aashirvaaProducts
      
      if (selectedBrands.length > 0) {
        filteredSkus = filteredSkus.filter(product =>
          selectedBrands.includes(product.brandId)
        )
      }
      
      if (selectedCategories.length > 0) {
        filteredSkus = filteredSkus.filter(product =>
          selectedCategories.includes(product.category)
        )
      }
      
      return filteredSkus
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
    
    // Get filtered dark stores based on city and current platform selection
    const getFilteredDarkStores = () => {
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
    
    return {
      isPlatformSelected,
      isBrandSelected,
      isCategorySelected,
      isSkuSelected,
      isCitySelected,
      isDarkStoreSelected,
      getFilteredSkus,
      getFilteredCities,
      getFilteredDarkStores,
    }
  }, [currentPlatform, selectedBrands, selectedCategories, selectedSkus, selectedCities, selectedDarkStores])
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