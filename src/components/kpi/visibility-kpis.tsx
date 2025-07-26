import { KpiCard, KpiCardGrid, type KpiData } from '@/components/ui/kpi-card'
import { 
  ShareOfVoiceIcon, 
  SearchRankingIcon, 
  VisibilityIcon, 
  AdOrganicMixIcon 
} from '@/components/icons/kpi-icons'
import { useFilteredData, useCurrentPlatform, useFilterBrands, useFilterCategories, useFilterSkus, useFilterCities, useFilterKeywords, useFilterDateRange } from '@/stores/filterStore'
import { useMemo } from 'react'

// Mock data for visibility KPIs
export const visibilityKpiData: Record<string, KpiData> = {
  shareOfVoice: {
    title: 'Share of Voice (SOV)',
    value: 23.8,
    unit: '%',
    trend: {
      direction: 'up',
      percentage: 4.2,
      period: 'last month'
    },
    status: 'good',
    icon: <ShareOfVoiceIcon />,
    description: 'Voice share in atta category',
    target: 25
  },
  averageSearchRanking: {
    title: 'Average Search Ranking',
    value: 2.4,
    trend: {
      direction: 'down',
      percentage: 12.5,
      period: 'last week'
    },
    status: 'good',
    icon: <SearchRankingIcon />,
    description: 'Average position in search results',
    target: 3
  },
  visibilityConsistency: {
    title: 'Visibility Consistency',
    value: 91.3,
    unit: '%',
    trend: {
      direction: 'up',
      percentage: 2.8,
      period: 'last month'
    },
    status: 'good',
    icon: <VisibilityIcon />,
    description: 'Keywords ranking in top 5',
    target: 90
  },
  adOrganicMix: {
    title: 'Ad vs Organic Mix',
    value: 65.2,
    unit: '% organic',
    trend: {
      direction: 'neutral',
      percentage: 0.8,
      period: 'last week'
    },
    status: 'neutral',
    icon: <AdOrganicMixIcon />,
    description: 'Organic vs paid visibility ratio',
    target: 70
  }
}

// Individual KPI Card Components
export function ShareOfVoiceCard() {
  return <KpiCard data={visibilityKpiData.shareOfVoice} />
}

export function AverageSearchRankingCard() {
  return <KpiCard data={visibilityKpiData.averageSearchRanking} />
}

export function VisibilityConsistencyCard() {
  return <KpiCard data={visibilityKpiData.visibilityConsistency} />
}

export function AdOrganicMixCard() {
  return <KpiCard data={visibilityKpiData.adOrganicMix} />
}

