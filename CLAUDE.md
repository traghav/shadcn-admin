# Kelpie Dashboard - Quick Commerce Analytics

## Project Overview
A React-based analytics dashboard specifically designed for monitoring Aashirvaad (ITC brand) product performance across quick commerce platforms (Blinkit, Swiggy Instamart, Zepto). The dashboard provides real-time insights into availability, pricing, and visibility metrics.

## Current State
**This is a fully implemented analytics dashboard** built from a Shadcn Admin template that has been transformed into a specialized quick commerce analytics platform.

### ✅ Implemented Features
- **Three main analytics tabs**: Availability, Pricing, Visibility
- **Platform switching**: Toggle between Blinkit, Swiggy Instamart, Zepto
- **KPI monitoring**: Real-time metrics for each analytics category
- **Data visualization**: Charts, heatmaps, and performance tables
- **Export functionality**: CSV export for all data views
- **Global filtering**: Date range, SKU selection, geography filters
- **Responsive design**: Works across desktop, tablet, and mobile
- **Authentication**: Clerk-based auth system
- **Performance optimization**: Error boundaries, lazy loading, memoization

## Tech Stack
- **Frontend**: React 19 + Vite
- **Routing**: TanStack Router (file-based routing)
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Authentication**: Clerk
- **Data Fetching**: TanStack Query
- **TypeScript**: Full type safety

## Project Structure

### Key Directories
```
src/
├── components/
│   ├── charts/          # Chart components (heatmaps, trends, tables)
│   ├── kpi/            # KPI card components for each analytics tab
│   ├── layout/         # App layout, sidebar, navigation
│   ├── export/         # CSV export functionality
│   └── ui/             # Shadcn UI components
├── features/
│   ├── availability/   # Availability analytics page
│   ├── pricing/        # Pricing analytics page
│   ├── visibility/     # Visibility analytics page
│   └── settings/       # User settings pages
├── routes/
│   ├── _authenticated/ # Protected routes requiring auth
│   └── (auth)/         # Authentication pages
├── stores/             # Zustand state stores
├── data/              # Mock data and data utilities
└── utils/             # Helper functions and utilities
```

### Core Routes
- `/` - Availability Analytics (main dashboard)
- `/pricing` - Pricing Analytics
- `/visibility` - Visibility Analytics
- `/settings/*` - User account and app settings

## Data Model

### Aashirvaad Product Categories
- **Atta (Flour)**: Whole Wheat Atta (5kg, 10kg), Multigrain Atta (5kg)
- **Ready-to-Eat**: Instant Poha, Instant Upma, Instant Khichdi
- **Spices**: Turmeric Powder, Chilli Powder, Coriander Powder
- **Salt & Sugar**: Iodized Salt, Crystal Salt, Sugar

### Platform Coverage
- **Blinkit**: Grocery & Essentials
- **Swiggy Instamart**: Instant Delivery
- **Zepto**: 10-Minute Delivery

### Geographic Coverage
Cities: Mumbai, Delhi, Bangalore, Hyderabad, Chennai
Dark stores: 15-25 per city across platforms

### Competitor Tracking
- Tata Sampann
- Fortune
- Patanjali
- MDH

## Key Components

### Analytics Tabs
1. **Availability Tab** (`src/features/availability/`)
   - Overall availability rate, out-of-stock SKUs, store coverage
   - Store-level availability tables
   - Low stock alerts
   - Stock level trend charts

2. **Pricing Tab** (`src/features/pricing/`)
   - Price index monitoring, competitiveness metrics
   - Price trend analysis
   - Competitive pricing intelligence
   - Revenue impact tracking

3. **Visibility Tab** (`src/features/visibility/`)
   - Share of Voice (SOV), search ranking metrics
   - Keyword performance analysis
   - Visibility consistency tracking
   - Ad vs organic performance mix

### Global Filtering System
- **Date Range Picker**: Last 7/30 days, custom ranges
- **SKU Selector**: Hierarchical product selection
- **Geography Filters**: City and dark store selection
- **Platform Filter**: Multi-platform comparison
- **Brand Selector**: Aashirvaad product lines

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run build  # Includes TypeScript compilation
```

## Performance Features
- **Error Boundaries**: Chart and table error handling
- **Lazy Loading**: Suspense for chart components
- **Memoization**: Optimized component re-renders
- **Async Data Handling**: Simulated loading states
- **Export Optimization**: Efficient CSV generation

## Authentication
Uses Clerk for authentication with the following routes:
- `/sign-in` - User login
- `/sign-up` - User registration
- Protected routes under `/_authenticated/`

## State Management
- **Filter Store** (`src/stores/filterStore.ts`): Global filter state
- **Auth Store** (`src/stores/authStore.ts`): Authentication state
- React Hook Form for form state management

## Styling Guidelines
- Uses Tailwind CSS v4 with custom design tokens
- Shadcn UI components for consistent design system
- Responsive design patterns throughout
- Dark/light mode support via theme context

## Data Export
All analytics views support CSV export functionality:
- Availability data exports
- Pricing analysis exports
- Visibility metrics exports
- Configurable date ranges and filters

## Error Handling
- Global error boundaries for chart and table components
- Graceful fallbacks for missing data
- Performance monitoring utilities
- User-friendly error messages

## Next Development Areas
If extending this dashboard, consider:
1. Real API integration replacing mock data
2. Advanced filtering capabilities
3. Additional chart types and visualizations
4. Push notification system for alerts
5. Advanced competitor analysis features
6. Integration with actual quick commerce platform APIs

## Important Notes
- All data is currently mocked for demonstration purposes
- Designed specifically for Aashirvaad product monitoring
- Optimized for quick commerce platform analytics
- Built with scalability and performance in mind