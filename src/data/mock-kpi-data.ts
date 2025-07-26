// Comprehensive mock data for Kelpie Dashboard KPIs
// Brand analytics across Blinkit, Swiggy Instamart, and Zepto

export interface Platform {
  id: string
  name: string
  logo?: string
}

export interface Brand {
  id: string
  name: string
  categories: string[]
}

export interface BrandProduct {
  id: string
  name: string
  brandId: string
  category: 'Atta' | 'Ready-to-Eat' | 'Spices' | 'Salt & Sugar'
  variants: string[]
  basePrice: number
}

export interface DarkStore {
  id: string
  name: string
  cityId: string
  platformId: string
  address: string
  isActive: boolean
}

export interface City {
  id: string
  name: string
  darkStores: number
  population: number
}

export interface Competitor {
  id: string
  name: string
  category: string[]
}

// Base data structures
export const platforms: Platform[] = [
  { id: 'blinkit', name: 'Blinkit' },
  { id: 'swiggy-instamart', name: 'Swiggy Instamart' },
  { id: 'zepto', name: 'Zepto' }
]

export const brands: Brand[] = [
  { id: 'premium-brand', name: 'Premium Brand', categories: ['Atta', 'Ready-to-Eat', 'Spices', 'Salt & Sugar'] },
  { id: 'fortune', name: 'Fortune', categories: ['Atta', 'Spices'] },
  { id: 'tata-sampann', name: 'Tata Sampann', categories: ['Atta', 'Spices', 'Ready-to-Eat'] },
  { id: 'patanjali', name: 'Patanjali', categories: ['Atta', 'Spices', 'Salt & Sugar'] },
  { id: 'mdh', name: 'MDH', categories: ['Spices'] },
  { id: 'everest', name: 'Everest', categories: ['Spices'] },
  { id: 'mtr', name: 'MTR', categories: ['Ready-to-Eat'] },
  { id: 'haldirams', name: 'Haldirams', categories: ['Ready-to-Eat'] }
]

export const cities: City[] = [
  { id: 'mumbai', name: 'Mumbai', darkStores: 22, population: 12500000 },
  { id: 'delhi', name: 'Delhi', darkStores: 20, population: 11000000 },
  { id: 'bangalore', name: 'Bangalore', darkStores: 18, population: 8400000 },
  { id: 'hyderabad', name: 'Hyderabad', darkStores: 15, population: 6800000 },
  { id: 'chennai', name: 'Chennai', darkStores: 12, population: 4600000 }
]

export const brandProducts: BrandProduct[] = [
  {
    id: 'whole-wheat-atta-5kg',
    name: 'Whole Wheat Atta',
    brandId: 'premium-brand',
    category: 'Atta',
    variants: ['5kg', '10kg'],
    basePrice: 315
  },
  {
    id: 'multigrain-atta-5kg',
    name: 'Multigrain Atta',
    brandId: 'premium-brand',
    category: 'Atta',
    variants: ['5kg'],
    basePrice: 385
  },
  {
    id: 'instant-poha',
    name: 'Instant Poha',
    brandId: 'premium-brand',
    category: 'Ready-to-Eat',
    variants: ['500g'],
    basePrice: 65
  },
  {
    id: 'instant-upma',
    name: 'Instant Upma',
    brandId: 'premium-brand',
    category: 'Ready-to-Eat',
    variants: ['500g'],
    basePrice: 68
  },
  {
    id: 'instant-khichdi',
    name: 'Instant Khichdi',
    brandId: 'premium-brand',
    category: 'Ready-to-Eat',
    variants: ['500g'],
    basePrice: 72
  },
  {
    id: 'turmeric-powder',
    name: 'Turmeric Powder',
    brandId: 'premium-brand',
    category: 'Spices',
    variants: ['200g', '500g'],
    basePrice: 145
  },
  {
    id: 'chilli-powder',
    name: 'Chilli Powder',
    brandId: 'premium-brand',
    category: 'Spices',
    variants: ['200g', '500g'],
    basePrice: 158
  },
  {
    id: 'coriander-powder',
    name: 'Coriander Powder',
    brandId: 'premium-brand',
    category: 'Spices',
    variants: ['200g', '500g'],
    basePrice: 132
  },
  {
    id: 'iodized-salt',
    name: 'Iodized Salt',
    brandId: 'premium-brand',
    category: 'Salt & Sugar',
    variants: ['1kg'],
    basePrice: 28
  },
  {
    id: 'crystal-salt',
    name: 'Crystal Salt',
    brandId: 'premium-brand',
    category: 'Salt & Sugar',
    variants: ['1kg'],
    basePrice: 32
  }
]