// Helper function to calculate filtered KPI data
function useFilteredVisibilityKpis() {
  const currentPlatform = useCurrentPlatform()
  const selectedBrands = useFilterBrands()
  const selectedCategories = useFilterCategories()
  const selectedSkus = useFilterSkus()
  const selectedCities = useFilterCities()
  const selectedKeywords = useFilterKeywords()
  const dateRange = useFilterDateRange()
  
  const { isPlatformSelected, isCategorySelected, isSkuSelected, isCitySelected } = useFilteredData()
  
  return useMemo(() => {
    // Apply filters to calculate new KPI values
    let shareOfVoice = 23.8
    let averageSearchRanking = 2.4
    let visibilityConsistency = 91.3
    let adOrganicMix = 65.2
    
    // Adjust based on current platform
    if (currentPlatform === 'blinkit') {
      shareOfVoice = 26.2
      averageSearchRanking = 2.1
      visibilityConsistency = 93.5
      adOrganicMix = 68.3
    } else if (currentPlatform === 'swiggy-instamart') {
      shareOfVoice = 22.8
      averageSearchRanking = 2.5
      visibilityConsistency = 89.7
      adOrganicMix = 63.1
    } else if (currentPlatform === 'zepto') {
      shareOfVoice = 22.4
      averageSearchRanking = 2.6
      visibilityConsistency = 90.8
      adOrganicMix = 64.2
    }
    
    // Adjust based on category/SKU filters
    if ((selectedCategories && selectedCategories.length > 0) || (selectedSkus && selectedSkus.length > 0)) {
      if (selectedCategories && selectedCategories.includes('atta')) {
        shareOfVoice = 28.3 // Strong in atta category
        averageSearchRanking = 1.8
        visibilityConsistency = 94.2
      } else if (selectedCategories && selectedCategories.includes('ready-to-eat')) {
        shareOfVoice = 16.7 // Weaker in ready-to-eat
        averageSearchRanking = 3.2
        visibilityConsistency = 87.5
      } else if (selectedCategories && selectedCategories.includes('spices')) {
        shareOfVoice = 9.2 // Challenging spices category
        averageSearchRanking = 6.8
        visibilityConsistency = 78.3
      } else if (selectedCategories && selectedCategories.includes('salt-sugar')) {
        shareOfVoice = 12.8 // Moderate in salt & sugar
        averageSearchRanking = 4.2
        visibilityConsistency = 85.7
      }
    }
    
    // Adjust based on keyword filters (visibility tab specific)
    if (selectedKeywords.length > 0) {
      // When specific keywords are selected, metrics are more focused
      if (selectedKeywords.includes('atta') || selectedKeywords.includes('whole wheat atta')) {
        shareOfVoice = Math.min(shareOfVoice * 1.2, 35.6)
        averageSearchRanking = Math.max(averageSearchRanking * 0.7, 1.0)
        visibilityConsistency = Math.min(visibilityConsistency + 3, 95)
      } else if (selectedKeywords.includes('instant poha') || selectedKeywords.includes('instant upma')) {
        shareOfVoice = shareOfVoice * 0.7
        averageSearchRanking = averageSearchRanking * 1.3
        visibilityConsistency = visibilityConsistency - 5
      } else if (selectedKeywords.includes('turmeric powder') || selectedKeywords.includes('chilli powder')) {
        shareOfVoice = shareOfVoice * 0.4
        averageSearchRanking = averageSearchRanking * 2.8
        visibilityConsistency = visibilityConsistency - 12
      }
    }
    
    // Adjust based on city filters
    if (selectedCities.length > 0 && selectedCities.length < 5) {
      // Different cities have different search behaviors
      if (selectedCities.includes('mumbai') || selectedCities.includes('delhi')) {
        // Metro cities have more competition
        shareOfVoice = shareOfVoice * 0.95
        averageSearchRanking = averageSearchRanking * 1.1
      } else if (selectedCities.includes('bangalore')) {
        // Tech-savvy city with different search patterns
        adOrganicMix = adOrganicMix + 3.2
      }
    }
    
    return {
      shareOfVoice: {
        ...visibilityKpiData.shareOfVoice,
        value: Number(shareOfVoice.toFixed(1))
      },
      averageSearchRanking: {
        ...visibilityKpiData.averageSearchRanking,
        value: Number(averageSearchRanking.toFixed(1))
      },
      visibilityConsistency: {
        ...visibilityKpiData.visibilityConsistency,
        value: Number(visibilityConsistency.toFixed(1))
      },
      adOrganicMix: {
        ...visibilityKpiData.adOrganicMix,
        value: Number(adOrganicMix.toFixed(1))
      }
    }
  }, [currentPlatform, selectedCategories, selectedSkus, selectedCities, selectedKeywords, dateRange, isPlatformSelected, isCategorySelected, isSkuSelected, isCitySelected])
}

// Individual KPI Card Components with filtering
export function FilteredShareOfVoiceCard() {
  const filteredData = useFilteredVisibilityKpis()
  return <KpiCard data={filteredData.shareOfVoice} />
}

export function FilteredAverageSearchRankingCard() {
  const filteredData = useFilteredVisibilityKpis()
  return <KpiCard data={filteredData.averageSearchRanking} />
}

