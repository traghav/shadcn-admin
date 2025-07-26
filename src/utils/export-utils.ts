import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import { format } from 'date-fns'
import { FilterState } from '@/stores/filterStore'

export interface ExportOptions {
  filters: FilterState
  title: string
  subtitle?: string
  tab: 'availability' | 'pricing' | 'visibility'
}

export interface ExportData {
  headers: string[]
  rows: (string | number)[][]
  metadata?: Record<string, any>
}

// Utility function to get current timestamp for file naming
export const getTimestamp = () => format(new Date(), 'yyyy-MM-dd_HH-mm-ss')

// Generate filter summary for exports
export const generateFilterSummary = (filters: any): string[] => {
  const summary: string[] = []
  
  // Simplified summary for now - the filter structure has changed
  summary.push(`Export generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`)
  
  return summary
}

// PDF Export Functions
export const exportToPDF = async (options: ExportOptions, data?: ExportData) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Add Aashirvaad branding header
    pdf.setFontSize(20)
    pdf.setTextColor(220, 53, 69) // Brand red color
    pdf.text('Aashirvaad Analytics Report', 20, 25)
    
    // Add report details
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text(options.title, 20, 40)
    
    if (options.subtitle) {
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text(options.subtitle, 20, 50)
    }
    
    // Add filter summary
    const filterSummary = generateFilterSummary(options.filters)
    let yPosition = 65
    
    pdf.setFontSize(12)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Applied Filters:', 20, yPosition)
    yPosition += 10
    
    pdf.setFontSize(10)
    filterSummary.forEach(filter => {
      pdf.text(`• ${filter}`, 25, yPosition)
      yPosition += 7
    })
    
    // Add generation timestamp
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text(`Generated on: ${format(new Date(), 'PPpp')}`, 20, pageHeight - 20)
    
    // If we have tabular data, add it
    if (data) {
      yPosition += 15
      
      // Add data table
      pdf.setFontSize(12)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Data Summary:', 20, yPosition)
      yPosition += 10
      
      // Simple table implementation
      const colWidth = (pageWidth - 40) / data.headers.length
      
      // Headers
      pdf.setFontSize(10)
      pdf.setFont(undefined, 'bold')
      data.headers.forEach((header, index) => {
        pdf.text(header, 20 + (index * colWidth), yPosition)
      })
      yPosition += 10
      
      // Data rows (limit to fit on page)
      pdf.setFont(undefined, 'normal')
      const maxRows = Math.floor((pageHeight - yPosition - 30) / 8)
      const displayRows = data.rows.slice(0, maxRows)
      
      displayRows.forEach(row => {
        row.forEach((cell, index) => {
          const cellText = String(cell).substring(0, 15) // Truncate long text
          pdf.text(cellText, 20 + (index * colWidth), yPosition)
        })
        yPosition += 8
      })
      
      if (data.rows.length > maxRows) {
        pdf.setFontSize(8)
        pdf.setTextColor(100, 100, 100)
        pdf.text(`... and ${data.rows.length - maxRows} more rows`, 20, yPosition + 5)
      }
    }
    
    // Try to capture dashboard screenshot if element exists
    const dashboardElement = document.querySelector('[data-export-capture]')
    if (dashboardElement) {
      try {
        const canvas = await html2canvas(dashboardElement as HTMLElement, {
          scale: 0.5,
          useCORS: true,
          allowTaint: true
        })
        
        // Add new page for screenshot
        pdf.addPage()
        
        const imgWidth = pageWidth - 40
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 20, 20, imgWidth, imgHeight)
      } catch (error) {
        console.warn('Could not capture dashboard screenshot:', error)
      }
    }
    
    // Save the PDF
    const filename = `aashirvaad-${options.tab}-report_${getTimestamp()}.pdf`
    pdf.save(filename)
    
    return { success: true, filename }
  } catch (error) {
    console.error('PDF export failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Excel/CSV Export Functions
export const exportToExcel = (options: ExportOptions, data: ExportData) => {
  try {
    const workbook = XLSX.utils.book_new()
    
    // Create main data sheet
    const worksheet = XLSX.utils.aoa_to_sheet([
      // Add header with report info
      ['Aashirvaad Analytics Report'],
      [options.title],
      options.subtitle ? [options.subtitle] : [],
      [''],
      ['Generated on:', format(new Date(), 'PPpp')],
      [''],
      ['Applied Filters:'],
      ...generateFilterSummary(options.filters).map(filter => [filter]),
      [''],
      ['Data:'],
      data.headers,
      ...data.rows
    ])
    
    // Style the header rows
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
    
    // Set column widths
    const colWidths = data.headers.map(() => ({ wch: 15 }))
    worksheet['!cols'] = colWidths
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics Data')
    
    // Add metadata sheet if available
    if (data.metadata) {
      const metadataSheet = XLSX.utils.json_to_sheet([data.metadata])
      XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Metadata')
    }
    
    // Export as Excel file
    const filename = `aashirvaad-${options.tab}-data_${getTimestamp()}.xlsx`
    XLSX.writeFile(workbook, filename)
    
    return { success: true, filename }
  } catch (error) {
    console.error('Excel export failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const exportToCSV = (options: ExportOptions, data: ExportData) => {
  try {
    const csvContent = [
      // Header info
      'Aashirvaad Analytics Report',
      options.title,
      options.subtitle || '',
      '',
      `Generated on: ${format(new Date(), 'PPpp')}`,
      '',
      'Applied Filters:',
      ...generateFilterSummary(options.filters),
      '',
      'Data:',
      data.headers.join(','),
      ...data.rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')
    
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
    
    return { success: true, filename }
  } catch (error) {
    console.error('CSV export failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// PowerPoint-style summary export (as HTML)
export const exportToPowerPoint = async (options: ExportOptions, kpiData?: any) => {
  try {
    // Create a summary HTML document that can be imported into PowerPoint
    const filterSummary = generateFilterSummary(options.filters)
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Aashirvaad ${options.title} Summary</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #dc3545;
            padding-bottom: 20px;
          }
          .brand-title { 
            color: #dc3545; 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .subtitle { 
            color: #666; 
            font-size: 16px; 
          }
          .filters-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .filters-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #495057;
          }
          .filter-item {
            margin: 5px 0;
            color: #6c757d;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .kpi-card {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .kpi-title {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 10px;
          }
          .kpi-value {
            font-size: 32px;
            font-weight: bold;
            color: #dc3545;
            margin-bottom: 5px;
          }
          .kpi-change {
            font-size: 12px;
            color: #28a745;
          }
          .summary-section {
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .summary-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #495057;
          }
          .key-insights {
            list-style: none;
            padding: 0;
          }
          .key-insights li {
            background: white;
            margin: 10px 0;
            padding: 15px;
            border-left: 4px solid #dc3545;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand-title">Aashirvaad Analytics Summary</div>
          <div class="subtitle">${options.title}</div>
          ${options.subtitle ? `<div class="subtitle">${options.subtitle}</div>` : ''}
        </div>

        <div class="filters-section">
          <div class="filters-title">Report Parameters</div>
          ${filterSummary.map(filter => `<div class="filter-item">• ${filter}</div>`).join('')}
        </div>

        ${kpiData ? `
        <div class="kpi-grid">
          ${kpiData.map((kpi: any) => `
            <div class="kpi-card">
              <div class="kpi-title">${kpi.title}</div>
              <div class="kpi-value">${kpi.value}</div>
              <div class="kpi-change">${kpi.change || ''}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <div class="summary-section">
          <div class="summary-title">Key Insights</div>
          <ul class="key-insights">
            <li>Monitor availability trends across all platforms to identify optimization opportunities</li>
            <li>Track competitor pricing to maintain market competitiveness</li>
            <li>Focus on visibility improvements in high-performing markets</li>
            <li>Address out-of-stock situations in critical SKUs immediately</li>
          </ul>
        </div>

        <div class="footer">
          Generated on ${format(new Date(), 'PPpp')} | Kelpie Analytics Dashboard
        </div>
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    const filename = `aashirvaad-${options.tab}-summary_${getTimestamp()}.html`
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return { success: true, filename }
  } catch (error) {
    console.error('PowerPoint export failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Screenshot capture utility
export const captureScreenshot = async (elementSelector: string = '[data-export-capture]') => {
  try {
    const element = document.querySelector(elementSelector) as HTMLElement
    if (!element) {
      throw new Error('Element not found for screenshot')
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })
    
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Screenshot capture failed:', error)
    throw error
  }
}

// Main export dispatcher
export const exportData = async (
  format: 'pdf' | 'excel' | 'csv' | 'powerpoint',
  options: ExportOptions,
  data?: ExportData,
  kpiData?: any
) => {
  switch (format) {
    case 'pdf':
      return await exportToPDF(options, data)
    case 'excel':
      return data ? exportToExcel(options, data) : { success: false, error: 'No data provided for Excel export' }
    case 'csv':
      return data ? exportToCSV(options, data) : { success: false, error: 'No data provided for CSV export' }
    case 'powerpoint':
      return await exportToPowerPoint(options, kpiData)
    default:
      return { success: false, error: 'Unsupported export format' }
  }
}