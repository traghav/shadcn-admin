import { KpiCard, KpiCardGrid, type KpiData } from '@/components/ui/kpi-card'
import { 
  PriceIndexIcon, 
  PriceChangeIcon, 
  CompetitivenessIcon, 
  RevenueImpactIcon 
} from '@/components/icons/kpi-icons'
import { useFilteredData, useCurrentPlatform, useFilterBrands, useFilterCategories, useFilterSkus, useFilterCities, useFilterDateRange } from '@/stores/filterStore'
import { useMemo } from 'react'

// Mock data for pricing KPIs
export const pricingKpiData: Record<string, KpiData> = {
  averagePriceIndex: {
    title: 'Average Price Index',
    value: 102.3,
    trend: {
      direction: 'up',
      percentage: 1.8,
      period: 'last month'
    },
    status: 'neutral',
    icon: <PriceIndexIcon />,
    description: 'Relative to market baseline (100)',
    target: 100
  },
  priceChangeFrequency: {
    title: 'Price Change Frequency',
    value: 127,
    unit: 'changes',
    trend: {
      direction: 'down',
      percentage: 8.2,
      period: 'last month'
    },
    status: 'good',
    icon: <PriceChangeIcon />,
    description: 'Price adjustments across all SKUs',
    target: 120
  },
  priceCompetitiveness: {
    title: 'Price Competitiveness',
    value: 89.4,
    unit: '%',
    trend: {
      direction: 'up',
      percentage: 3.1,
      period: 'last week'
    },
    status: 'good',
    icon: <CompetitivenessIcon />,
    description: 'SKUs priced competitively vs rivals',
    target: 85
  },
  revenueImpact: {
    title: 'Revenue Impact',
    value: 12.6,
    unit: 'M',
    trend: {
      direction: 'up',
      percentage: 15.3,
      period: 'last month'
    },
    status: 'good',
    icon: <RevenueImpactIcon />,
    description: 'Price optimization impact (₹)',
    target: 15
  }
}

// Individual KPI Card Components
export function AveragePriceIndexCard() {
  return <KpiCard data={pricingKpiData.averagePriceIndex} />
}

export function PriceChangeFrequencyCard() {
  return <KpiCard data={pricingKpiData.priceChangeFrequency} />
}

export function PriceCompetitivenessCard() {
  return <KpiCard data={pricingKpiData.priceCompetitiveness} />
}

export function RevenueImpactCard() {
  return <KpiCard data={pricingKpiData.revenueImpact} />
}

