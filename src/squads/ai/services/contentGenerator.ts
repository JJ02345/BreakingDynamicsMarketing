// Content Generator Service
// AI-powered content generation for various platforms

import { callAI } from './aiProxy';
import type {
  PostGenerationParams,
  GeneratedPost,
  HooksGenerationParams,
  GeneratedHooks,
  IdeasGenerationParams,
  GeneratedIdeas,
  HookAnalysisParams,
  HookAnalysis,
} from '../types';

// ============================================
// POST GENERATION
// ============================================

/**
 * Generate a LinkedIn post
 */
export async function generatePost(params: PostGenerationParams): Promise<GeneratedPost> {
  const {
    topic,
    style = 'professional',
    tone = 'engaging',
    language = 'de',
    includeEmojis = true,
    includeHashtags = true,
    maxLength = 3000,
  } = params;

  const result = await callAI<{
    post?: string;
    hashtags?: string[];
    hook?: string;
    data?: {
      post?: string;
      hashtags?: string[];
      hook?: string;
      model?: string;
    };
  }>('post', {
    topic,
    style,
    tone,
    language,
    includeEmojis,
    includeHashtags,
    maxLength,
  });

  return {
    post: result.data?.post || result.post || '',
    hashtags: result.data?.hashtags || result.hashtags || [],
    hook: result.data?.hook || result.hook || '',
    metadata: {
      generatedAt: new Date().toISOString(),
      topic,
      style,
      model: result.data?.model || 'marketing-beast',
    },
  };
}

// ============================================
// HOOKS GENERATION
// ============================================

/**
 * Generate hook variations for a topic
 */
export async function generateHooks(params: HooksGenerationParams): Promise<GeneratedHooks> {
  const {
    topic,
    count = 5,
    style = 'viral',
    language = 'de',
  } = params;

  const result = await callAI<{
    hooks?: string[];
    data?: { hooks?: string[] };
  }>('hooks', {
    topic,
    count,
    style,
    language,
  });

  return {
    hooks: result.data?.hooks || result.hooks || [],
    metadata: {
      generatedAt: new Date().toISOString(),
      topic,
      count,
      style,
    },
  };
}

// ============================================
// IDEAS GENERATION
// ============================================

/**
 * Generate content ideas
 */
export async function generateIdeas(params: IdeasGenerationParams): Promise<GeneratedIdeas> {
  const {
    topic,
    count = 10,
    platform = 'linkedin',
    language = 'de',
  } = params;

  const result = await callAI<{
    ideas?: string[];
    data?: { ideas?: string[] };
  }>('ideas', {
    topic,
    count,
    platform,
    language,
  });

  return {
    ideas: result.data?.ideas || result.ideas || [],
    metadata: {
      generatedAt: new Date().toISOString(),
      topic,
      platform,
    },
  };
}

// ============================================
// HOOK ANALYSIS
// ============================================

/**
 * Analyze a hook/headline
 */
export async function analyzeHook(params: HookAnalysisParams): Promise<HookAnalysis> {
  const { hook, language = 'de' } = params;

  const result = await callAI<{
    score?: number;
    feedback?: string[];
    suggestions?: string[];
    strengths?: string[];
    weaknesses?: string[];
    data?: {
      score?: number;
      feedback?: string[];
      suggestions?: string[];
      strengths?: string[];
      weaknesses?: string[];
    };
  }>('analyze', {
    hook,
    language,
  });

  return {
    score: result.data?.score || result.score || 0,
    feedback: result.data?.feedback || result.feedback || [],
    suggestions: result.data?.suggestions || result.suggestions || [],
    strengths: result.data?.strengths || result.strengths || [],
    weaknesses: result.data?.weaknesses || result.weaknesses || [],
  };
}

// ============================================
// TWITTER THREAD
// ============================================

interface TwitterThread {
  thread: string[];
  metadata: {
    generatedAt: string;
    topic: string;
    platform: string;
  };
}

/**
 * Generate Twitter/X thread
 */
export async function generateTwitterThread(params: {
  topic: string;
  tweets?: number;
  style?: string;
  language?: string;
}): Promise<TwitterThread> {
  const {
    topic,
    tweets = 5,
    style = 'viral',
    language = 'de',
  } = params;

  const result = await callAI<{
    thread?: string[];
    data?: { thread?: string[] };
  }>('twitter', {
    topic,
    tweets,
    style,
    language,
  });

  return {
    thread: result.data?.thread || result.thread || [],
    metadata: {
      generatedAt: new Date().toISOString(),
      topic,
      platform: 'twitter',
    },
  };
}

// ============================================
// INSTAGRAM CONTENT
// ============================================

interface InstagramContent {
  caption: string;
  hashtags: string[];
  hooks: string[];
  metadata: {
    generatedAt: string;
    topic: string;
    type: string;
    platform: string;
  };
}

/**
 * Generate Instagram content
 */
