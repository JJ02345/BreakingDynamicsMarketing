// Survey Squad Types
// Type definitions for survey builder

// ============================================
// SURVEY BLOCK TYPES
// ============================================

export type SurveyBlockType =
  | 'single_choice'
  | 'multi_choice'
  | 'rating'
  | 'nps'
  | 'text_input'
  | 'yes_no'
  | 'header'
  | 'description'
  | 'problem_statement'
  | 'hypothesis'
  | 'solution_test';

export interface SurveyBlockOption {
  id: string;
  label: string;
  value?: string;
}

export interface SurveyBlockContent {
  question?: string;
  description?: string;
  options?: SurveyBlockOption[];
  required?: boolean;
  placeholder?: string;
  minRating?: number;
  maxRating?: number;
  labels?: { low?: string; high?: string };
}

export interface SurveyBlock {
  id: string;
  type: SurveyBlockType;
  content: SurveyBlockContent;
  order: number;
}

// ============================================
// SURVEY TYPES
// ============================================

export type SurveyMode = 'online' | 'offline';

export interface SurveySettings {
  showProgressBar?: boolean;
  allowBack?: boolean;
  shuffleQuestions?: boolean;
  requireAll?: boolean;
  theme?: string;
  brandColor?: string;
}

export interface Survey {
  id: string;
  userId: string;
  title: string;
  description?: string;
  mode: SurveyMode;
  blocks: SurveyBlock[];
  settings: SurveySettings;
  isPublished: boolean;
  shareUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SURVEY RESPONSE
// ============================================

export interface SurveyAnswer {
  blockId: string;
  value: string | string[] | number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: SurveyAnswer[];
  completedAt: string;
  metadata?: {
    userAgent?: string;
    language?: string;
  };
}

// ============================================
// SURVEY TEMPLATE
// ============================================

export interface SurveyTemplate {
  id: string;
  name: string;
  nameDE: string;
  description: string;
  descriptionDE: string;
  icon: string;
  blockCount: number;
  blocks: Omit<SurveyBlock, 'id' | 'order'>[];
}

// ============================================
// EDITOR STATE
// ============================================

export interface SurveyEditorState {
  survey: Survey | null;
  activeBlockIndex: number;
  previewMode: boolean;
  isSaving: boolean;
  isPublishing: boolean;
}

export interface SurveyContextValue extends SurveyEditorState {
  setBlocks: (blocks: SurveyBlock[]) => void;
  addBlock: (block: Omit<SurveyBlock, 'id' | 'order'>) => void;
  updateBlock: (id: string, updates: Partial<SurveyBlock>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  save: () => Promise<void>;
  publish: () => Promise<void>;
}
