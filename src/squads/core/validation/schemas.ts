// Validation Schemas - Zod schemas for all user inputs
import { z } from 'zod';

// ============================================
// Authentication Schemas
// ============================================

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email is too long');

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the privacy policy' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ============================================
// Carousel Schemas
// ============================================

export const carouselTitleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(100, 'Title is too long')
  .transform((val) => val.trim());

export const slideBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.unknown()),
  order: z.number().int().min(0),
});

export const slideSchema = z.object({
  id: z.string(),
  blocks: z.array(slideBlockSchema),
  backgroundColor: z.string(),
  backgroundGradient: z.string().optional(),
  backgroundImage: z.string().url().optional(),
  order: z.number().int().min(0),
});

export const carouselSettingsSchema = z.object({
  width: z.number().int().min(100).max(2000).default(1080),
  height: z.number().int().min(100).max(2000).default(1080),
  showBranding: z.boolean().default(true),
  font: z.string().default('Inter'),
  defaultBackgroundColor: z.string().default('#1A1A1D'),
});

export const carouselSchema = z.object({
  title: carouselTitleSchema,
  slides: z.array(slideSchema).min(1, 'At least one slide is required').max(20, 'Maximum 20 slides allowed'),
  settings: carouselSettingsSchema.optional(),
});

// ============================================
// AI Generation Schemas
// ============================================

export const aiPatternSchema = z.enum([
  'problem_solution',
  'listicle',
  'story',
  'comparison',
  'myth_busting',
]);

export const aiToneSchema = z.enum([
  'professional',
  'casual',
  'formal',
  'humorous',
  'inspirational',
]);

export const aiGenerationRequestSchema = z.object({
  hypothesis: z
    .string()
    .min(10, 'Hypothesis must be at least 10 characters')
    .max(1000, 'Hypothesis is too long'),
  slideCount: z.number().int().min(3).max(15),
  pattern: aiPatternSchema,
  tone: aiToneSchema,
  language: z.enum(['de', 'en', 'fr', 'es']),
});

// ============================================
// Feedback Schemas
// ============================================

export const feedbackTypeSchema = z.enum(['bug', 'feature', 'general']);

export const feedbackSchema = z.object({
  type: feedbackTypeSchema,
  message: z
    .string()
    .min(5, 'Message must be at least 5 characters')
    .max(5000, 'Message is too long'),
  email: z.string().email().optional().or(z.literal('')),
});

// ============================================
// Newsletter Schema
// ============================================

export const newsletterSchema = z.object({
  email: emailSchema,
});

// ============================================
// Survey Schemas
// ============================================

export const surveyBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.unknown()),
  order: z.number().int().min(0),
});

export const surveySchema = z.object({
  title: z.string().min(1).max(200),
  question: z.string().max(500).optional(),
  blocks: z.array(surveyBlockSchema).min(1).max(50),
  validation_challenge: z.string().max(2000).optional(),
});

// ============================================
// Type Exports
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CarouselInput = z.infer<typeof carouselSchema>;
export type AIGenerationRequestInput = z.infer<typeof aiGenerationRequestSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type SurveyInput = z.infer<typeof surveySchema>;
