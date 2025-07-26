import { createFileRoute } from '@tanstack/react-router'
import VisibilityAnalytics from '@/features/visibility'

export const Route = createFileRoute('/_authenticated/visibility')({
  component: VisibilityAnalytics,
})