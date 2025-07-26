import { KpiCard, KpiCardGrid, type KpiData } from '@/components/ui/kpi-card'
import { 
  AvailabilityIcon, 
  OutOfStockIcon, 
  StoreCoverageIcon, 
  ConsistencyIcon 
} from '@/components/icons/kpi-icons'
import { useFilteredData, useCurrentPlatform, useFilterBrands, useFilterCategories, useFilterSkus, useFilterCities, useFilterDateRange } from '@/stores/filterStore'
import { useMemo } from 'react'

// Mock data for availability KPIs
export const availabilityKpiData: Record<string, KpiData> = {
  overallAvailability: {
    title: 'Overall Availability Rate',
    value: 94.2,
    unit: '%',
    trend: {
      direction: 'up',
      percentage: 2.1,
      period: 'last month'
    },
    status: 'good',
    icon: <AvailabilityIcon />,
    description: 'Across all platforms and SKUs',
    target: 95
  },
  outOfStockSkus: {
    title: 'Out-of-Stock SKUs',
    value: 23,
    trend: {
      direction: 'down',
      percentage: 15.2,
      period: 'last week'
    },
    status: 'good',
    icon: <OutOfStockIcon />,
    description: 'Currently unavailable products',
    target: 20
  },
  storeCoverage: {
    title: 'Store Coverage',
    value: 847,
    unit: 'stores',
    trend: {
      direction: 'up',
      percentage: 5.8,
      period: 'last month'
    },
    status: 'good',
    icon: <StoreCoverageIcon />,
    description: 'Stores carrying Aashirvaad products',
    target: 900
  },
  availabilityConsistency: {
    title: 'Availability Consistency',
    value: 87.5,
    unit: '%',
    trend: {
      direction: 'up',
      percentage: 1.2,
      period: 'last week'
    },
    status: 'warning',
    icon: <ConsistencyIcon />,
    description: 'SKUs available >90% of time',
    target: 90
  }
}

// Individual KPI Card Components
export function OverallAvailabilityCard() {
  return <KpiCard data={availabilityKpiData.overallAvailability} />
}

export function OutOfStockSkusCard() {
  return <KpiCard data={availabilityKpiData.outOfStockSkus} />
}

export function StoreCoverageCard() {
  return <KpiCard data={availabilityKpiData.storeCoverage} />
}

export function AvailabilityConsistencyCard() {
  return <KpiCard data={availabilityKpiData.availabilityConsistency} />
}

// Helper function to calculate filtered KPI data
function useFilteredAvailabilityKpis() {
  const currentPlatform = useCurrentPlatform()
  const selectedBrands = useFilterBrands()
  const selectedCategories = useFilterCategories()
  const selectedSkus = useFilterSkus()
  const selectedCities = useFilterCities()
  const dateRange = useFilterDateRange()
  
  const { isPlatformSelected, isCategorySelected, isSkuSelected, isCitySelected } = useFilteredData()
  
  return useMemo(() => {
    // Apply filters to calculate new KPI values
    // For demo purposes, we'll adjust values based on filter selections
    
    let overallAvailability = 94.2
    let outOfStockSkus = 23
    let storeCoverage = 847
    let availabilityConsistency = 87.5
    
    // Adjust based on current platform
    if (currentPlatform === 'blinkit') {
      overallAvailability = 96.1
      outOfStockSkus = 8
      storeCoverage = 295
      availabilityConsistency = 89.2
    } else if (currentPlatform === 'swiggy-instamart') {
      overallAvailability = 93.8
      outOfStockSkus = 12
      storeCoverage = 276
      availabilityConsistency = 85.7
    } else if (currentPlatform === 'zepto') {
      overallAvailability = 92.7
      outOfStockSkus = 3
      storeCoverage = 276
      availabilityConsistency = 87.9
    }
    
    // Adjust based on category/SKU filters
    if ((selectedCategories && selectedCategories.length > 0) || (selectedSkus && selectedSkus.length > 0)) {
      // When filtering by specific categories/SKUs, availability typically improves
      overallAvailability = Math.min(overallAvailability + 2.1, 99.5)
      outOfStockSkus = Math.max(Math.round(outOfStockSkus * 0.7), 1)
      availabilityConsistency = Math.min(availabilityConsistency + 1.8, 95)
    }
    
    // Adjust based on city filters
    if (selectedCities.length > 0 && selectedCities.length < 5) {
      const cityMultiplier = selectedCities.length / 5
      storeCoverage = Math.round(storeCoverage * cityMultiplier)
      
      // Different cities have different performance characteristics
      if (selectedCities.includes('mumbai')) {
        overallAvailability = Math.max(overallAvailability, 95.8)
      } else if (selectedCities.includes('chennai')) {
        overallAvailability = Math.min(overallAvailability, 91.4)
      }
    }
    
    return {
      overallAvailability: {
        ...availabilityKpiData.overallAvailability,
        value: Number(overallAvailability.toFixed(1))
      },
      outOfStockSkus: {
        ...availabilityKpiData.outOfStockSkus,
        value: outOfStockSkus
      },
      storeCoverage: {
        ...availabilityKpiData.storeCoverage,
        value: storeCoverage
      },
      availabilityConsistency: {
        ...availabilityKpiData.availabilityConsistency,
        value: Number(availabilityConsistency.toFixed(1))
      }
    }
  }, [currentPlatform, selectedCategories, selectedSkus, selectedCities, dateRange, isPlatformSelected, isCategorySelected, isSkuSelected, isCitySelected])
}

