# Kelpie Dashboard - Data Visualization Components

## Overview

This directory contains comprehensive data visualization components built with React and Recharts for the Kelpie Dashboard - a quick commerce analytics platform focused on brand performance across Blinkit, Swiggy Instamart, and Zepto.

## Chart Components

### Availability Analytics

#### 1. **AvailabilityHeatmap** (`availability-heatmap.tsx`)
- **Purpose**: Interactive heatmap showing SKU availability across cities and platforms
- **Features**: 
  - Enhanced tooltips with detailed metrics
  - Platform and SKU filtering
  - Performance sorting and badges
  - Real-time hover interactions
  - Quick action buttons
  - Statistical summaries
- **Data Source**: `visualizationData.availabilityHeatmap`

### Pricing Analytics

#### 2. **PricingTrendChart** (`pricing-trend-chart.tsx`)
- **Purpose**: Time-series price index trends comparing brand vs competitors
- **Features**:
  - Multi-brand comparison with toggleable lines
  - Time range filtering (7, 14, 30 days)
  - Market average reference line
  - Interactive brand selector buttons
  - Performance metrics display
- **Competitors**: Fortune, Tata Sampann, Patanjali

#### 3. **PricingComparisonChart** (`pricing-comparison-chart.tsx`)
- **Purpose**: SKU-level pricing comparison with competitive analysis
- **Features**:
  - Bar chart and scatter plot views
  - Platform-specific filtering
  - Price index color coding
  - Competitive positioning metrics
  - Price parity visualization

### Visibility Analytics

#### 4. **VisibilityRankingHeatmap** (`visibility-ranking-heatmap.tsx`)
- **Purpose**: Search ranking heatmap across platforms and keywords
- **Features**:
  - Platform-wise ranking comparison
  - Keyword performance matrix
  - Sort by ranking, volume, or share of voice
  - Performance categorization
  - Multi-platform aggregation

#### 5. **KeywordPerformanceChart** (`keyword-performance-chart.tsx`)
- **Purpose**: Multi-dimensional keyword performance analysis
- **Features**:
  - Scatter plot (volume vs ranking)
  - Performance bar chart
  - Share of voice pie chart
  - Performance scoring system
  - Top keywords showcase

### Competitive Analytics

#### 6. **MarketShareChart** (`market-share-chart.tsx`)
- **Purpose**: Market share and competitive positioning analysis
- **Features**:
  - Pie chart, bar chart, and radar chart views
  - Platform-wise comparison
  - Market position tracking
  - Gap to leader analysis
  - Cross-platform performance radar

### Data Tables

#### 7. **StorePerformanceTable** (`store-performance-table.tsx`)
- **Purpose**: Detailed store-level performance analytics
- **Features**:
  - Advanced search and filtering
  - Multi-column sorting
  - Performance badges
  - Pagination with customizable page size
  - Summary statistics
  - Export functionality

## Responsive Design Components

#### 8. **ResponsiveChartContainer** (`responsive-chart-container.tsx`)
- **Purpose**: Wrapper component for responsive chart display
- **Features**:
  - Fullscreen modal capability
  - Mobile-optimized layouts
  - Flexible grid systems
  - Touch-friendly interactions

#### 9. **ChartShowcase** (`chart-showcase.tsx`)
- **Purpose**: Comprehensive demo of all chart components
- **Features**:
  - Tabbed interface for different analytics
  - Feature highlights
  - Interactive examples
  - Documentation

## Technical Implementation

### Dependencies
- **React 19**: Core framework
- **Recharts 3.1.0**: Charting library
- **Shadcn UI**: Component library
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

### Data Sources
All components use mock data from `@/data/mock-kpi-data.ts`:
- `visualizationData.availabilityHeatmap`
- `visualizationData.pricingTrends`
- `visualizationData.pricingComparison`
- `visualizationData.visibilityKeywords`
- `visualizationData.shareOfVoice`
- `visualizationData.storePerformance`

### Key Features

#### Interactivity
- Hover tooltips with detailed information
- Click interactions and drill-downs
- Dynamic filtering and sorting
- Real-time state management

#### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Fullscreen viewing capabilities
- Touch-optimized interactions

#### Performance
- Memoized calculations for complex data processing
- Efficient rendering with React best practices
- Optimized re-renders with proper dependencies

#### Accessibility
- ARIA labels and descriptions
- Keyboard navigation support
- High contrast color schemes
- Screen reader compatibility

## Usage Examples

### Basic Chart Usage
```tsx
import { PricingTrendChart } from '@/components/charts'

function PricingPage() {
  return (
    <PricingTrendChart 
      title="Custom Title"
      description="Custom description"
      height={500}
    />
  )
}
```

### With Responsive Container
```tsx
import { ResponsiveChartContainer, MarketShareChart } from '@/components/charts'

function CompetitivePage() {
  return (
    <ResponsiveChartContainer
      title="Market Analysis"
      allowFullscreen
    >
      <MarketShareChart />
    </ResponsiveChartContainer>
  )
}
```

### Grid Layout
```tsx
import { ChartGrid, PricingTrendChart, PricingComparisonChart } from '@/components/charts'

function PricingDashboard() {
  return (
    <ChartGrid columns={2}>
      <PricingTrendChart />
      <PricingComparisonChart />
    </ChartGrid>
  )
}
```

## Color Schemes

### Availability
- **Excellent (≥98%)**: Emerald-600
- **Very Good (95-97%)**: Green-500
- **Good (90-94%)**: Lime-400
- **Fair (85-89%)**: Yellow-400
- **Poor (80-84%)**: Orange-400
- **Critical (<80%)**: Red-400

### Brand Colors
- **Premium Brand**: Purple (#8B5CF6)
- **Fortune**: Cyan (#06B6D4)
- **Tata Sampann**: Green (#10B981)
- **Patanjali**: Orange (#F59E0B)

## Data Visualization Best Practices

1. **Clear Visual Hierarchy**: Consistent spacing, typography, and color usage
2. **Progressive Disclosure**: Summary stats → detailed charts → drill-down capabilities
3. **Contextual Information**: Always provide tooltips and legends
4. **Performance Indicators**: Use color coding and badges for quick assessment
5. **Mobile Optimization**: Ensure charts work well on all screen sizes

## Future Enhancements

1. **Real-time Data**: Connect to live APIs for dynamic updates
2. **Export Functionality**: PDF, PNG, CSV export capabilities
3. **Advanced Filtering**: Date range pickers, multi-select filters
4. **Customization**: User-configurable dashboards
5. **Alerts**: Automated notifications for threshold breaches
6. **Annotations**: Add notes and insights to charts

## File Structure

```
src/components/charts/
├── index.tsx                      # Main exports
├── availability-heatmap.tsx       # Enhanced availability heatmap
├── availability-trend.tsx         # Existing trend chart
├── pricing-trend-chart.tsx        # Price index trends
├── pricing-comparison-chart.tsx   # Competitive pricing
├── visibility-ranking-heatmap.tsx # Search rankings
├── keyword-performance-chart.tsx  # Keyword analytics
├── market-share-chart.tsx         # Market share analysis
├── store-performance-table.tsx    # Store data table
├── store-availability-table.tsx   # Existing store table
├── responsive-chart-container.tsx # Responsive wrapper
├── chart-showcase.tsx             # Demo component
└── README.md                      # This documentation
```

This comprehensive visualization suite provides powerful analytics capabilities for quick commerce decision-making, with a focus on user experience, performance, and maintainability.