// Dark store data - individual stores within each city/platform combination
export const darkStores: DarkStore[] = [
  // Mumbai stores
  { id: 'mumbai-blinkit-01', name: 'Bandra West Hub', cityId: 'mumbai', platformId: 'blinkit', address: 'Linking Road, Bandra West', isActive: true },
  { id: 'mumbai-blinkit-02', name: 'Powai Central', cityId: 'mumbai', platformId: 'blinkit', address: 'Hiranandani Gardens, Powai', isActive: true },
  { id: 'mumbai-blinkit-03', name: 'Andheri Express', cityId: 'mumbai', platformId: 'blinkit', address: 'Veera Desai Road, Andheri West', isActive: true },
  { id: 'mumbai-blinkit-04', name: 'Worli Sea Face', cityId: 'mumbai', platformId: 'blinkit', address: 'Annie Besant Road, Worli', isActive: true },
  { id: 'mumbai-swiggy-01', name: 'Kurla Express', cityId: 'mumbai', platformId: 'swiggy-instamart', address: 'LBS Road, Kurla West', isActive: true },
  { id: 'mumbai-swiggy-02', name: 'Goregaon Central', cityId: 'mumbai', platformId: 'swiggy-instamart', address: 'Malad Link Road, Goregaon West', isActive: true },
  { id: 'mumbai-swiggy-03', name: 'Marine Drive Hub', cityId: 'mumbai', platformId: 'swiggy-instamart', address: 'Nariman Point, Marine Drive', isActive: true },
  { id: 'mumbai-zepto-01', name: 'Juhu Beach Store', cityId: 'mumbai', platformId: 'zepto', address: 'Juhu Tara Road, Juhu', isActive: true },
  { id: 'mumbai-zepto-02', name: 'Thane Station', cityId: 'mumbai', platformId: 'zepto', address: 'Station Road, Thane West', isActive: true },
  
  // Delhi stores
  { id: 'delhi-blinkit-01', name: 'CP Central', cityId: 'delhi', platformId: 'blinkit', address: 'Connaught Place, Central Delhi', isActive: true },
  { id: 'delhi-blinkit-02', name: 'GK-II Hub', cityId: 'delhi', platformId: 'blinkit', address: 'M Block Market, Greater Kailash II', isActive: true },
  { id: 'delhi-blinkit-03', name: 'Vasant Kunj Express', cityId: 'delhi', platformId: 'blinkit', address: 'DLF Mall Road, Vasant Kunj', isActive: true },
  { id: 'delhi-swiggy-01', name: 'Lajpat Nagar Central', cityId: 'delhi', platformId: 'swiggy-instamart', address: 'Ring Road, Lajpat Nagar', isActive: true },
  { id: 'delhi-swiggy-02', name: 'Karol Bagh Market', cityId: 'delhi', platformId: 'swiggy-instamart', address: 'Ajmal Khan Road, Karol Bagh', isActive: true },
  { id: 'delhi-zepto-01', name: 'Dwarka Express', cityId: 'delhi', platformId: 'zepto', address: 'Sector 12, Dwarka', isActive: true },
  { id: 'delhi-zepto-02', name: 'Rohini Hub', cityId: 'delhi', platformId: 'zepto', address: 'Sector 7, Rohini', isActive: true },
  
  // Bangalore stores
  { id: 'bangalore-blinkit-01', name: 'Koramangala Hub', cityId: 'bangalore', platformId: 'blinkit', address: '80 Feet Road, Koramangala', isActive: true },
  { id: 'bangalore-blinkit-02', name: 'Indiranagar Central', cityId: 'bangalore', platformId: 'blinkit', address: '100 Feet Road, Indiranagar', isActive: true },
  { id: 'bangalore-swiggy-01', name: 'Whitefield Tech', cityId: 'bangalore', platformId: 'swiggy-instamart', address: 'ITPL Main Road, Whitefield', isActive: true },
  { id: 'bangalore-swiggy-02', name: 'HSR Layout Express', cityId: 'bangalore', platformId: 'swiggy-instamart', address: 'Sector 2, HSR Layout', isActive: true },
  { id: 'bangalore-zepto-01', name: 'Jayanagar Central', cityId: 'bangalore', platformId: 'zepto', address: '4th Block, Jayanagar', isActive: true },
  
  // Hyderabad stores
  { id: 'hyderabad-blinkit-01', name: 'HITEC City Hub', cityId: 'hyderabad', platformId: 'blinkit', address: 'Cyberabad, HITEC City', isActive: true },
  { id: 'hyderabad-blinkit-02', name: 'Banjara Hills Central', cityId: 'hyderabad', platformId: 'blinkit', address: 'Road No. 12, Banjara Hills', isActive: true },
  { id: 'hyderabad-swiggy-01', name: 'Gachibowli Express', cityId: 'hyderabad', platformId: 'swiggy-instamart', address: 'Financial District, Gachibowli', isActive: true },
  { id: 'hyderabad-zepto-01', name: 'Madhapur Tech Hub', cityId: 'hyderabad', platformId: 'zepto', address: 'KPHB Road, Madhapur', isActive: true },
  
  // Chennai stores
  { id: 'chennai-blinkit-01', name: 'T Nagar Central', cityId: 'chennai', platformId: 'blinkit', address: 'Ranganathan Street, T Nagar', isActive: true },
  { id: 'chennai-swiggy-01', name: 'Velachery Hub', cityId: 'chennai', platformId: 'swiggy-instamart', address: 'Vijayanagar, Velachery', isActive: true },
  { id: 'chennai-zepto-01', name: 'Anna Nagar Express', cityId: 'chennai', platformId: 'zepto', address: '2nd Avenue, Anna Nagar', isActive: true }
]

