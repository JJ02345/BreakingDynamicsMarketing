// Application Limits and Constraints

export const LIMITS = {
  // LinkedIn
  LINKEDIN_POST_CHARS: 3000,
  LINKEDIN_POLL_QUESTION: 140,
  LINKEDIN_POLL_OPTION: 30,

  // Carousel
  CAROUSEL_TITLE: 100,
  CAROUSEL_MIN_SLIDES: 1,
  CAROUSEL_MAX_SLIDES: 20,
  SLIDE_WIDTH: 1080,
  SLIDE_HEIGHT: 1080,

  // Text blocks
  HEADING_CHARS: 100,
  PARAGRAPH_CHARS: 500,
  QUOTE_CHARS: 300,

  // Survey
  SURVEY_TITLE: 200,
  SURVEY_QUESTION: 500,
  SURVEY_MAX_BLOCKS: 50,

  // Images
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

  // AI
  AI_HYPOTHESIS_MIN: 10,
  AI_HYPOTHESIS_MAX: 1000,
  AI_SLIDES_MIN: 3,
  AI_SLIDES_MAX: 15,

  // Feedback
  FEEDBACK_MESSAGE_MIN: 5,
  FEEDBACK_MESSAGE_MAX: 5000,

  // Auth
  PASSWORD_MIN: 12,
  PASSWORD_MAX: 128,
  EMAIL_MAX: 255,
} as const;

export type LimitKey = keyof typeof LIMITS;
