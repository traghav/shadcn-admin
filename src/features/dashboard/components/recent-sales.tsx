import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useFilteredData, useCurrentPlatform, useFilterBrands, useFilterCategories, useFilterSkus, useFilterCities, useFilterActiveTab } from '@/stores/filterStore'
import { useMemo } from 'react'

// Define different data structures for each tab
const availabilityUpdates = [
  {
    id: '1',
    product: 'Whole Wheat Atta 5kg',
    store: 'Blinkit Central Mumbai',
    change: '+12 units',
    changeType: 'positive',
    time: '2 min ago',
    platform: 'Blinkit',
    city: 'Mumbai',
    category: 'Atta'
  },
  {
    id: '2', 
    product: 'Instant Poha',
    store: 'Swiggy DLF Gurgaon',
    change: 'Back in stock',
    changeType: 'positive',
    time: '5 min ago',
    platform: 'Swiggy Instamart',
    city: 'Delhi',
    category: 'Ready-to-Eat'
  },
  {
    id: '3',
    product: 'Turmeric Powder',
    store: 'Zepto Koramangala',
    change: 'Stock low',
    changeType: 'warning',
    time: '12 min ago',
    platform: 'Zepto',
    city: 'Bangalore',
    category: 'Spices'
  },
  {
    id: '4',
    product: 'Multigrain Atta 5kg',
    store: 'Blinkit Hitech City',
    change: '+8 units',
    changeType: 'positive',
    time: '18 min ago',
    platform: 'Blinkit',
    city: 'Hyderabad',
    category: 'Atta'
  },
  {
    id: '5',
    product: 'Iodized Salt',
    store: 'Swiggy T.Nagar',
    change: '+25 units',
    changeType: 'positive',
    time: '23 min ago',
    platform: 'Swiggy Instamart',
    city: 'Chennai',
    category: 'Salt & Sugar'
  }
]

const pricingUpdates = [
  {
    id: '1',
    product: 'Whole Wheat Atta 5kg',
    store: 'Blinkit',
    change: '₹315 → ₹318',
    changeType: 'negative',
    time: '1 hour ago',
    platform: 'Blinkit',
    city: 'Mumbai',
    category: 'Atta'
  },
  {
    id: '2',
    product: 'Instant Poha',
    store: 'Swiggy Instamart',
    change: '₹68 → ₹65',
    changeType: 'positive',
    time: '2 hours ago',
    platform: 'Swiggy Instamart',
    city: 'Delhi',
    category: 'Ready-to-Eat'
  },
  {
    id: '3',
    product: 'Turmeric Powder',
    store: 'Zepto',
    change: '₹148 → ₹145',
    changeType: 'positive',
    time: '3 hours ago',
    platform: 'Zepto',
    city: 'Bangalore',
    category: 'Spices'
  },
  {
    id: '4',
    product: 'Whole Wheat Atta 10kg',
    store: 'Blinkit',
    change: '₹595 → ₹598',
    changeType: 'negative',
    time: '4 hours ago',
    platform: 'Blinkit',
    city: 'Hyderabad',
    category: 'Atta'
  },
  {
    id: '5',
    product: 'Instant Upma',
    store: 'Swiggy Instamart',
    change: '₹72 → ₹69',
    changeType: 'positive',
    time: '5 hours ago',
    platform: 'Swiggy Instamart',
    city: 'Chennai',
    category: 'Ready-to-Eat'
  }
]

