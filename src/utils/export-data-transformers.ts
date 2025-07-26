import { ExportData } from './export-utils'

// Availability data transformers
export const transformAvailabilityData = (rawData?: any): ExportData => {
  // Mock availability data structure - in real app, this would come from API
  const headers = [
    'Platform',
    'City',
    'SKU',
    'Availability %',
    'Stock Level',
    'Last Updated',
    'Status'
  ]

  const mockData = [
    ['Blinkit', 'Mumbai', 'Whole Wheat Atta 5kg', '95', 'High', '2 hours ago', 'In Stock'],
    ['Blinkit', 'Mumbai', 'Instant Poha', '88', 'Medium', '4 hours ago', 'In Stock'],
    ['Swiggy Instamart', 'Delhi', 'Whole Wheat Atta 5kg', '92', 'High', '1 hour ago', 'In Stock'],
    ['Swiggy Instamart', 'Delhi', 'Turmeric Powder', '45', 'Low', '6 hours ago', 'Low Stock'],
    ['Zepto', 'Bangalore', 'Whole Wheat Atta 10kg', '78', 'Medium', '3 hours ago', 'In Stock'],
    ['Zepto', 'Bangalore', 'Instant Upma', '22', 'Critical', '8 hours ago', 'Out of Stock'],
    ['Blinkit', 'Hyderabad', 'Multigrain Atta 5kg', '89', 'Medium', '2 hours ago', 'In Stock'],
    ['Swiggy Instamart', 'Chennai', 'Iodized Salt', '98', 'High', '1 hour ago', 'In Stock'],
    ['Zepto', 'Mumbai', 'Chilli Powder', '67', 'Medium', '5 hours ago', 'In Stock'],
    ['Blinkit', 'Delhi', 'Crystal Salt', '91', 'High', '3 hours ago', 'In Stock'],
    ['Swiggy Instamart', 'Bangalore', 'Coriander Powder', '55', 'Low', '7 hours ago', 'Low Stock'],
    ['Zepto', 'Hyderabad', 'Sugar', '82', 'Medium', '4 hours ago', 'In Stock']
  ]

  return {
    headers,
    rows: mockData,
    metadata: {
      reportType: 'Availability Analytics',
      totalSKUs: 8,
      totalStores: 87,
      averageAvailability: '78.5%',
      outOfStockSKUs: 1,
      lowStockSKUs: 3
    }
  }
}

export const transformPricingData = (rawData?: any): ExportData => {
  const headers = [
    'Platform',
    'City',
    'SKU',
    'Current Price (₹)',
    'Competitor Price (₹)',
    'Price Difference',
    'Competitiveness',
    'Last Price Change'
  ]

  const mockData = [
    ['Blinkit', 'Mumbai', 'Whole Wheat Atta 5kg', '245', '250', '-₹5', 'Competitive', '3 days ago'],
    ['Blinkit', 'Mumbai', 'Instant Poha', '89', '92', '-₹3', 'Competitive', '1 day ago'],
    ['Swiggy Instamart', 'Delhi', 'Whole Wheat Atta 5kg', '248', '250', '-₹2', 'Competitive', '2 days ago'],
    ['Swiggy Instamart', 'Delhi', 'Turmeric Powder', '65', '58', '+₹7', 'Premium', '5 days ago'],
    ['Zepto', 'Bangalore', 'Whole Wheat Atta 10kg', '465', '470', '-₹5', 'Competitive', '1 day ago'],
    ['Zepto', 'Bangalore', 'Instant Upma', '95', '88', '+₹7', 'Premium', '4 days ago'],
    ['Blinkit', 'Hyderabad', 'Multigrain Atta 5kg', '285', '280', '+₹5', 'Premium', '2 days ago'],
    ['Swiggy Instamart', 'Chennai', 'Iodized Salt', '32', '35', '-₹3', 'Competitive', '1 week ago'],
    ['Zepto', 'Mumbai', 'Chilli Powder', '78', '75', '+₹3', 'Premium', '3 days ago'],
    ['Blinkit', 'Delhi', 'Crystal Salt', '38', '35', '+₹3', 'Premium', '6 days ago'],
    ['Swiggy Instamart', 'Bangalore', 'Coriander Powder', '55', '52', '+₹3', 'Premium', '2 days ago'],
    ['Zepto', 'Hyderabad', 'Sugar', '42', '45', '-₹3', 'Competitive', '1 day ago']
  ]

  return {
    headers,
    rows: mockData,
    metadata: {
      reportType: 'Pricing Analytics',
      averagePrice: '₹189',
      competitiveProducts: 7,
      premiumProducts: 5,
      priceChangesLast7Days: 8,
      avgPriceDifference: '+₹2.1'
    }
  }
}

