import { CSVExportData } from './csv-export'

// Availability data transformer for CSV export
export const transformAvailabilityDataForCSV = (rawData?: any): CSVExportData => {
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

// Pricing data transformer for CSV export
export const transformPricingDataForCSV = (rawData?: any): CSVExportData => {
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

// Visibility data transformer for CSV export
export const transformVisibilityDataForCSV = (rawData?: any): CSVExportData => {
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

// Store availability table data specifically
export const transformStoreAvailabilityForCSV = (rawData?: any): CSVExportData => {
  const headers = [
    'Store Name',
    'Platform',
    'City',
    'Overall Availability %',
    'Total SKUs',
    'In Stock SKUs',
    'Low Stock SKUs',
    'Out of Stock SKUs',
    'Last Updated'
  ]

  const mockData = [
    ['Blinkit Powai', 'Blinkit', 'Mumbai', '87', '24', '19', '3', '2', '2 hours ago'],
    ['Blinkit Koramangala', 'Blinkit', 'Bangalore', '92', '24', '22', '1', '1', '1 hour ago'],
    ['Swiggy Connaught Place', 'Swiggy Instamart', 'Delhi', '78', '22', '17', '4', '1', '3 hours ago'],
    ['Swiggy T Nagar', 'Swiggy Instamart', 'Chennai', '94', '23', '21', '2', '0', '1 hour ago'],
    ['Zepto Hitech City', 'Zepto', 'Hyderabad', '85', '20', '17', '2', '1', '4 hours ago'],
    ['Zepto Bandra', 'Zepto', 'Mumbai', '91', '21', '19', '2', '0', '2 hours ago']
  ]

  return {
    headers,
    rows: mockData,
    metadata: {
      reportType: 'Store Availability Data',
      totalStores: 6,
      avgAvailability: '87.8%',
      topPerformingStore: 'Swiggy T Nagar',
      lowestPerformingStore: 'Swiggy Connaught Place'
    }
  }
}

// SKU performance data specifically
export const transformSKUPerformanceForCSV = (rawData?: any): CSVExportData => {
  const headers = [
    'SKU',
    'Category',
    'Overall Availability %',
    'Price Range (Min-Max)',
    'Avg Search Ranking',
    'Share of Voice %',
    'Performance Score',
    'Status'
  ]

  const mockData = [
    ['Whole Wheat Atta 5kg', 'Atta', '88', '₹245-₹250', '2.3', '32.1', '92', 'Excellent'],
    ['Whole Wheat Atta 10kg', 'Atta', '78', '₹465-₹470', '1.0', '52.3', '89', 'Good'],
    ['Multigrain Atta 5kg', 'Atta', '89', '₹280-₹285', '2.0', '41.7', '88', 'Good'],
    ['Instant Poha', 'Ready-to-Eat', '88', '₹89-₹92', '1.0', '48.9', '95', 'Excellent'],
    ['Instant Upma', 'Ready-to-Eat', '22', '₹88-₹95', '6.0', '18.4', '67', 'Needs Attention'],
    ['Instant Khichdi', 'Ready-to-Eat', '65', '₹95-₹98', '4.0', '25.2', '74', 'Average'],
    ['Turmeric Powder', 'Spices', '45', '₹58-₹65', '4.0', '22.1', '78', 'Average'],
    ['Chilli Powder', 'Spices', '67', '₹75-₹78', '5.0', '25.6', '72', 'Average'],
    ['Coriander Powder', 'Spices', '55', '₹52-₹55', '2.0', '38.9', '89', 'Good'],
    ['Iodized Salt', 'Salt & Sugar', '98', '₹32-₹35', '1.0', '45.8', '94', 'Excellent'],
    ['Crystal Salt', 'Salt & Sugar', '91', '₹35-₹38', '3.0', '31.4', '81', 'Good'],
    ['Sugar', 'Salt & Sugar', '82', '₹42-₹45', '4.0', '29.3', '79', 'Good']
  ]

  return {
    headers,
    rows: mockData,
    metadata: {
      reportType: 'SKU Performance Analysis',
      totalSKUs: 12,
      excellentPerformers: 4,
      goodPerformers: 5,
      needsAttention: 1,
      avgPerformanceScore: 83.2
    }
  }
}

// Generic data transformer that detects data type and returns CSV format
export const transformDataForCSVExport = (
  tab: 'availability' | 'pricing' | 'visibility',
  dataType: 'overview' | 'store-level' | 'sku-level' = 'overview',
  rawData?: any
): CSVExportData => {
  switch (tab) {
    case 'availability':
      if (dataType === 'store-level') {
        return transformStoreAvailabilityForCSV(rawData)
      }
      if (dataType === 'sku-level') {
        return transformSKUPerformanceForCSV(rawData)
      }
      return transformAvailabilityDataForCSV(rawData)
      
    case 'pricing':
      return transformPricingDataForCSV(rawData)
      
    case 'visibility':
      return transformVisibilityDataForCSV(rawData)
      
    default:
      throw new Error(`Unsupported tab: ${tab}`)
  }
}