export const competitors: Competitor[] = [
  { id: 'fortune', name: 'Fortune', category: ['Atta', 'Spices'] },
  { id: 'tata-sampann', name: 'Tata Sampann', category: ['Atta', 'Spices', 'Ready-to-Eat'] },
  { id: 'patanjali', name: 'Patanjali', category: ['Atta', 'Spices', 'Salt & Sugar'] },
  { id: 'mdh', name: 'MDH', category: ['Spices'] },
  { id: 'everest', name: 'Everest', category: ['Spices'] },
  { id: 'mtr', name: 'MTR', category: ['Ready-to-Eat'] },
  { id: 'haldirams', name: 'Haldirams', category: ['Ready-to-Eat'] }
]

// Time-series data generator
export function generateTimeSeriesData(
  baseValue: number,
  trend: 'up' | 'down' | 'stable',
  volatility: number = 0.05,
  days: number = 30
) {
  const data = []
  let currentValue = baseValue
  const trendMultiplier = trend === 'up' ? 1.001 : trend === 'down' ? 0.999 : 1

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))
    
    currentValue *= trendMultiplier
    const noise = (Math.random() - 0.5) * volatility * currentValue
    currentValue += noise

    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(currentValue * 100) / 100
    })
  }

  return data
}

// Mock data generators for different metrics
export function generateAvailabilityData() {
  return {
    overall: 94.2,
    byPlatform: {
      'blinkit': 96.1,
      'swiggy-instamart': 93.8,
      'zepto': 92.7
    },
    byCity: cities.map(city => ({
      cityId: city.id,
      cityName: city.name,
      availability: 90 + Math.random() * 8,
      stores: Math.floor(city.darkStores * (2 + Math.random() * 6))
    })),
    bySku: brandProducts.map(product => ({
      skuId: product.id,
      skuName: product.name,
      availability: 85 + Math.random() * 15,
      outOfStockDays: Math.floor(Math.random() * 10)
    })),
    trend: generateTimeSeriesData(94.2, 'up', 0.02, 30)
  }
}

export function generatePricingData() {
  return {
    priceIndex: 102.3,
    byPlatform: {
      'blinkit': 104.1,
      'swiggy-instamart': 101.8,
      'zepto': 100.9
    },
    competitiveness: 89.4,
    bySku: brandProducts.map(product => ({
      skuId: product.id,
      skuName: product.name,
      currentPrice: product.basePrice * (0.95 + Math.random() * 0.1),
      competitorAvg: product.basePrice * (0.98 + Math.random() * 0.08),
      priceIndex: 95 + Math.random() * 15
    })),
    trend: generateTimeSeriesData(102.3, 'up', 0.03, 30)
  }
}

export function generateVisibilityData() {
  return {
    shareOfVoice: 23.8,
    avgRanking: 2.4,
    consistency: 91.3,
    organicMix: 65.2,
    byPlatform: {
      'blinkit': { sov: 26.2, ranking: 2.1, consistency: 93.5 },
      'swiggy-instamart': { sov: 22.8, ranking: 2.5, consistency: 89.7 },
      'zepto': { sov: 22.4, ranking: 2.6, consistency: 90.8 }
    },
    keywords: [
      { keyword: 'atta', ranking: 1, volume: 125000, sov: 28.5 },
      { keyword: 'wheat flour', ranking: 2, volume: 89000, sov: 31.2 },
      { keyword: 'whole wheat atta', ranking: 1, volume: 67000, sov: 35.6 },
      { keyword: 'multigrain atta', ranking: 3, volume: 45000, sov: 19.8 },
      { keyword: 'instant poha', ranking: 4, volume: 32000, sov: 15.2 }
    ],
    trend: generateTimeSeriesData(23.8, 'up', 0.04, 30)
  }
}

