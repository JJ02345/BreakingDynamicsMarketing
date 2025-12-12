// Analytics Squad - Public API
// Exports all public interfaces for analytics and tracking

// Types
export type {
  AnalyticsEventType,
  AnalyticsEvent,
  DailyMetrics,
  UserMetrics,
  DashboardStats,
  DashboardChartData,
  DashboardHistoryItem,
  AnalyticsContextValue,
} from './types';

// Note: Services and components will be migrated incrementally
// For now, import directly from src/lib/supabase/analytics.js
// and src/components/dashboard/*
