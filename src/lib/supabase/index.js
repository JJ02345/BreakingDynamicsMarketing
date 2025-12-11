// Main Supabase module - re-exports all functionality
export { supabase } from './client';
export { auth } from './auth';
export { db } from './db';
export { admin } from './admin';
export { analytics } from './analytics';
export { storage } from './storage';

// For backward compatibility - combined db object with all methods
import { db as dbModule } from './db';
import { analytics as analyticsModule } from './analytics';
import { storage as storageModule } from './storage';
import { admin as adminModule } from './admin';

// Merged db object for backward compatibility
export const dbCompat = {
  ...dbModule,
  ...analyticsModule,
  ...storageModule,
  // Admin functions with proper names
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

export default { supabase: (await import('./client')).supabase };
