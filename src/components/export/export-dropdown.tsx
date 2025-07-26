import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Presentation,
  Camera,
  Loader2
} from 'lucide-react'
import { useFilterStore } from '@/stores/filterStore'
import { exportData, ExportData, ExportOptions } from '@/utils/export-utils'
import { toast } from 'sonner'

interface ExportDropdownProps {
  title: string
  subtitle?: string
  tab: 'availability' | 'pricing' | 'visibility'
  data?: ExportData
  kpiData?: any[]
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function ExportDropdown({ 
  title, 
  subtitle, 
  tab, 
  data, 
  kpiData,
  className,
  variant = 'outline',
  size = 'default'
}: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const filters = useFilterStore()

  const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'powerpoint') => {
    setIsExporting(format)
    
    const options: ExportOptions = {
      filters,
      title,
      subtitle,
      tab
    }

    try {
      const result = await exportData(format, options, data, kpiData)
      
      if (result.success) {
        toast.success(`Export successful! File saved as: ${result.filename}`)
      } else {
        toast.error(`Export failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(null)
    }
  }

  const exportOptions = [
    {
      key: 'pdf',
      label: 'Export as PDF',
      description: 'Dashboard screenshot with summary',
      icon: FileText,
      onClick: () => handleExport('pdf')
    },
    {
      key: 'excel',
      label: 'Export as Excel',
      description: 'Data table with filters applied',
      icon: FileSpreadsheet,
      onClick: () => handleExport('excel'),
      disabled: !data
    },
    {
      key: 'csv',
      label: 'Export as CSV',
      description: 'Raw data for analysis',
      icon: Download,
      onClick: () => handleExport('csv'),
      disabled: !data
    },
    {
      key: 'powerpoint',
      label: 'Export Summary',
      description: 'PowerPoint-ready HTML summary',
      icon: Presentation,
      onClick: () => handleExport('powerpoint')
    }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={className}
          disabled={!!isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-medium">
          Export Options
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {exportOptions.map((option) => {
          const Icon = option.icon
          const isLoading = isExporting === option.key
          
          return (
            <DropdownMenuItem
              key={option.key}
              onClick={option.onClick}
              disabled={option.disabled || !!isExporting}
              className="flex-col items-start p-3 cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-center w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="mr-2 h-4 w-4" />
                )}
                <span className="font-medium">{option.label}</span>
              </div>
              <span className="text-xs text-muted-foreground ml-6 mt-1">
                {option.description}
              </span>
            </DropdownMenuItem>
          )
        })}
        
        <DropdownMenuSeparator />
        
        <div className="p-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 mb-1">
            <Camera className="h-3 w-3" />
            <span>Exports include current filters</span>
          </div>
          <div>
            {filters.hasActiveFilters() 
              ? `${filters.getActiveFilterCount()} filter(s) applied`
              : 'All data included'
            }
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Convenience wrapper for different tab contexts
export function AvailabilityExport({ 
  data, 
  kpiData,
  ...props 
}: Omit<ExportDropdownProps, 'title' | 'tab'> & { 
  data?: ExportData
  kpiData?: any[]
}) {
  return (
    <ExportDropdown
      title="Availability Analytics Report"
      subtitle="Brand product availability across quick commerce platforms"
      tab="availability"
      data={data}
      kpiData={kpiData}
      {...props}
    />
  )
}

export function PricingExport({ 
  data, 
  kpiData,
  ...props 
}: Omit<ExportDropdownProps, 'title' | 'tab'> & { 
  data?: ExportData
  kpiData?: any[]
}) {
  return (
    <ExportDropdown
      title="Pricing Analytics Report"
      subtitle="Brand pricing trends and competitive analysis"
      tab="pricing"
      data={data}
      kpiData={kpiData}
      {...props}
    />
  )
}

export function VisibilityExport({ 
  data, 
  kpiData,
  ...props 
}: Omit<ExportDropdownProps, 'title' | 'tab'> & { 
  data?: ExportData
  kpiData?: any[]
}) {
  return (
    <ExportDropdown
      title="Visibility Analytics Report"
      subtitle="Brand search visibility and ranking performance"
      tab="visibility"
      data={data}
      kpiData={kpiData}
      {...props}
    />
  )
}