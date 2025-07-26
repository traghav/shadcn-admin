import * as React from 'react'
import { Clock } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import { useCurrentPlatform } from '@/stores/filterStore'
import { platforms } from '@/data/mock-kpi-data'
import { format, subDays } from 'date-fns'

export function DataRefreshTimestamp() {
  const { state } = useSidebar()
  const currentPlatform = useCurrentPlatform()
  
  // Get current platform name for display
  const platformName = React.useMemo(() => {
    const platform = platforms.find(p => p.id === currentPlatform)
    return platform?.name || 'Unknown Platform'
  }, [currentPlatform])

  // Always show yesterday's date
  const yesterdayDate = React.useMemo(() => {
    const yesterday = subDays(new Date(), 1)
    return format(yesterday, 'MMM d, yyyy')
  }, [])

  // Only show when sidebar is expanded
  if (state === 'collapsed') {
    return null
  }

  return (
    <div className="flex flex-col gap-1 px-2 py-1 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <Clock className="size-3" />
        <span>{platformName} data</span>
      </div>
      <span className="pl-5">Last updated: {yesterdayDate}</span>
    </div>
  )
}