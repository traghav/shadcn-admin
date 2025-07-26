import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useFilteredData, useCurrentPlatform, useFilterBrands, useFilterCategories, useFilterSkus, useFilterCities, useFilterActiveTab } from '@/stores/filterStore'
import { useMemo } from 'react'

// Base data for availability trends
const baseAvailabilityData = [
  { name: 'Jan', total: 4200 },
  { name: 'Feb', total: 4350 },
  { name: 'Mar', total: 4180 },
  { name: 'Apr', total: 4480 },
  { name: 'May', total: 4290 },
  { name: 'Jun', total: 4620 },
  { name: 'Jul', total: 4380 },
  { name: 'Aug', total: 4550 },
  { name: 'Sep', total: 4720 },
  { name: 'Oct', total: 4890 },
  { name: 'Nov', total: 4650 },
  { name: 'Dec', total: 4930 },
]

export function Overview() {
  const currentPlatform = useCurrentPlatform()
  const selectedBrands = useFilterBrands()
  const selectedCategories = useFilterCategories()
  const selectedSkus = useFilterSkus()
  const selectedCities = useFilterCities()
  const activeTab = useFilterActiveTab()
  
  const { isPlatformSelected, isCategorySelected, isSkuSelected, isCitySelected } = useFilteredData()
  
  // Calculate filtered data based on current filter selections
  const filteredData = useMemo(() => {
    return baseAvailabilityData.map(item => {
      let multiplier = 1
      
      // Adjust based on current platform
      if (currentPlatform === 'blinkit') {
        multiplier *= 1.05 // Blinkit typically performs slightly better
      } else if (currentPlatform === 'swiggy-instamart') {
        multiplier *= 0.98 // Swiggy shows slightly lower numbers
      } else if (currentPlatform === 'zepto') {
        multiplier *= 0.95 // Zepto is more competitive
      }
      
      // Adjust based on category/SKU filters
      if ((selectedCategories && selectedCategories.length > 0) || (selectedSkus && selectedSkus.length > 0)) {
        multiplier *= 1.15 // Specific category/SKU focus typically shows better numbers
      }
      
      // Adjust based on city filters
      if (selectedCities && selectedCities.length > 0 && selectedCities.length < 5) {
        multiplier *= (selectedCities.length / 5) * 1.05
      }
      
      // Different metrics for different tabs
      let baseValue = item.total
      if (activeTab === 'pricing') {
        baseValue = item.total * 0.8 // Price optimization values are typically lower
      } else if (activeTab === 'visibility') {
        baseValue = item.total * 0.6 // Visibility metrics are typically lower
      }
      
      return {
        ...item,
        total: Math.round(baseValue * multiplier)
      }
    })
  }, [currentPlatform, selectedCategories, selectedSkus, selectedCities, activeTab])
  
  // Get appropriate formatter based on active tab
  const getTickFormatter = () => {
    if (activeTab === 'availability') {
      return (value: number) => `${(value / 1000).toFixed(1)}k` // Availability units
    } else if (activeTab === 'pricing') {
      return (value: number) => `₹${(value / 1000).toFixed(1)}k` // Revenue/pricing units
    } else if (activeTab === 'visibility') {
      return (value: number) => `${(value / 100).toFixed(1)}%` // Visibility percentage
    }
    return (value: number) => `${value}`
  }
  
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={filteredData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={getTickFormatter()}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
