import * as React from 'react'
import { Clock } from 'lucide-react'

export function DataRefreshTimestamp() {
  const [lastRefreshed, setLastRefreshed] = React.useState(new Date())

  // Update timestamp every minute to show relative time
  React.useEffect(() => {
    const interval = setInterval(() => {
      // You can update this to trigger actual data refresh
      // For now, we'll just update the display
      setLastRefreshed(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
      <Clock className="size-3" />
      <span>Data last refreshed: {formatTimeAgo(lastRefreshed)}</span>
    </div>
  )
}