// Combined dashboard data
export function generateDashboardData() {
  return {
    lastUpdated: new Date().toISOString(),
    availability: generateAvailabilityData(),
    pricing: generatePricingData(),
    visibility: generateVisibilityData(),
    summary: {
      totalSkus: brandProducts.length,
      totalPlatforms: platforms.length,
      totalCities: cities.length,
      totalStores: cities.reduce((sum, city) => sum + city.darkStores * 8, 0)
    }
  }
}

// Export pre-generated data for consistent demos
export const mockDashboardData = generateDashboardData()

// Enhanced mock data for visualizations
export interface HeatmapData {
  sku: string
  city: string
  platform: string
  availability: number
  outOfStockHours: number
}

export interface TrendData {
  date: string
  premiumBrand: number
  fortune: number
  tataSampann: number
  patanjali: number
}

export interface PricingComparisonData {
  sku: string
  aashirvaaPrice: number
  competitorAvg: number
  priceIndex: number
  platform: string
  margin: number
}

export interface VisibilityKeywordData {
  keyword: string
  sku: string
  ranking: number
  searchVolume: number
  shareOfVoice: number
  platform: string
}

// Generate availability heatmap data
export function generateAvailabilityHeatmap(): HeatmapData[] {
  const heatmapData: HeatmapData[] = []
  
  brandProducts.forEach(product => {
    cities.forEach(city => {
      platforms.forEach(platform => {
        heatmapData.push({
          sku: product.name,
          city: city.name,
          platform: platform.name,
          availability: 85 + Math.random() * 15, // 85-100%
          outOfStockHours: Math.floor(Math.random() * 48) // 0-48 hours
        })
      })
    })
  })
  
  return heatmapData
}

// Generate pricing trend data with competitors
export function generatePricingTrends(days: number = 30): TrendData[] {
  const trends: TrendData[] = []
  
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))
    
    trends.push({
      date: date.toISOString().split('T')[0],
      premiumBrand: 100 + (Math.random() - 0.5) * 10, // Price index 95-105
      fortune: 98 + (Math.random() - 0.5) * 8,
      tataSampann: 102 + (Math.random() - 0.5) * 12,
      patanjali: 95 + (Math.random() - 0.5) * 6
    })
  }
  
  return trends
}

// Generate detailed pricing comparison data
export function generatePricingComparison(): PricingComparisonData[] {
  const pricingData: PricingComparisonData[] = []
  
  brandProducts.forEach(product => {
    platforms.forEach(platform => {
      const aashirvaaPrice = product.basePrice * (0.95 + Math.random() * 0.1)
      const competitorAvg = product.basePrice * (0.98 + Math.random() * 0.08)
      
      pricingData.push({
        sku: product.name,
        aashirvaaPrice,
        competitorAvg,
        priceIndex: (aashirvaaPrice / competitorAvg) * 100,
        platform: platform.name,
        margin: ((aashirvaaPrice - competitorAvg) / competitorAvg) * 100
      })
    })
  })
  
  return pricingData
}

// Generate visibility keyword ranking data
export function generateVisibilityKeywords(): VisibilityKeywordData[] {
  const keywords = [
    'atta', 'wheat flour', 'whole wheat atta', 'multigrain atta',
    'instant poha', 'instant upma', 'instant khichdi',
    'turmeric powder', 'chilli powder', 'coriander powder',
    'iodized salt', 'crystal salt'
  ]
  
  const keywordData: VisibilityKeywordData[] = []
  
  keywords.forEach(keyword => {
    // Find relevant SKUs for this keyword
    const relevantSkus = brandProducts.filter(product => 
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.includes(product.category.toLowerCase())
    )
    
    if (relevantSkus.length === 0) {
      // Add a general match for broader keywords
      relevantSkus.push(brandProducts[Math.floor(Math.random() * brandProducts.length)])
    }
    
    relevantSkus.forEach(sku => {
      platforms.forEach(platform => {
        keywordData.push({
          keyword,
          sku: sku.name,
          ranking: Math.floor(Math.random() * 10) + 1, // 1-10
          searchVolume: Math.floor(Math.random() * 100000) + 10000, // 10k-110k
          shareOfVoice: Math.random() * 40 + 10, // 10-50%
          platform: platform.name
        })
      })
    })
  })
  
  return keywordData
}

