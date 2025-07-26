import * as React from 'react'
import { Clock } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'
import { useCurrentPlatform, useFilterLastUpdated } from '@/stores/filterStore'
import { platforms } from '@/data/mock-kpi-data'
import { formatDistanceToNow } from 'date-fns'

export function DataRefreshTimestamp() {
  const { state } = useSidebar()
  const currentPlatform = useCurrentPlatform()
  const lastUpdated = useFilterLastUpdated()
  
  // Get current platform name for display
  const platformName = React.useMemo(() => {
    const platform = platforms.find(p => p.id === currentPlatform)
    return platform?.name || 'Unknown Platform'
  }, [currentPlatform])

  // Format last updated time
  const timeAgo = React.useMemo(() => {
    try {
      return formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })
    } catch {
      return '1 day ago' // Fallback
    }
  }, [lastUpdated])

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
      <span className="pl-5">Last updated: {timeAgo}</span>
    </div>
  )
}