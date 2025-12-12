// Admin Squad Types
// Type definitions for admin dashboard

// ============================================
// FEEDBACK
// ============================================

export type FeedbackType = 'bug' | 'feature' | 'general' | 'praise';
export type FeedbackStatus = 'new' | 'in_progress' | 'resolved' | 'closed';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Feedback {
  id: string;
  userId?: string;
  userEmail?: string;
  type: FeedbackType;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  title: string;
  description: string;
  screenshot?: string;
  metadata?: {
    url?: string;
    userAgent?: string;
    timestamp?: string;
  };
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ADMIN STATS
// ============================================

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCarousels: number;
  totalSurveys: number;
  totalFeedback: number;
  newFeedbackCount: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentFeedback: Feedback[];
  userGrowth: Array<{ date: string; count: number }>;
  contentCreation: Array<{ date: string; carousels: number; surveys: number }>;
}

// ============================================
// ADMIN USER
// ============================================

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  lastLogin?: string;
}

// ============================================
// ADMIN ACTIONS
// ============================================

export interface AdminContextValue {
  isAdmin: boolean;
  isLoading: boolean;
  stats: AdminStats | null;
  feedback: Feedback[];
  loadStats: () => Promise<void>;
  loadFeedback: () => Promise<void>;
  updateFeedbackStatus: (id: string, status: FeedbackStatus) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;
}
