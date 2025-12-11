// ============================================
// AI CONTENT GENERATOR
// LinkedIn Posts, Hooks, Ideas, and more
// ============================================

import { callAI } from './config';

/**
 * Generate a LinkedIn post
 */
export const generatePost = async ({
  topic,
  style = 'professional',
  tone = 'engaging',
  language = 'de',
  includeEmojis = true,
  includeHashtags = true,
  maxLength = 3000,
}) => {
  const result = await callAI('post', {
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
};

/**
 * Generate hook variations for a topic
 */
export const generateHooks = async ({
  topic,
  count = 5,
  style = 'viral',
  language = 'de',
}) => {
  const result = await callAI('hooks', {
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
};

/**
 * Generate content ideas
 */
export const generateIdeas = async ({
  topic,
  count = 10,
  platform = 'linkedin',
  language = 'de',
}) => {
  const result = await callAI('ideas', {
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
};

/**
 * Analyze a hook/headline
 */
export const analyzeHook = async ({
  hook,
  language = 'de',
}) => {
  const result = await callAI('analyze', {
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
};

/**
 * Generate Twitter/X thread
 */
export const generateTwitterThread = async ({
  topic,
  tweets = 5,
  style = 'viral',
  language = 'de',
}) => {
  const result = await callAI('twitter', {
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
};

/**
 * Generate Instagram content
 */
export const generateInstagramContent = async ({
  topic,
  type = 'post', // 'post', 'story', 'reel'
  style = 'engaging',
  language = 'de',
}) => {
  const result = await callAI('instagram', {
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
};

/**
 * Generate newsletter content
 */
export const generateNewsletter = async ({
  topic,
  style = 'professional',
  sections = ['intro', 'main', 'cta'],
  language = 'de',
}) => {
  const result = await callAI('newsletter', {
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
};

/**
 * Generate blog article
 */
export const generateBlogArticle = async ({
  topic,
  style = 'seo',
  length = 'medium', // 'short', 'medium', 'long'
  language = 'de',
}) => {
  const result = await callAI('blog', {
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
};

/**
 * Repurpose content from one format to another
 */
export const repurposeContent = async ({
  content,
  fromFormat,
  toFormat,
  language = 'de',
}) => {
  const result = await callAI('repurpose', {
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
};

/**
 * Generate content calendar
 */
export const generateContentCalendar = async ({
  topic,
  days = 7,
  platforms = ['linkedin'],
  postsPerDay = 1,
  language = 'de',
}) => {
  const result = await callAI('calendar', {
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
};

/**
 * Batch generate multiple content pieces
 */
export const batchGenerate = async ({
  requests, // Array of { type, params }
}) => {
  const result = await callAI('batch', { requests });

  return {
    results: result.data?.results || result.results || [],
    metadata: {
      generatedAt: new Date().toISOString(),
      requestCount: requests.length,
    },
  };
};

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
  batchGenerate,
};
