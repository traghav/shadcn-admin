import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useFilterStore, useFilteredData } from '@/stores/filterStore'
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
  const {
    selectedPlatforms,
    selectedCategories,
    selectedSkus,
    selectedCities,
    activeTab
  } = useFilterStore()
  
  const { isPlatformSelected, isCategorySelected, isSkuSelected, isCitySelected } = useFilteredData()
  
  // Calculate filtered data based on current filter selections
  const filteredData = useMemo(() => {
    return baseAvailabilityData.map(item => {
      let multiplier = 1
      
      // Adjust based on platform filters
      if (selectedPlatforms.length > 0 && selectedPlatforms.length < 3) {
        multiplier *= (selectedPlatforms.length / 3) * 1.1 // Focusing on fewer platforms can improve metrics
      }
      
      // Adjust based on category/SKU filters
      if (selectedCategories.length > 0 || selectedSkus.length > 0) {
        multiplier *= 1.15 // Specific category/SKU focus typically shows better numbers
      }
      
      // Adjust based on city filters
      if (selectedCities.length > 0 && selectedCities.length < 5) {
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
  }, [selectedPlatforms, selectedCategories, selectedSkus, selectedCities, activeTab])
  
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
