// Re-export from modular structure for backward compatibility
export { supabase } from './supabase/client';
export { auth } from './supabase/auth';
export { admin } from './supabase/admin';
export { analytics } from './supabase/analytics';
export { storage } from './supabase/storage';

// Merged db object for full backward compatibility
import { db as dbModule } from './supabase/db';
import { analytics as analyticsModule } from './supabase/analytics';
import { storage as storageModule } from './supabase/storage';
import { admin as adminModule } from './supabase/admin';

// Combined db export with all methods (backward compatible)
export const db = {
  ...dbModule,
  // Analytics methods
  trackEvent: analyticsModule.trackEvent.bind(analyticsModule),
  trackCarouselCreated: analyticsModule.trackCarouselCreated.bind(analyticsModule),
  trackCarouselExported: analyticsModule.trackCarouselExported.bind(analyticsModule),
  trackAIGenerated: analyticsModule.trackAIGenerated.bind(analyticsModule),
  trackSlideAdded: analyticsModule.trackSlideAdded.bind(analyticsModule),
  trackTemplateUsed: analyticsModule.trackTemplateUsed.bind(analyticsModule),
  trackPageView: analyticsModule.trackPageView.bind(analyticsModule),
  trackUserSignedUp: analyticsModule.trackUserSignedUp.bind(analyticsModule),
  trackEditorOpened: analyticsModule.trackEditorOpened.bind(analyticsModule),
  incrementCarouselCount: analyticsModule.incrementCarouselCount.bind(analyticsModule),
  getCarouselCount: analyticsModule.getCarouselCount.bind(analyticsModule),
  // Storage methods
  uploadImage: storageModule.uploadImage.bind(storageModule),
  deleteImage: storageModule.deleteImage.bind(storageModule),
  getUserImages: storageModule.getUserImages.bind(storageModule),
  // Admin methods
  getAllFeedback: adminModule.getAllFeedback.bind(adminModule),
  updateFeedbackStatus: adminModule.updateFeedbackStatus.bind(adminModule),
  deleteFeedback: adminModule.deleteFeedback.bind(adminModule),
  getFeedbackStats: adminModule.getFeedbackStats.bind(adminModule),
  getAllLeads: adminModule.getAllLeads.bind(adminModule),
  getLeadStats: adminModule.getLeadStats.bind(adminModule),
  getConversionFunnel: adminModule.getConversionFunnel.bind(adminModule),
  getDailyStats: adminModule.getDailyStats.bind(adminModule),
  getEventStats: adminModule.getEventStats.bind(adminModule),
};

import { supabase } from './supabase/client';
export default supabase;