// Individual KPI Card Components with filtering
export function FilteredOverallAvailabilityCard() {
  const filteredData = useFilteredAvailabilityKpis()
  return <KpiCard data={filteredData.overallAvailability} />
}

export function FilteredOutOfStockSkusCard() {
  const filteredData = useFilteredAvailabilityKpis()
  return <KpiCard data={filteredData.outOfStockSkus} />
}

export function FilteredStoreCoverageCard() {
  const filteredData = useFilteredAvailabilityKpis()
  return <KpiCard data={filteredData.storeCoverage} />
}

export function FilteredAvailabilityConsistencyCard() {
  const filteredData = useFilteredAvailabilityKpis()
  return <KpiCard data={filteredData.availabilityConsistency} />
}

// Combined grid component for availability dashboard
export function AvailabilityKpiGrid() {
  return (
    <KpiCardGrid>
      <FilteredOverallAvailabilityCard />
      <FilteredOutOfStockSkusCard />
      <FilteredStoreCoverageCard />
      <FilteredAvailabilityConsistencyCard />
    </KpiCardGrid>
  )
}

// Platform-specific availability data
export const platformAvailabilityData = {
  blinkit: {
    availability: 96.1,
    outOfStock: 8,
    stores: 312,
    consistency: 89.2
  },
  swiggyInstamart: {
    availability: 93.8,
    outOfStock: 12,
    stores: 268,
    consistency: 85.7
  },
  zepto: {
    availability: 92.7,
    outOfStock: 3,
    stores: 267,
    consistency: 87.9
  }
}

// SKU-specific availability data for Aashirvaad products
export const skuAvailabilityData = [
  {
    sku: 'Whole Wheat Atta 5kg',
    availability: 97.2,
    outOfStockDays: 2,
    platforms: ['Blinkit', 'Swiggy Instamart', 'Zepto'],
    category: 'Atta'
  },
  {
    sku: 'Whole Wheat Atta 10kg',
    availability: 94.8,
    outOfStockDays: 4,
    platforms: ['Blinkit', 'Swiggy Instamart'],
    category: 'Atta'
  },
  {
    sku: 'Multigrain Atta 5kg',
    availability: 91.5,
    outOfStockDays: 6,
    platforms: ['Blinkit', 'Zepto'],
    category: 'Atta'
  },
  {
    sku: 'Instant Poha',
    availability: 88.3,
    outOfStockDays: 8,
    platforms: ['Swiggy Instamart', 'Zepto'],
    category: 'Ready-to-Eat'
  },
  {
    sku: 'Instant Upma',
    availability: 92.1,
    outOfStockDays: 5,
    platforms: ['Blinkit', 'Swiggy Instamart'],
    category: 'Ready-to-Eat'
  },
  {
    sku: 'Turmeric Powder',
    availability: 95.7,
    outOfStockDays: 3,
    platforms: ['Blinkit', 'Swiggy Instamart', 'Zepto'],
    category: 'Spices'
  },
  {
    sku: 'Chilli Powder',
    availability: 93.4,
    outOfStockDays: 4,
    platforms: ['Blinkit', 'Zepto'],
    category: 'Spices'
  },
  {
    sku: 'Iodized Salt',
    availability: 98.1,
    outOfStockDays: 1,
    platforms: ['Blinkit', 'Swiggy Instamart', 'Zepto'],
    category: 'Salt & Sugar'
  }
]

// City-wise availability data
export const cityAvailabilityData = [
  {
    city: 'Mumbai',
    availability: 95.8,
    stores: 185,
    darkStores: 22,
    topPerformingSkus: ['Whole Wheat Atta 5kg', 'Iodized Salt', 'Turmeric Powder']
  },
  {
    city: 'Delhi',
    availability: 94.2,
    stores: 167,
    darkStores: 20,
    topPerformingSkus: ['Whole Wheat Atta 5kg', 'Whole Wheat Atta 10kg', 'Chilli Powder']
  },
  {
    city: 'Bangalore',
    availability: 93.1,
    stores: 142,
    darkStores: 18,
    topPerformingSkus: ['Multigrain Atta 5kg', 'Instant Upma', 'Turmeric Powder']
  },
  {
    city: 'Hyderabad',
    availability: 92.7,
    stores: 98,
    darkStores: 15,
    topPerformingSkus: ['Instant Poha', 'Whole Wheat Atta 5kg', 'Iodized Salt']
  },
  {
    city: 'Chennai',
    availability: 91.4,
    stores: 85,
    darkStores: 12,
    topPerformingSkus: ['Instant Upma', 'Turmeric Powder', 'Chilli Powder']
  }
]