// Share of Voice data for pie charts
export function generateShareOfVoiceData() {
  return {
    overall: [
      { name: 'Premium Brand', value: 23.8, fill: '#8B5CF6' },
      { name: 'Fortune', value: 19.2, fill: '#06B6D4' },
      { name: 'Tata Sampann', value: 16.5, fill: '#10B981' },
      { name: 'Patanjali', value: 14.3, fill: '#F59E0B' },
      { name: 'Others', value: 26.2, fill: '#6B7280' }
    ],
    byPlatform: {
      'Blinkit': [
        { name: 'Premium Brand', value: 26.2, fill: '#8B5CF6' },
        { name: 'Fortune', value: 21.1, fill: '#06B6D4' },
        { name: 'Tata Sampann', value: 18.3, fill: '#10B981' },
        { name: 'Patanjali', value: 12.8, fill: '#F59E0B' },
        { name: 'Others', value: 21.6, fill: '#6B7280' }
      ],
      'Swiggy Instamart': [
        { name: 'Premium Brand', value: 22.8, fill: '#8B5CF6' },
        { name: 'Fortune', value: 18.9, fill: '#06B6D4' },
        { name: 'Tata Sampann', value: 15.7, fill: '#10B981' },
        { name: 'Patanjali', value: 16.2, fill: '#F59E0B' },
        { name: 'Others', value: 26.4, fill: '#6B7280' }
      ],
      'Zepto': [
        { name: 'Premium Brand', value: 22.4, fill: '#8B5CF6' },
        { name: 'Fortune', value: 17.8, fill: '#06B6D4' },
        { name: 'Tata Sampann', value: 15.1, fill: '#10B981' },
        { name: 'Patanjali', value: 13.9, fill: '#F59E0B' },
        { name: 'Others', value: 30.8, fill: '#6B7280' }
      ]
    }
  }
}

// Price distribution data for histograms
export function generatePriceDistribution() {
  const priceRanges = [
    { range: '₹20-₹50', premiumBrand: 2, competitors: 8 },
    { range: '₹50-₹100', premiumBrand: 5, competitors: 12 },
    { range: '₹100-₹200', premiumBrand: 3, competitors: 7 },
    { range: '₹200-₹350', premiumBrand: 8, competitors: 15 },
    { range: '₹350-₹500', premiumBrand: 2, competitors: 3 }
  ]
  
  return priceRanges
}

// Store performance data for tables
export function generateStorePerformanceData() {
  const storeData = []
  
  cities.forEach(city => {
    platforms.forEach(platform => {
      const storeCount = Math.floor(city.darkStores * (2 + Math.random() * 6))
      for (let i = 1; i <= Math.min(5, storeCount); i++) {
        storeData.push({
          id: `${city.id}-${platform.id}-${i}`,
          storeName: `${platform.name} ${city.name} ${i}`,
          city: city.name,
          platform: platform.name,
          availability: 85 + Math.random() * 15,
          avgOrderValue: 250 + Math.random() * 200,
          monthlyOrders: Math.floor(500 + Math.random() * 2000),
          topSkus: brandProducts
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(p => p.name),
          lastStockout: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      }
    })
  })
  
  return storeData.slice(0, 50) // Limit to 50 stores for demo
}

// Date range helpers
export const dateRanges = {
  'last-7-days': { label: 'Last 7 days', days: 7 },
  'last-30-days': { label: 'Last 30 days', days: 30 },
  'last-90-days': { label: 'Last 90 days', days: 90 },
  'custom': { label: 'Custom range', days: null }
}

// Filter options
export const filterOptions = {
  platforms: platforms.map(p => ({ value: p.id, label: p.name })),
  cities: cities.map(c => ({ value: c.id, label: c.name })),
  categories: [
    { value: 'Atta', label: 'Atta' },
    { value: 'Ready-to-Eat', label: 'Ready-to-Eat' },
    { value: 'Spices', label: 'Spices' },
    { value: 'Salt & Sugar', label: 'Salt & Sugar' }
  ],
  skus: brandProducts.map(p => ({ 
    value: p.id, 
    label: p.name,
    category: p.category 
  }))
}

// Pre-generated visualization data
export const visualizationData = {
  availabilityHeatmap: generateAvailabilityHeatmap(),
  pricingTrends: generatePricingTrends(),
  pricingComparison: generatePricingComparison(),
  visibilityKeywords: generateVisibilityKeywords(),
  shareOfVoice: generateShareOfVoiceData(),
  priceDistribution: generatePriceDistribution(),
  storePerformance: generateStorePerformanceData()
}