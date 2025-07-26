// Shared types for Kelpie Dashboard - Brand Analytics

export type Platform = 'Blinkit' | 'Swiggy Instamart' | 'Zepto';

export type City = 'Mumbai' | 'Delhi' | 'Bangalore' | 'Hyderabad' | 'Chennai';

export type Competitor = 'Tata Sampann' | 'Fortune' | 'Patanjali' | 'MDH';

export type ProductCategory = 'Atta (Flour)' | 'Ready-to-Eat' | 'Spices' | 'Salt & Sugar';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Discontinued';

export type AlertLevel = 'Critical' | 'Low' | 'Watch' | 'Normal';

export type TimeRange = 'last-7-days' | 'last-30-days' | 'last-90-days' | 'custom';

// Base Product interface
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  brand: 'Premium Brand';
  description?: string;
  imageUrl?: string;
  weight?: string;
  packSize?: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dark Store interface
export interface DarkStore {
  id: string;
  name: string;
  code: string;
  city: City;
  platform: Platform;
  address: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  capacity: number;
  currentUtilization: number;
  manager: string;
  phoneNumber: string;
  operatingHours: {
    open: string;
    close: string;
  };
}

// Base metrics interface
export interface BaseMetrics {
  date: Date;
  platform: Platform;
  city: City;
  productId: string;
  darkStoreId: string;
}

// Date range filter
export interface DateRangeFilter {
  from: Date;
  to: Date;
  range: TimeRange;
}

// Global filters
export interface GlobalFilters {
  platforms: Platform[];
  cities: City[];
  categories: ProductCategory[];
  products: string[];
  dateRange: DateRangeFilter;
  darkStores?: string[];
  keywords?: string[]; // For visibility analytics
}

// KPI Card interface
export interface KPICard {
  title: string;
  value: string | number;
  previousValue?: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  tooltip?: string;
  status?: AlertLevel;
}

// Chart data interfaces
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  category?: string;
  platform?: Platform;
  city?: City;
}

export interface HeatmapDataPoint {
  x: string; // Could be product SKU, store, etc.
  y: string; // Could be store, city, etc.
  value: number;
  status?: StockStatus | AlertLevel;
  tooltip?: string;
}

// Export functionality
export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  dateRange: DateRangeFilter;
  filters: Partial<GlobalFilters>;
  includeCharts?: boolean;
}

// Generic response wrapper
export interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    lastUpdated: Date;
  };
  success: boolean;
  message?: string;
}

// Error types
export interface ErrorDetails {
  code: string;
  message: string;
  field?: string;
  timestamp: Date;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Table sorting and filtering
export interface TableSort {
  column: string;
  direction: 'asc' | 'desc';
}

export interface TablePagination {
  page: number;
  limit: number;
  total: number;
}

export interface TableState {
  sort: TableSort;
  pagination: TablePagination;
  filters: Record<string, any>;
  search?: string;
}