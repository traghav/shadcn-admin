import { format } from 'date-fns'
import { FilterState } from '@/stores/filterStore'

export interface CSVExportData {
  headers: string[]
  rows: (string | number)[][]
  metadata?: {
    reportType: string
    [key: string]: any
  }
}

export interface CSVExportOptions {
  filters: FilterState
  title: string
  subtitle?: string
  tab: 'availability' | 'pricing' | 'visibility'
}

// Utility function to get current timestamp for file naming
const getTimestamp = () => format(new Date(), 'yyyy-MM-dd_HH-mm-ss')

// Generate filter summary for CSV header
const generateFilterSummary = (filters: any): string[] => {
  const summary: string[] = []
  
  // Simplified summary for now - the filter structure has changed
  summary.push(`Export generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`)
  
  return summary
}

// Escape CSV values properly
const escapeCSVValue = (value: string | number): string => {
  const strValue = String(value)
  // If the value contains comma, newline, or quote, wrap it in quotes and escape internal quotes
  if (strValue.includes(',') || strValue.includes('\n') || strValue.includes('"')) {
    return `"${strValue.replace(/"/g, '""')}"`
  }
  return strValue
}

// Main CSV export function
export const exportToCSV = async (
  options: CSVExportOptions, 
  data: CSVExportData
): Promise<{ success: boolean; filename?: string; error?: string }> => {
  try {
    const csvLines: string[] = []
    
    // Add header information
    csvLines.push('Aashirvaad Analytics Report')
    csvLines.push(escapeCSVValue(options.title))
    
    if (options.subtitle) {
      csvLines.push(escapeCSVValue(options.subtitle))
    }
    
    csvLines.push('') // Empty line
    csvLines.push(`Generated on: ${format(new Date(), 'PPpp')}`)
    csvLines.push('') // Empty line
    
    // Add filter information
    csvLines.push('Applied Filters:')
    const filterSummary = generateFilterSummary(options.filters)
    filterSummary.forEach(filter => {
      csvLines.push(escapeCSVValue(filter))
    })
    
    csvLines.push('') // Empty line
    
    // Add metadata if available
    if (data.metadata) {
      csvLines.push('Report Summary:')
      Object.entries(data.metadata).forEach(([key, value]) => {
        if (key !== 'reportType') {
          const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
          csvLines.push(`${escapeCSVValue(formattedKey)}: ${escapeCSVValue(value)}`)
        }
      })
      csvLines.push('') // Empty line
    }
    
    // Add data section
    csvLines.push('Data:')
    
    // Add headers
    csvLines.push(data.headers.map(header => escapeCSVValue(header)).join(','))
    
    // Add data rows
    data.rows.forEach(row => {
      csvLines.push(row.map(cell => escapeCSVValue(cell)).join(','))
    })
    
    // Create and download the CSV file
    const csvContent = csvLines.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    const filename = `aashirvaad-${options.tab}-data_${getTimestamp()}.csv`
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the object URL
    URL.revokeObjectURL(url)
    
    return { success: true, filename }
  } catch (error) {
    console.error('CSV export failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during export' 
    }
  }
}

// Utility function to validate CSV data before export
export const validateCSVData = (data: CSVExportData): boolean => {
  if (!data.headers || !Array.isArray(data.headers) || data.headers.length === 0) {
    return false
  }
  
  if (!data.rows || !Array.isArray(data.rows)) {
    return false
  }
  
  // Check that all rows have the same number of columns as headers
  return data.rows.every(row => 
    Array.isArray(row) && row.length === data.headers.length
  )
}

// Simple CSV export without headers (just raw data)
export const exportRawCSV = async (
  filename: string,
  headers: string[],
  rows: (string | number)[][]
): Promise<{ success: boolean; filename?: string; error?: string }> => {
  try {
    const csvLines: string[] = []
    
    // Add headers
    csvLines.push(headers.map(header => escapeCSVValue(header)).join(','))
    
    // Add data rows
    rows.forEach(row => {
      csvLines.push(row.map(cell => escapeCSVValue(cell)).join(','))
    })
    
    // Create and download the CSV file
    const csvContent = csvLines.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    const fullFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`
    link.setAttribute('href', url)
    link.setAttribute('download', fullFilename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the object URL
    URL.revokeObjectURL(url)
    
    return { success: true, filename: fullFilename }
  } catch (error) {
    console.error('Raw CSV export failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred during export' 
    }
  }
}