export function FilteredVisibilityConsistencyCard() {
  const filteredData = useFilteredVisibilityKpis()
  return <KpiCard data={filteredData.visibilityConsistency} />
}

export function FilteredAdOrganicMixCard() {
  const filteredData = useFilteredVisibilityKpis()
  return <KpiCard data={filteredData.adOrganicMix} />
}

// Combined grid component for visibility dashboard
export function VisibilityKpiGrid() {
  return (
    <KpiCardGrid>
      <FilteredShareOfVoiceCard />
      <FilteredAverageSearchRankingCard />
      <FilteredVisibilityConsistencyCard />
      <FilteredAdOrganicMixCard />
    </KpiCardGrid>
  )
}

// Platform-specific visibility data
export const platformVisibilityData = {
  blinkit: {
    shareOfVoice: 26.2,
    avgRanking: 2.1,
    consistency: 93.5,
    organicMix: 68.3
  },
  swiggyInstamart: {
    shareOfVoice: 22.8,
    avgRanking: 2.5,
    consistency: 89.7,
    organicMix: 63.1
  },
  zepto: {
    shareOfVoice: 22.4,
    avgRanking: 2.6,
    consistency: 90.8,
    organicMix: 64.2
  }
}

// Keyword performance data
export const keywordPerformanceData = [
  {
    keyword: 'atta',
    ranking: 1,
    searchVolume: 125000,
    shareOfVoice: 28.5,
    competitorShare: {
      'Fortune': 22.1,
      'Tata Sampann': 18.3,
      'Patanjali': 15.2
    },
    trend: 'up'
  },
  {
    keyword: 'wheat flour',
    ranking: 2,
    searchVolume: 89000,
    shareOfVoice: 31.2,
    competitorShare: {
      'Fortune': 25.8,
      'Tata Sampann': 19.5,
      'Patanjali': 12.3
    },
    trend: 'up'
  },
  {
    keyword: 'whole wheat atta',
    ranking: 1,
    searchVolume: 67000,
    shareOfVoice: 35.6,
    competitorShare: {
      'Fortune': 28.2,
      'Tata Sampann': 17.8,
      'Patanjali': 9.4
    },
    trend: 'stable'
  },
  {
    keyword: 'multigrain atta',
    ranking: 3,
    searchVolume: 45000,
    shareOfVoice: 19.8,
    competitorShare: {
      'Fortune': 32.5,
      'Tata Sampann': 24.1,
      'Patanjali': 14.2
    },
    trend: 'down'
  },
  {
    keyword: 'atta 5kg',
    ranking: 2,
    searchVolume: 78000,
    shareOfVoice: 26.3,
    competitorShare: {
      'Fortune': 24.7,
      'Tata Sampann': 21.2,
      'Patanjali': 16.8
    },
    trend: 'up'
  },
  {
    keyword: 'instant poha',
    ranking: 4,
    searchVolume: 32000,
    shareOfVoice: 15.2,
    competitorShare: {
      'MTR': 35.8,
      'Haldirams': 28.5,
      'Patanjali': 12.1
    },
    trend: 'stable'
  },
  {
    keyword: 'turmeric powder',
    ranking: 6,
    searchVolume: 56000,
    shareOfVoice: 8.9,
    competitorShare: {
      'MDH': 42.3,
      'Everest': 28.7,
      'Patanjali': 11.2
    },
    trend: 'down'
  }
]

// Search ranking trends over time
export const searchRankingTrends = [
  { date: '2024-01-01', avgRanking: 2.8, topKeywords: 12, organicTraffic: 45200 },
  { date: '2024-01-08', avgRanking: 2.6, topKeywords: 14, organicTraffic: 48100 },
  { date: '2024-01-15', avgRanking: 2.5, topKeywords: 15, organicTraffic: 51300 },
  { date: '2024-01-22', avgRanking: 2.3, topKeywords: 17, organicTraffic: 54700 },
  { date: '2024-01-29', avgRanking: 2.4, topKeywords: 16, organicTraffic: 52900 }
]

