import { createFileRoute } from '@tanstack/react-router'
import AvailabilityAnalytics from '@/features/availability'

export const Route = createFileRoute('/_authenticated/')({
  component: AvailabilityAnalytics,
})