const visibilityUpdates = [
  {
    id: '1',
    product: 'Whole Wheat Atta 5kg',
    store: 'atta keyword',
    change: '#1 → #1',
    changeType: 'neutral',
    time: '30 min ago',
    platform: 'Blinkit',
    city: 'Mumbai',
    category: 'Atta'
  },
  {
    id: '2',
    product: 'Multigrain Atta 5kg',
    store: 'multigrain atta',
    change: '#4 → #3',
    changeType: 'positive',
    time: '1 hour ago',
    platform: 'Swiggy Instamart',
    city: 'Delhi',
    category: 'Atta'
  },
  {
    id: '3',
    product: 'Instant Poha',
    store: 'instant poha',
    change: '#4 → #4',
    changeType: 'neutral',
    time: '2 hours ago',
    platform: 'Zepto',
    city: 'Bangalore',
    category: 'Ready-to-Eat'
  },
  {
    id: '4',
    product: 'Turmeric Powder',
    store: 'turmeric powder',
    change: '#6 → #7',
    changeType: 'negative',
    time: '3 hours ago',
    platform: 'Blinkit',
    city: 'Hyderabad',
    category: 'Spices'
  },
  {
    id: '5',
    product: 'Iodized Salt',
    store: 'salt',
    change: '#3 → #4',
    changeType: 'negative',
    time: '4 hours ago',
    platform: 'Swiggy Instamart',
    city: 'Chennai',
    category: 'Salt & Sugar'
  }
]

export function RecentSales() {
  const currentPlatform = useCurrentPlatform()
  const selectedBrands = useFilterBrands()
  const selectedCategories = useFilterCategories()
  const selectedSkus = useFilterSkus()
  const selectedCities = useFilterCities()
  const activeTab = useFilterActiveTab()
  
  const { isPlatformSelected, isCategorySelected, isCitySelected, getFilteredSkus } = useFilteredData()
  
  // Get the appropriate data based on active tab
  const getTabData = () => {
    switch (activeTab) {
      case 'availability':
        return availabilityUpdates
      case 'pricing':
        return pricingUpdates
      case 'visibility':
        return visibilityUpdates
      default:
        return availabilityUpdates
    }
  }
  
  // Filter data based on global filters
  const filteredData = useMemo(() => {
    let data = getTabData()
    
    // Apply platform filters (automatically handled by isPlatformSelected)
    data = data.filter(item => 
      isPlatformSelected(item.platform.toLowerCase().replace(' ', '-'))
    )
    
    // Apply city filters
    if (selectedCities && selectedCities.length > 0) {
      data = data.filter(item => 
        isCitySelected(item.city.toLowerCase().replace(' ', ''))
      )
    }
    
    // Apply category/SKU filters
    if ((selectedCategories && selectedCategories.length > 0) || (selectedSkus && selectedSkus.length > 0)) {
      const allowedSkus = getFilteredSkus()
      const allowedSkuNames = allowedSkus.map(sku => sku.name)
      const allowedCategories = (selectedCategories && selectedCategories.length > 0) ? selectedCategories : allowedSkus.map(sku => sku.category)
      
      data = data.filter(item => 
        allowedSkuNames.includes(item.product) || 
        allowedCategories.includes(item.category)
      )
    }
    
    return data.slice(0, 5) // Show only top 5
  }, [activeTab, selectedCities, selectedCategories, selectedSkus, 
      isPlatformSelected, isCitySelected, getFilteredSkus])
  
  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      case 'warning': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }
  
  const getBadgeVariant = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'default'
      case 'negative': return 'destructive'
      case 'warning': return 'secondary'
      default: return 'outline'
    }
  }
  
  const getInitials = (product: string) => {
    return product.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }
  
  if (filteredData.length === 0) {
    return (
      <div className='flex items-center justify-center h-32 text-muted-foreground text-sm'>
        No recent updates for current filters
      </div>
    )
  }
  
  return (
    <div className='space-y-8'>
      {filteredData.map((item) => (
        <div key={item.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback className='text-xs bg-primary/10 text-primary'>
              {getInitials(item.product)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between gap-2'>
            <div className='space-y-1 min-w-0 flex-1'>
              <p className='text-sm leading-none font-medium truncate'>{item.product}</p>
              <div className='flex items-center gap-2'>
                <p className='text-muted-foreground text-xs truncate'>
                  {item.store}
                </p>
                <Badge variant="outline" className='text-xs'>
                  {item.platform}
                </Badge>
              </div>
            </div>
            <div className='text-right flex-shrink-0'>
              <div className={`font-medium text-sm ${getChangeColor(item.changeType)}`}>
                {item.change}
              </div>
              <div className='text-xs text-muted-foreground'>
                {item.time}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