// Helper function to calculate filtered KPI data
function useFilteredPricingKpis() {
  const currentPlatform = useCurrentPlatform()
  const selectedBrands = useFilterBrands()
  const selectedCategories = useFilterCategories()
  const selectedSkus = useFilterSkus()
  const selectedCities = useFilterCities()
  const dateRange = useFilterDateRange()
  
  const { isPlatformSelected, isCategorySelected, isSkuSelected, isCitySelected } = useFilteredData()
  
  return useMemo(() => {
    // Apply filters to calculate new KPI values
    let averagePriceIndex = 102.3
    let priceChangeFrequency = 127
    let priceCompetitiveness = 89.4
    let revenueImpact = 12.6
    
    // Adjust based on current platform
    if (currentPlatform === 'blinkit') {
      averagePriceIndex = 104.1
      priceCompetitiveness = 87.2
      priceChangeFrequency = 42
      revenueImpact = 3.2
    } else if (currentPlatform === 'swiggy-instamart') {
      averagePriceIndex = 101.8
      priceCompetitiveness = 89.8
      priceChangeFrequency = 38
      revenueImpact = 2.8
    } else if (currentPlatform === 'zepto') {
      averagePriceIndex = 100.9
      priceCompetitiveness = 91.1
      priceChangeFrequency = 47
      revenueImpact = 2.4
    }
    
    // Adjust based on category/SKU filters
    if ((selectedCategories && selectedCategories.length > 0) || (selectedSkus && selectedSkus.length > 0)) {
      // When filtering by specific categories/SKUs, competitiveness typically varies
      if (selectedCategories.includes('atta')) {
        averagePriceIndex = 100.2 // Atta is competitively priced
        priceCompetitiveness = 92.1
      } else if (selectedCategories.includes('spices')) {
        averagePriceIndex = 97.8 // Spices are very competitive
        priceCompetitiveness = 94.3
      } else if (selectedCategories.includes('ready-to-eat')) {
        averagePriceIndex = 96.5 // Ready-to-eat is aggressively priced
        priceCompetitiveness = 95.8
      }
      
      // Reduced changes when filtering specific products
      priceChangeFrequency = Math.round(priceChangeFrequency * 0.6)
      revenueImpact = revenueImpact * 1.15 // Better targeting increases impact
    }
    
    // Adjust based on city filters  
    if (selectedCities.length > 0 && selectedCities.length < 5) {
      // Different cities have different pricing dynamics
      if (selectedCities.includes('mumbai') || selectedCities.includes('delhi')) {
        averagePriceIndex = averagePriceIndex + 1.2 // Premium cities
      } else if (selectedCities.includes('bangalore') || selectedCities.includes('hyderabad')) {
        averagePriceIndex = averagePriceIndex - 0.8 // More competitive cities
      }
      
      revenueImpact = revenueImpact * (selectedCities.length / 5)
    }
    
    return {
      averagePriceIndex: {
        ...pricingKpiData.averagePriceIndex,
        value: Number(averagePriceIndex.toFixed(1))
      },
      priceChangeFrequency: {
        ...pricingKpiData.priceChangeFrequency,
        value: Math.round(priceChangeFrequency)
      },
      priceCompetitiveness: {
        ...pricingKpiData.priceCompetitiveness,
        value: Number(priceCompetitiveness.toFixed(1))
      },
      revenueImpact: {
        ...pricingKpiData.revenueImpact,
        value: Number(revenueImpact.toFixed(1))
      }
    }
  }, [currentPlatform, selectedCategories, selectedSkus, selectedCities, dateRange, isPlatformSelected, isCategorySelected, isSkuSelected, isCitySelected])
}

// Individual KPI Card Components with filtering
export function FilteredAveragePriceIndexCard() {
  const filteredData = useFilteredPricingKpis()
  return <KpiCard data={filteredData.averagePriceIndex} />
}

export function FilteredPriceChangeFrequencyCard() {
  const filteredData = useFilteredPricingKpis()
  return <KpiCard data={filteredData.priceChangeFrequency} />
}

export function FilteredPriceCompetitivenessCard() {
  const filteredData = useFilteredPricingKpis()
  return <KpiCard data={filteredData.priceCompetitiveness} />
}

export function FilteredRevenueImpactCard() {
  const filteredData = useFilteredPricingKpis()
  return <KpiCard data={filteredData.revenueImpact} />
}

// Combined grid component for pricing dashboard
export function PricingKpiGrid() {
  return (
    <KpiCardGrid>
      <FilteredAveragePriceIndexCard />
      <FilteredPriceChangeFrequencyCard />
      <FilteredPriceCompetitivenessCard />
      <FilteredRevenueImpactCard />
    </KpiCardGrid>
  )
}

// Platform-specific pricing data
export const platformPricingData = {
  blinkit: {
    priceIndex: 104.1,
    avgPrice: 285.50,
    competitiveness: 87.2,
    changes: 42
  },
  swiggyInstamart: {
    priceIndex: 101.8,
    avgPrice: 278.20,
    competitiveness: 89.8,
    changes: 38
  },
  zepto: {
    priceIndex: 100.9,
    avgPrice: 275.80,
    competitiveness: 91.1,
    changes: 47
  }
}