// Competitor visibility analysis
export const competitorVisibilityAnalysis = [
  {
    competitor: 'Fortune',
    shareOfVoice: 25.8,
    avgRanking: 2.2,
    topKeywords: 18,
    strongIn: ['premium atta', 'health flour', 'organic atta'],
    weakIn: ['instant foods', 'spices']
  },
  {
    competitor: 'Tata Sampann',
    shareOfVoice: 19.3,
    avgRanking: 2.7,
    topKeywords: 14,
    strongIn: ['spices', 'dal', 'ready-to-cook'],
    weakIn: ['basic atta', 'salt']
  },
  {
    competitor: 'Patanjali',
    shareOfVoice: 14.7,
    avgRanking: 3.1,
    topKeywords: 11,
    strongIn: ['ayurvedic', 'natural', 'value atta'],
    weakIn: ['premium products', 'instant foods']
  },
  {
    competitor: 'MDH',
    shareOfVoice: 12.1,
    avgRanking: 2.9,
    topKeywords: 8,
    strongIn: ['spices', 'masala', 'traditional'],
    weakIn: ['atta', 'flour', 'salt']
  }
]

// Brand mention and sentiment data
export const brandMentionData = [
  {
    platform: 'Search Results',
    mentions: 12400,
    sentiment: 78.5,
    growth: 12.3,
    topMentions: ['quality atta', 'trusted brand', 'good taste']
  },
  {
    platform: 'Social Media',
    mentions: 8900,
    sentiment: 82.1,
    growth: 18.7,
    topMentions: ['healthy choice', 'family brand', 'recipe inspiration']
  },
  {
    platform: 'Reviews',
    mentions: 5600,
    sentiment: 85.3,
    growth: 9.2,
    topMentions: ['excellent quality', 'fresh packaging', 'value for money']
  },
  {
    platform: 'Forums',
    mentions: 2800,
    sentiment: 76.8,
    growth: 6.5,
    topMentions: ['cooking tips', 'product comparison', 'availability']
  }
]

// Visibility by category and SKU
export const categoryVisibilityData = [
  {
    category: 'Atta',
    shareOfVoice: 28.3,
    topSku: 'Whole Wheat Atta 5kg',
    skuVisibility: [
      { name: 'Whole Wheat Atta 5kg', ranking: 1, shareOfVoice: 35.6 },
      { name: 'Whole Wheat Atta 10kg', ranking: 2, shareOfVoice: 28.4 },
      { name: 'Multigrain Atta 5kg', ranking: 3, shareOfVoice: 19.8 }
    ]
  },
  {
    category: 'Ready-to-Eat',
    shareOfVoice: 16.7,
    topSku: 'Instant Upma',
    skuVisibility: [
      { name: 'Instant Upma', ranking: 3, shareOfVoice: 18.2 },
      { name: 'Instant Poha', ranking: 4, shareOfVoice: 15.2 },
      { name: 'Instant Khichdi', ranking: 5, shareOfVoice: 12.1 }
    ]
  },
  {
    category: 'Spices',
    shareOfVoice: 9.2,
    topSku: 'Turmeric Powder',
    skuVisibility: [
      { name: 'Turmeric Powder', ranking: 6, shareOfVoice: 8.9 },
      { name: 'Chilli Powder', ranking: 7, shareOfVoice: 7.8 },
      { name: 'Coriander Powder', ranking: 8, shareOfVoice: 6.5 }
    ]
  },
  {
    category: 'Salt & Sugar',
    shareOfVoice: 12.8,
    topSku: 'Iodized Salt',
    skuVisibility: [
      { name: 'Iodized Salt', ranking: 4, shareOfVoice: 14.2 },
      { name: 'Crystal Salt', ranking: 5, shareOfVoice: 11.4 }
    ]
  }
]