// Carousel Storage Service
// Handles saving and loading carousels from Supabase

import { supabase } from '@/squads/core';
import { handleError, createAppError } from '@/squads/core';
import type { Carousel, Slide } from '../types';

// ============================================
// LOCAL STORAGE (DRAFT)
// ============================================

const CAROUSEL_DRAFT_KEY = 'carousel_draft';

interface CarouselDraft {
  slides: Slide[];
  title: string;
  activeSlideIndex: number;
  lastModified: number;
}

/**
 * Save carousel draft to localStorage
 */
export function saveDraft(draft: CarouselDraft): void {
  try {
    localStorage.setItem(CAROUSEL_DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.error('[CarouselStorage] Failed to save draft:', e);
  }
}

/**
 * Load carousel draft from localStorage
 */
export function loadDraft(): CarouselDraft | null {
  try {
    const saved = localStorage.getItem(CAROUSEL_DRAFT_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('[CarouselStorage] Failed to load draft:', e);
  }
  return null;
}

/**
 * Clear carousel draft from localStorage
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(CAROUSEL_DRAFT_KEY);
  } catch (e) {
    console.error('[CarouselStorage] Failed to clear draft:', e);
  }
}

/**
 * Check if a draft exists
 */
export function hasDraft(): boolean {
  return localStorage.getItem(CAROUSEL_DRAFT_KEY) !== null;
}

// ============================================
// SUPABASE STORAGE
// ============================================

interface CarouselRow {
  id: string;
  user_id: string;
  title: string;
  slides: Slide[];
  settings: { width: number; height: number };
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new carousel in the database
 */
export async function createCarousel(carousel: Omit<Carousel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Carousel> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw createAppError('Not authenticated', 'AUTH_REQUIRED', {
      userMessage: 'Bitte melde dich an, um Carousels zu speichern.',
    });
  }

  const { data, error } = await supabase
    .from('carousels')
    .insert({
      user_id: userData.user.id,
      title: carousel.title,
      slides: carousel.slides,
      settings: carousel.settings,
      metadata: carousel.metadata || {},
    })
    .select()
    .single();

  if (error) {
    console.error('[CarouselStorage] Create error:', error);
    throw createAppError('Failed to create carousel', 'CREATE_FAILED', {
      userMessage: 'Carousel konnte nicht gespeichert werden.',
      originalError: error,
    });
  }

  return mapRowToCarousel(data);
}

/**
 * Update an existing carousel
 */
export async function updateCarousel(
  id: string,
  updates: Partial<Omit<Carousel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<Carousel> {
  const { data, error } = await supabase
    .from('carousels')
    .update({
      title: updates.title,
      slides: updates.slides,
      settings: updates.settings,
      metadata: updates.metadata,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[CarouselStorage] Update error:', error);
    throw createAppError('Failed to update carousel', 'UPDATE_FAILED', {
      userMessage: 'Carousel konnte nicht aktualisiert werden.',
      originalError: error,
    });
  }

  return mapRowToCarousel(data);
}

/**
 * Delete a carousel
 */
export async function deleteCarousel(id: string): Promise<void> {
  const { error } = await supabase.from('carousels').delete().eq('id', id);

  if (error) {
    console.error('[CarouselStorage] Delete error:', error);
    throw createAppError('Failed to delete carousel', 'DELETE_FAILED', {
      userMessage: 'Carousel konnte nicht gelöscht werden.',
      originalError: error,
    });
  }
}

/**
 * Get a single carousel by ID
 */
export async function getCarousel(id: string): Promise<Carousel | null> {
  const { data, error } = await supabase
    .from('carousels')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('[CarouselStorage] Get error:', error);
    throw createAppError('Failed to load carousel', 'LOAD_FAILED', {
      userMessage: 'Carousel konnte nicht geladen werden.',
      originalError: error,
    });
  }

  return mapRowToCarousel(data);
}

/**
 * Get all carousels for the current user
 */
export async function getUserCarousels(): Promise<Carousel[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return [];
  }

  const { data, error } = await supabase
    .from('carousels')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[CarouselStorage] Get user carousels error:', error);
    throw createAppError('Failed to load carousels', 'LOAD_FAILED', {
      userMessage: 'Carousels konnten nicht geladen werden.',
      originalError: error,
    });
  }

  return (data || []).map(mapRowToCarousel);
}

/**
 * Get carousel count for user
 */
export async function getUserCarouselCount(): Promise<number> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return 0;
  }

  const { count, error } = await supabase
    .from('carousels')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userData.user.id);

  if (error) {
    console.error('[CarouselStorage] Count error:', error);
    return 0;
  }

  return count || 0;
}

// ============================================
// HELPERS
// ============================================

function mapRowToCarousel(row: CarouselRow): Carousel {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    slides: row.slides,
    settings: row.settings,
    metadata: row.metadata as any,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default {
  // Draft functions
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  // Database functions
  createCarousel,
  updateCarousel,
  deleteCarousel,
  getCarousel,
  getUserCarousels,
  getUserCarouselCount,
};