export async function generateInstagramContent(params: {
  topic: string;
  type?: 'post' | 'story' | 'reel';
  style?: string;
  language?: string;
}): Promise<InstagramContent> {
  const {
    topic,
    type = 'post',
    style = 'engaging',
    language = 'de',
  } = params;

  const result = await callAI<{
    caption?: string;
    hashtags?: string[];
    hooks?: string[];
    data?: {
      caption?: string;
      hashtags?: string[];
      hooks?: string[];
    };
  }>('instagram', {
    topic,
    type,
    style,
    language,
  });

  return {
    caption: result.data?.caption || result.caption || '',
    hashtags: result.data?.hashtags || result.hashtags || [],
    hooks: result.data?.hooks || result.hooks || [],
    metadata: {
      generatedAt: new Date().toISOString(),
      topic,
      type,
      platform: 'instagram',
    },
  };
}

// ============================================
// NEWSLETTER
// ============================================

interface Newsletter {
  subject: string;
  preheader: string;
  content: Record<string, unknown>;
  metadata: {
    generatedAt: string;
    topic: string;
    platform: string;
  };
}

/**
 * Generate newsletter content
 */
export async function generateNewsletter(params: {
  topic: string;
  style?: string;
  sections?: string[];
  language?: string;
}): Promise<Newsletter> {
  const {
    topic,
    style = 'professional',
    sections = ['intro', 'main', 'cta'],
    language = 'de',
  } = params;

  const result = await callAI<{
    subject?: string;
    preheader?: string;
    content?: Record<string, unknown>;
    data?: {
      subject?: string;
      preheader?: string;
      content?: Record<string, unknown>;
    };
  }>('newsletter', {
    topic,
    style,
    sections,
    language,
  });

  return {
    subject: result.data?.subject || result.subject || '',
    preheader: result.data?.preheader || result.preheader || '',
    content: result.data?.content || result.content || {},
    metadata: {
      generatedAt: new Date().toISOString(),
      topic,
      platform: 'email',
    },
  };
}

// ============================================
// BLOG ARTICLE
// ============================================

interface BlogArticle {
  title: string;
  metaDescription: string;
  content: string;
  outline: string[];
  metadata: {
    generatedAt: string;
    topic: string;
    platform: string;
  };
}

/**
 * Generate blog article
 */
export async function generateBlogArticle(params: {
  topic: string;
  style?: string;
  length?: 'short' | 'medium' | 'long';
  language?: string;
}): Promise<BlogArticle> {
  const {
    topic,
    style = 'seo',
    length = 'medium',
    language = 'de',
  } = params;

  const result = await callAI<{
    title?: string;
    metaDescription?: string;
    content?: string;
    outline?: string[];
    data?: {
      title?: string;
      metaDescription?: string;
      content?: string;
      outline?: string[];
    };
  }>('blog', {
    topic,
    style,
    length,
    language,
  });

  return {
    title: result.data?.title || result.title || '',
    metaDescription: result.data?.metaDescription || result.metaDescription || '',
    content: result.data?.content || result.content || '',
    outline: result.data?.outline || result.outline || [],
    metadata: {
      generatedAt: new Date().toISOString(),
      topic,
      platform: 'blog',
    },
  };
}

// ============================================
// CONTENT REPURPOSING
// ============================================

interface RepurposedContent {
  result: string;
  format: string;
  metadata: {
    generatedAt: string;
    fromFormat: string;
    toFormat: string;
  };
}

/**
 * Repurpose content from one format to another
 */
export async function repurposeContent(params: {
  content: string;
  fromFormat: string;
  toFormat: string;
  language?: string;
}): Promise<RepurposedContent> {
  const { content, fromFormat, toFormat, language = 'de' } = params;

  const result = await callAI<{
    result?: string;
    data?: { result?: string };
  }>('repurpose', {
    content,
    fromFormat,
    toFormat,
    language,
  });

  return {
    result: result.data?.result || result.result || '',
    format: toFormat,
    metadata: {
      generatedAt: new Date().toISOString(),
      fromFormat,
      toFormat,
    },
  };
}

// ============================================
// CONTENT CALENDAR
// ============================================

interface ContentCalendar {
  calendar: Array<{
    date: string;
    posts: Array<{
      platform: string;
      type: string;
      idea: string;
    }>;
  }>;
  metadata: {
    generatedAt: string;
    topic: string;
    days: number;
    platforms: string[];
  };
}

/**
 * Generate content calendar
 */
export async function generateContentCalendar(params: {
  topic: string;
  days?: number;
  platforms?: string[];
  postsPerDay?: number;
  language?: string;
}): Promise<ContentCalendar> {
  const {
    topic,
    days = 7,
    platforms = ['linkedin'],
    postsPerDay = 1,
    language = 'de',
  } = params;

  const result = await callAI<{
    calendar?: ContentCalendar['calendar'];
    data?: { calendar?: ContentCalendar['calendar'] };
  }>('calendar', {
    topic,
    days,
    platforms,
    postsPerDay,
    language,
  });

  return {
    calendar: result.data?.calendar || result.calendar || [],
    metadata: {
      generatedAt: new Date().toISOString(),
      topic,
      days,
      platforms,
    },
  };
}

export default {
  generatePost,
  generateHooks,
  generateIdeas,
  analyzeHook,
  generateTwitterThread,
  generateInstagramContent,
  generateNewsletter,
  generateBlogArticle,
  repurposeContent,
  generateContentCalendar,
};