// SKU-specific pricing data for brand products
export const skuPricingData = [
  {
    sku: 'Whole Wheat Atta 5kg',
    currentPrice: 315,
    competitorAvg: 318,
    priceIndex: 99.1,
    competitiveness: 'High',
    lastChanged: '2024-01-15',
    platforms: [
      { name: 'Blinkit', price: 318 },
      { name: 'Swiggy Instamart', price: 315 },
      { name: 'Zepto', price: 312 }
    ],
    competitors: [
      { name: 'Fortune', price: 322 },
      { name: 'Tata Sampann', price: 319 },
      { name: 'Patanjali', price: 295 }
    ]
  },
  {
    sku: 'Whole Wheat Atta 10kg',
    currentPrice: 595,
    competitorAvg: 605,
    priceIndex: 98.3,
    competitiveness: 'High',
    lastChanged: '2024-01-12',
    platforms: [
      { name: 'Blinkit', price: 598 },
      { name: 'Swiggy Instamart', price: 595 },
      { name: 'Zepto', price: 592 }
    ],
    competitors: [
      { name: 'Fortune', price: 615 },
      { name: 'Tata Sampann', price: 608 },
      { name: 'Patanjali', price: 585 }
    ]
  },
  {
    sku: 'Multigrain Atta 5kg',
    currentPrice: 385,
    competitorAvg: 375,
    priceIndex: 102.7,
    competitiveness: 'Medium',
    lastChanged: '2024-01-18',
    platforms: [
      { name: 'Blinkit', price: 388 },
      { name: 'Swiggy Instamart', price: 385 },
      { name: 'Zepto', price: 382 }
    ],
    competitors: [
      { name: 'Fortune', price: 378 },
      { name: 'Tata Sampann', price: 372 },
      { name: 'Patanjali', price: 375 }
    ]
  },
  {
    sku: 'Instant Poha',
    currentPrice: 65,
    competitorAvg: 68,
    priceIndex: 95.6,
    competitiveness: 'High',
    lastChanged: '2024-01-20',
    platforms: [
      { name: 'Blinkit', price: 67 },
      { name: 'Swiggy Instamart', price: 65 },
      { name: 'Zepto', price: 63 }
    ],
    competitors: [
      { name: 'MTR', price: 72 },
      { name: 'Haldirams', price: 68 },
      { name: 'Patanjali', price: 64 }
    ]
  },
  {
    sku: 'Turmeric Powder',
    currentPrice: 145,
    competitorAvg: 152,
    priceIndex: 95.4,
    competitiveness: 'High',
    lastChanged: '2024-01-16',
    platforms: [
      { name: 'Blinkit', price: 148 },
      { name: 'Swiggy Instamart', price: 145 },
      { name: 'Zepto', price: 142 }
    ],
    competitors: [
      { name: 'MDH', price: 155 },
      { name: 'Everest', price: 150 },
      { name: 'Patanjali', price: 148 }
    ]
  }
]

// Price trend data for charts
export const priceTrendData = [
  { date: '2024-01-01', avgPrice: 278.50, competitorAvg: 285.20 },
  { date: '2024-01-08', avgPrice: 280.10, competitorAvg: 286.50 },
  { date: '2024-01-15', avgPrice: 282.30, competitorAvg: 287.80 },
  { date: '2024-01-22', avgPrice: 281.90, competitorAvg: 289.10 },
  { date: '2024-01-29', avgPrice: 283.20, competitorAvg: 290.30 }
]

// Price elasticity data
export const priceElasticityData = [
  {
    sku: 'Whole Wheat Atta 5kg',
    elasticity: -1.2,
    optimalPrice: 312,
    currentPrice: 315,
    revenueImpact: '+2.3%'
  },
  {
    sku: 'Multigrain Atta 5kg',
    elasticity: -0.8,
    optimalPrice: 378,
    currentPrice: 385,
    revenueImpact: '+1.8%'
  },
  {
    sku: 'Instant Poha',
    elasticity: -1.5,
    optimalPrice: 67,
    currentPrice: 65,
    revenueImpact: '-0.5%'
  },
  {
    sku: 'Turmeric Powder',
    elasticity: -0.9,
    optimalPrice: 148,
    currentPrice: 145,
    revenueImpact: '+1.1%'
  }
]

// Competitor pricing intelligence
export const competitorAnalysis = [
  {
    competitor: 'Fortune',
    avgPriceIndex: 105.2,
    priceChanges: 89,
    competitive: 67,
    strategies: ['Premium positioning', 'Selective discounting']
  },
  {
    competitor: 'Tata Sampann',
    avgPriceIndex: 103.8,
    priceChanges: 76,
    competitive: 72,
    strategies: ['Market matching', 'Bundle offers']
  },
  {
    competitor: 'Patanjali',
    avgPriceIndex: 91.5,
    priceChanges: 124,
    competitive: 89,
    strategies: ['Value pricing', 'Aggressive promotions']
  },
  {
    competitor: 'MDH',
    avgPriceIndex: 108.1,
    priceChanges: 45,
    competitive: 58,
    strategies: ['Premium only', 'Brand premium']
  }
]