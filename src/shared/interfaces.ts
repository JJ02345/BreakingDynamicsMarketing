// Shared Interfaces - Cross-Squad Contracts
// These interfaces define the "communication protocols" between squads

// ============================================
// User & Authentication
// ============================================

export interface User {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id: string;
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// ============================================
// Carousel & Slides
// ============================================

export interface Block {
  id: string;
  type: string;
  data: Record<string, unknown>;
  order: number;
}

export interface Slide {
  id: string;
  blocks: Block[];
  backgroundColor: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  order: number;
}

export interface Carousel {
  id: string;
  user_id: string;
  title: string;
  slides: Slide[];
  settings: CarouselSettings;
  created_at: string;
  updated_at: string;
}

export interface CarouselSettings {
  width: number;
  height: number;
  showBranding: boolean;
  font: string;
  defaultBackgroundColor: string;
}

// ============================================
// Survey
// ============================================

export interface SurveyBlock {
  id: string;
  type: string;
  data: Record<string, unknown>;
  order: number;
}

export interface Survey {
  id: string;
  user_id: string;
  title: string;
  question?: string;
  blocks: SurveyBlock[];
  text?: string;
  block_data?: Record<string, unknown>;
  validation_challenge?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  answers: Record<string, unknown>;
  created_at: string;
}

// ============================================
// Feedback
// ============================================

export type FeedbackType = 'bug' | 'feature' | 'general';
export type FeedbackStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

export interface Feedback {
  id: string;
  user_id?: string;
  type: FeedbackType;
  message: string;
  email?: string;
  page_url?: string;
  user_agent?: string;
  status: FeedbackStatus;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

// ============================================
// Analytics
// ============================================

export interface AnalyticsEvent {
  id?: string;
  event_name: string;
  event_data: Record<string, unknown>;
  user_id?: string;
  session_id?: string;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  created_at?: string;
}

// ============================================
// AI Generation
// ============================================

export type AIPattern =
  | 'problem_solution'
  | 'listicle'
  | 'story'
  | 'comparison'
  | 'myth_busting';

export type AITone =
  | 'professional'
  | 'casual'
  | 'formal'
  | 'humorous'
  | 'inspirational';

export type AIStyle =
  | 'viral'
  | 'educational'
  | 'storytelling'
  | 'controversial'
  | 'inspirational'
  | 'data_driven'
  | 'how_to'
  | 'listicle'
  | 'comparison'
  | 'myth_busting';

export interface AIGenerationRequest {
  hypothesis: string;
  slideCount: number;
  pattern: AIPattern;
  tone: AITone;
  style: AIStyle;
  language: 'de' | 'en' | 'fr' | 'es';
}

export interface AIGenerationResult {
  success: boolean;
  slides?: Slide[];
  error?: string;
}

// ============================================
// Newsletter
// ============================================

export interface NewsletterSubscription {
  email: string;
  created_at?: string;
}

// ============================================
// Leads
// ============================================

export interface Lead {
  id: string;
  email: string;
  survey_title?: string;
  survey_question?: string;
  survey_text?: string;
  block_data?: Record<string, unknown>;
  validation_challenge?: string;
  source?: string;
  converted_to_user: boolean;
  converted_at?: string;
  created_at: string;
}

// ============================================
// Common Utility Types
// ============================================

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
