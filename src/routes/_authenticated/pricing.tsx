import { createFileRoute } from '@tanstack/react-router'
import PricingAnalytics from '@/features/pricing'

export const Route = createFileRoute('/_authenticated/pricing')({
  component: PricingAnalytics,
})