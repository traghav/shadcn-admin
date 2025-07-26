import { AvailabilityKpiGrid } from '@/components/kpi/availability-kpis'
import { FilteredAvailabilityHeatmap } from '@/components/charts/filtered-availability-heatmap'

export function AvailabilityOverview() {
  return (
    <div className="space-y-6">
      <AvailabilityKpiGrid />
      <FilteredAvailabilityHeatmap />
    </div>
  )
}