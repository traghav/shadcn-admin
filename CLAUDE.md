# Kelpie Dashboard Transformation Plan

## Overview
Transform the existing Shadcn Admin template into a Quick Commerce Analytics Dashboard for Kelpie, specifically tailored for Aashirvaad (ITC brand) with realistic mock data.

## Tech Stack
- React 19 + Vite
- TanStack Router (file-based routing)
- Shadcn UI components 
- Zustand for state management
- React Hook Form + Zod
- Recharts for data visualizations
- Tailwind CSS v4

## Key Transformations

### 1. Pages to Remove
- `/apps` - Apps listing page
- `/chats` - Chat interface 
- `/tasks` - Generic task management
- `/users` - User management
- `/help-center` - Help center page
- All auth pages except sign-in (Clerk integration stays)
- Error pages (keep but update branding)

### 2. New Pages to Create

#### Main Dashboard Pages
1. **Availability Tab** (`/`)
   - KPI Cards: Overall Availability Rate, Out-of-Stock SKUs, Store Coverage, Availability Consistency
   - Availability Heatmap (SKUs vs Stores/Cities)
   - Store-Level Availability Table
   - SKU Performance Matrix
   - Competitor Comparison

2. **Pricing Tab** (`/pricing`)
   - KPI Cards: Average Price Index, Price Change Frequency, Price Competitiveness, Revenue Impact
   - Price Trend Monitoring
   - SKU-Level Pricing Table
   - Competitive Pricing Intelligence
   - Price Elasticity Dashboard

3. **Visibility Tab** (`/visibility`)
   - KPI Cards: Share of Voice (SOV), Average Search Ranking, Visibility Consistency, Ad vs Organic Mix
   - Share of Voice Tracking
   - Search Ranking Heatmap
   - Keyword Performance Analysis
   - Competitor Share Analysis

### 3. Component Modifications

#### Team Switcher → Platform Switcher
- Transform to switch between Blinkit, Swiggy Instamart, Zepto
- Add "Data last refreshed" timestamp
- Use platform logos

#### Sidebar Navigation
- Update navigation items for Kelpie context
- Remove unnecessary sections
- Add Kelpie-specific icons

#### Global Filters Panel
- Brand Selector (multi-select)
- SKU Selector (hierarchical)
- Date Range Picker
- Geography Filters (cities, dark stores)
- Keyword Selector (visibility tab only)

### 4. Mock Data Strategy

#### Aashirvaad Products
- **Atta (Flour)**: Whole Wheat Atta 5kg, 10kg, Multigrain Atta 5kg
- **Ready-to-Eat**: Instant Poha, Instant Upma, Instant Khichdi
- **Spices**: Turmeric Powder, Chilli Powder, Coriander Powder
- **Salt & Sugar**: Iodized Salt, Crystal Salt, Sugar

#### Mock Data Structure
```typescript
// Platform data
platforms: ['Blinkit', 'Swiggy Instamart', 'Zepto']

// Cities
cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai']

// Dark stores per city
darkStores: 15-25 per city

// Competitors
competitors: ['Tata Sampann', 'Fortune', 'Patanjali', 'MDH']

// Time periods
- Last 7 days
- Last 30 days
- Custom range
```

### 5. Implementation Phases

#### Phase 1: Core Structure
1. Remove unnecessary pages and routes
2. Update routing structure
3. Modify sidebar navigation
4. Transform team switcher to platform switcher
5. Create base layout for analytics tabs

#### Phase 2: Dashboard Components
1. Create KPI card components
2. Implement data tables with sorting/filtering
3. Build chart components (heatmaps, line charts, bar charts)
4. Add export functionality

#### Phase 3: Mock Data & Visualization
1. Create comprehensive mock data for Aashirvaad
2. Implement availability heatmaps
3. Build pricing trend charts
4. Create visibility tracking visualizations

#### Phase 4: Filters & Interactions
1. Implement global filter panel
2. Add date range picker functionality
3. Create hierarchical SKU selector
4. Add real-time filter updates

#### Phase 5: Polish & Optimization
1. Add loading states
2. Implement error boundaries
3. Optimize performance
4. Add tooltips and help text

## Subagent Allocation

### Agent 1: Core Structure & Navigation
- Remove unnecessary pages
- Update routing
- Modify sidebar and navigation
- Transform team switcher

### Agent 2: Dashboard Layout & Components
- Create tab structure
- Build KPI card components
- Implement data tables
- Add export functionality

### Agent 3: Mock Data Generation
- Create Aashirvaad product data
- Generate availability metrics
- Create pricing data
- Build visibility/search data

### Agent 4: Data Visualizations
- Implement heatmaps
- Build trend charts
- Create comparison charts
- Add interactive features

### Agent 5: Filters & State Management
- Build filter components
- Implement filter logic
- Connect filters to data
- Manage global state

## Next Steps
1. Start with Agent 1 to clean up the structure
2. Parallel work on Agents 2 & 3 for components and data
3. Agent 4 builds visualizations using mock data
4. Agent 5 implements filtering and state management
5. Final integration and testing