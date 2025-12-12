// Marketing Squad Types
// Type definitions for landing page and marketing features

// ============================================
// NEWSLETTER
// ============================================

export interface NewsletterSubscription {
  email: string;
  source?: string;
  subscribedAt: string;
}

export interface NewsletterState {
  isLoading: boolean;
  isSubscribed: boolean;
  error: string | null;
}

// ============================================
// TESTIMONIALS
// ============================================

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating?: number;
}

// ============================================
// FEATURES
// ============================================

export interface Feature {
  id: string;
  icon: string;
  title: string;
  titleDE: string;
  description: string;
  descriptionDE: string;
  isComingSoon?: boolean;
}

// ============================================
// COMMUNITY
// ============================================

export interface CommunityStats {
  totalUsers: number;
  carouselsCreated: number;
  surveysCompleted: number;
}

// ============================================
// LEGAL PAGES
// ============================================

export interface LegalSection {
  title: string;
  content: string;
}

export interface LegalPage {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}
