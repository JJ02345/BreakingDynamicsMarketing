// Analytics Squad Types
// Type definitions for analytics and tracking

// ============================================
// EVENTS
// ============================================

export type AnalyticsEventType =
  | 'page_view'
  | 'carousel_created'
  | 'carousel_exported'
  | 'survey_created'
  | 'survey_published'
  | 'survey_response'
  | 'ai_generated'
  | 'template_used'
  | 'editor_opened'
  | 'user_signed_up'
  | 'user_signed_in'
  | 'feedback_submitted';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  userId?: string;
  sessionId?: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

// ============================================
// METRICS
// ============================================

export interface DailyMetrics {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  carouselsCreated: number;
  surveysCreated: number;
  aiGenerations: number;
}

export interface UserMetrics {
  totalCarousels: number;
  totalSurveys: number;
  totalExports: number;
  aiUsageCount: number;
  lastActive: string;
}

// ============================================
// DASHBOARD DATA
// ============================================

export interface DashboardStats {
  totalCarousels: number;
  totalSurveys: number;
  totalExports: number;
  aiUsageCount: number;
}

export interface DashboardChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color: string;
  }>;
}

export interface DashboardHistoryItem {
  id: string;
  type: 'carousel' | 'survey';
  title: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

// ============================================
// ANALYTICS CONTEXT
// ============================================

export interface AnalyticsContextValue {
  isTracking: boolean;
  sessionId: string | null;
  track: (event: AnalyticsEventType, data?: Record<string, unknown>) => void;
  trackPageView: (page: string) => void;
  getMetrics: () => Promise<UserMetrics>;
  getDailyMetrics: (days: number) => Promise<DailyMetrics[]>;
}
