import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useFilterStore } from '@/stores/filterStore'
import { exportToCSV, CSVExportData, CSVExportOptions } from '@/utils/csv-export'
import { toast } from 'sonner'

interface CSVExportButtonProps {
  title: string
  subtitle?: string
  tab: 'availability' | 'pricing' | 'visibility'
  data: CSVExportData
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  children?: React.ReactNode
}

export function CSVExportButton({ 
  title, 
  subtitle, 
  tab, 
  data,
  className,
  variant = 'outline',
  size = 'sm',
  children
}: CSVExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const filters = useFilterStore()

  const handleExport = async () => {
    if (!data || !data.headers || !data.rows) {
      toast.error('No data available for export')
      return
    }

    setIsExporting(true)
    
    const options: CSVExportOptions = {
      filters,
      title,
      subtitle,
      tab
    }

    try {
      const result = await exportToCSV(options, data)
      
      if (result.success) {
        toast.success(`CSV export successful! File saved as: ${result.filename}`)
      } else {
        toast.error(`CSV export failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleExport}
      disabled={isExporting || !data}
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          {children || 'Export CSV'}
        </>
      )}
    </Button>
  )
}

// Convenience components for each analytics tab
export function AvailabilityCSVExport({ 
  data, 
  ...props 
}: Omit<CSVExportButtonProps, 'title' | 'tab'> & { 
  data: CSVExportData
}) {
  return (
    <CSVExportButton
      title="Availability Analytics Report"
      subtitle="Brand product availability across quick commerce platforms"
      tab="availability"
      data={data}
      {...props}
    />
  )
}

export function PricingCSVExport({ 
  data, 
  ...props 
}: Omit<CSVExportButtonProps, 'title' | 'tab'> & { 
  data: CSVExportData
}) {
  return (
    <CSVExportButton
      title="Pricing Analytics Report"
      subtitle="Brand pricing trends and competitive analysis"
      tab="pricing"
      data={data}
      {...props}
    />
  )
}

export function VisibilityCSVExport({ 
  data, 
  ...props 
}: Omit<CSVExportButtonProps, 'title' | 'tab'> & { 
  data: CSVExportData
}) {
  return (
    <CSVExportButton
      title="Visibility Analytics Report"
      subtitle="Brand search visibility and ranking performance"
      tab="visibility"
      data={data}
      {...props}
    />
  )
}