import * as React from 'react'
import { Clock } from 'lucide-react'
import { useSidebar } from '@/components/ui/sidebar'

export function DataRefreshTimestamp() {
  const { state } = useSidebar()
  
  // Hard-coded T-1 data (yesterday)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  // Only show when sidebar is expanded
  if (state === 'collapsed') {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
      <Clock className="size-3" />
      <span>Data last refreshed: 1 day ago</span>
    </div>
  )
}