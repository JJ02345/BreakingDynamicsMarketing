// Validation Module - Public API
export {
  validate,
  validateOrThrow,
  isValid,
  getFirstError,
  getErrorMap,
} from './validators';

export {
  sanitizeHTML,
  sanitizeText,
  sanitizeUrl,
  sanitizeObject,
  escapeHtml,
} from './sanitizers';

export {
  // Auth
  emailSchema,
  passwordSchema,
  loginSchema,
  registerSchema,
  // Carousel
  carouselTitleSchema,
  slideBlockSchema,
  slideSchema,
  carouselSettingsSchema,
  carouselSchema,
  // AI
  aiPatternSchema,
  aiToneSchema,
  aiGenerationRequestSchema,
  // Feedback
  feedbackTypeSchema,
  feedbackSchema,
  // Newsletter
  newsletterSchema,
  // Survey
  surveyBlockSchema,
  surveySchema,
} from './schemas';

export type {
  LoginInput,
  RegisterInput,
  CarouselInput,
  AIGenerationRequestInput,
  FeedbackInput,
  NewsletterInput,
  SurveyInput,
} from './schemas';