export const transformVisibilityData = (rawData?: any): ExportData => {
  const headers = [
    'Platform',
    'Keyword',
    'SKU',
    'Search Ranking',
    'Share of Voice (%)',
    'Impressions',
    'Click Rate (%)',
    'Visibility Score'
  ]

  const mockData = [
    ['Blinkit', 'wheat flour', 'Whole Wheat Atta 5kg', '2', '35.2', '12,450', '8.7', '92'],
    ['Blinkit', 'instant poha', 'Instant Poha', '1', '48.9', '3,280', '12.3', '95'],
    ['Swiggy Instamart', 'atta', 'Whole Wheat Atta 5kg', '3', '28.7', '8,920', '6.4', '85'],
    ['Swiggy Instamart', 'turmeric powder', 'Turmeric Powder', '4', '22.1', '2,150', '9.8', '78'],
    ['Zepto', 'flour 10kg', 'Whole Wheat Atta 10kg', '1', '52.3', '1,890', '15.2', '98'],
    ['Zepto', 'ready to eat', 'Instant Upma', '6', '18.4', '4,560', '5.1', '67'],
    ['Blinkit', 'multigrain atta', 'Multigrain Atta 5kg', '2', '41.7', '1,650', '11.4', '88'],
    ['Swiggy Instamart', 'salt', 'Iodized Salt', '1', '45.8', '5,230', '7.9', '94'],
    ['Zepto', 'spices', 'Chilli Powder', '5', '25.6', '3,180', '8.2', '72'],
    ['Blinkit', 'table salt', 'Crystal Salt', '3', '31.4', '2,890', '6.8', '81'],
    ['Swiggy Instamart', 'coriander powder', 'Coriander Powder', '2', '38.9', '1,420', '10.7', '89'],
    ['Zepto', 'sugar', 'Sugar', '4', '29.3', '6,750', '7.1', '79']
  ]

  return {
    headers,
    rows: mockData,
    metadata: {
      reportType: 'Visibility Analytics',
      totalKeywords: 25,
      avgSearchRanking: 2.8,
      avgShareOfVoice: '34.7%',
      totalImpressions: '54,400',
      avgClickRate: '9.1%',
      avgVisibilityScore: 84
    }
  }
}

// KPI data transformers for summary exports
export const transformAvailabilityKPIs = (rawData?: any) => [
  { title: 'Overall Availability Rate', value: '85.2%', change: '+2.3% vs last week' },
  { title: 'Out-of-Stock SKUs', value: '3', change: '-2 vs last week' },
  { title: 'Store Coverage', value: '87/95', change: '+5 vs last week' },
  { title: 'Availability Consistency', value: '92.1%', change: '+1.8% vs last week' }
]

export const transformPricingKPIs = (rawData?: any) => [
  { title: 'Average Price Index', value: '₹189', change: '+1.2% vs last week' },
  { title: 'Price Change Frequency', value: '8 changes', change: '-3 vs last week' },
  { title: 'Price Competitiveness', value: '58%', change: '+5% vs last week' },
  { title: 'Revenue Impact', value: '+₹45K', change: '+12% vs last week' }
]

export const transformVisibilityKPIs = (rawData?: any) => [
  { title: 'Share of Voice (SOV)', value: '34.7%', change: '+4.2% vs last week' },
  { title: 'Average Search Ranking', value: '2.8', change: '-0.3 vs last week' },
  { title: 'Visibility Consistency', value: '84.3%', change: '+2.1% vs last week' },
  { title: 'Ad vs Organic Mix', value: '65/35', change: '+5% organic vs last week' }
]

// Chart data transformers (for future use with chart exports)
export const transformChartData = (chartType: string, rawData?: any) => {
  switch (chartType) {
    case 'availability-trend':
      return {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          { label: 'Blinkit', data: [85, 87, 89, 91] },
          { label: 'Swiggy Instamart', data: [82, 84, 86, 88] },
          { label: 'Zepto', data: [78, 80, 82, 85] }
        ]
      }
    case 'pricing-comparison':
      return {
        labels: ['Atta', 'Ready-to-Eat', 'Spices', 'Salt & Sugar'],
        datasets: [
          { label: 'Aashirvaad', data: [245, 89, 65, 32] },
          { label: 'Competitors', data: [250, 88, 58, 35] }
        ]
      }
    case 'visibility-ranking':
      return {
        labels: ['wheat flour', 'instant poha', 'atta', 'turmeric', 'salt'],
        datasets: [
          { label: 'Search Ranking', data: [2, 1, 3, 4, 1] },
          { label: 'Share of Voice', data: [35.2, 48.9, 28.7, 22.1, 45.8] }
        ]
      }
    default:
      return null
  }
}

// Generic data transformer that detects data type
export const transformDataForExport = (
  tab: 'availability' | 'pricing' | 'visibility',
  dataType: 'table' | 'kpi' | 'chart' = 'table',
  rawData?: any
) => {
  if (dataType === 'kpi') {
    switch (tab) {
      case 'availability':
        return transformAvailabilityKPIs(rawData)
      case 'pricing':
        return transformPricingKPIs(rawData)
      case 'visibility':
        return transformVisibilityKPIs(rawData)
    }
  }

  if (dataType === 'table') {
    switch (tab) {
      case 'availability':
        return transformAvailabilityData(rawData)
      case 'pricing':
        return transformPricingData(rawData)
      case 'visibility':
        return transformVisibilityData(rawData)
    }
  }

  return null
}