import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Security check: Warn if credentials are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase credentials missing!\n' +
    'Please create a .env file with:\n' +
    '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key\n\n' +
    'See .env.example for reference.'
  );
}

// Security check: Warn if using placeholder in production
if (import.meta.env.PROD && (!supabaseUrl || supabaseUrl.includes('placeholder'))) {
  console.error('🚨 SECURITY: Running in production without valid Supabase credentials!');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// ============================================
// AUTH HELPER FUNCTIONS
// ============================================

// Cache für Admin-Status (vermeidet wiederholte DB-Abfragen)
let adminStatusCache = {
  userId: null,
  isAdmin: false,
  timestamp: 0,
};
const ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 Minuten

export const auth = {
  // Sign up with email and password
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // Cache invalidieren bei neuem Login
    adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };
    
    // Check if this email was a lead and mark as converted
    if (data?.user?.email) {
      db.convertLead(data.user.email).catch(console.error);
    }
    
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    // Cache invalidieren
    adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };
    if (error) throw error;
  },

  // Get current user
  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get current session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      // Cache invalidieren bei Auth-Änderungen
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
        adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };
      }
      
      // Mark lead as converted on sign in
      if (event === 'SIGNED_IN' && session?.user?.email) {
        db.convertLead(session.user.email).catch(console.error);
      }
      
      callback(event, session);
    });
  },

  // ============================================
  // SECURE ADMIN CHECK - Prüft gegen Datenbank
  // ============================================
  async isAdmin(user = null) {
    try {
      // User holen falls nicht übergeben
      if (!user) {
        user = await this.getUser();
      }
      
      if (!user) return false;

      // Cache prüfen
      const now = Date.now();
      if (
        adminStatusCache.userId === user.id &&
        now - adminStatusCache.timestamp < ADMIN_CACHE_TTL
      ) {
        return adminStatusCache.isAdmin;
      }

      // Aus Datenbank laden
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Admin check failed:', error);
        return false;
      }

      // Cache aktualisieren
      const isAdmin = !!data;
      adminStatusCache = {
        userId: user.id,
        isAdmin,
        timestamp: now,
      };

      return isAdmin;
    } catch (err) {
      console.error('Admin check error:', err);
      return false;
    }
  },

  // Cache invalidieren (z.B. nach Admin-Änderungen)
  invalidateAdminCache() {
    adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };
  },
};

// ============================================
// DATABASE HELPER FUNCTIONS
// ============================================

export const db = {
  // ============ SURVEYS ============
  
  // Create a new survey
  async createSurvey(surveyData) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('surveys')
      .insert({
        user_id: user.id,
        title: surveyData.title,
        question: surveyData.question,
        blocks: surveyData.blocks,
        text: surveyData.text,
        block_data: surveyData.blockData,
        validation_challenge: surveyData.validation_challenge,
        scheduled_at: surveyData.scheduled || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all surveys for current user
  async getSurveys() {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform to match frontend format
    return data.map(s => ({
      id: s.id,
      title: s.title,
      question: s.question,
      blocks: s.blocks,
      created: s.created_at.split('T')[0],
      scheduled: s.scheduled_at,
      text: s.text,
      blockData: s.block_data || [],
      validation_challenge: s.validation_challenge,
    }));
  },

  // Update a survey
  async updateSurvey(id, surveyData) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('surveys')
      .update({
        title: surveyData.title,
        question: surveyData.question,
        blocks: surveyData.blocks,
        text: surveyData.text,
        block_data: surveyData.blockData,
        validation_challenge: surveyData.validation_challenge,
        scheduled_at: surveyData.scheduled || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a survey
  async deleteSurvey(id) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // ============ LEADS (Soft Login) ============
  
  // Save lead and send survey email
  async saveLead(leadData) {
    // 1. Lead in Datenbank speichern
    const { data, error } = await supabase
      .from('leads')
      .insert({
        email: leadData.email,
        survey_title: leadData.surveyTitle,
        survey_question: leadData.surveyQuestion,
        survey_text: leadData.surveyText,
        block_data: leadData.blockData,
        validation_challenge: leadData.validationChallenge,
        source: 'editor',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to save lead:', error);
      // Nicht abbrechen - E-Mail trotzdem versuchen
    }

    // 2. E-Mail via Edge Function senden
    try {
      const response = await supabase.functions.invoke('send-survey-email', {
        body: {
          email: leadData.email,
          surveyTitle: leadData.surveyTitle,
          surveyText: leadData.surveyText,
          surveyQuestion: leadData.surveyQuestion,
        },
      });

      if (response.error) {
        throw response.error;
      }

      return { success: true, lead: data, emailSent: true };
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Lead wurde gespeichert, aber E-Mail fehlgeschlagen
      return { success: true, lead: data, emailSent: false, emailError: emailError.message };
    }
  },

  // Mark lead as converted (wenn User sich später registriert)
  async convertLead(email) {
    const { error } = await supabase
      .from('leads')
      .update({ 
        converted_to_user: true, 
        converted_at: new Date().toISOString() 
      })
      .eq('email', email)
      .eq('converted_to_user', false);

    if (error) {
      console.error('Failed to convert lead:', error);
    }
  },

  // ============ FEEDBACK (Public) ============
  
  // Submit feedback (anyone can do this)
  async submitFeedback(feedbackData) {
    const user = await auth.getUser();

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: user?.id || null,
        type: feedbackData.type,
        message: feedbackData.message,
        email: feedbackData.email || null,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // ============ ADMIN: FEEDBACK MANAGEMENT ============
  // Diese Funktionen sind durch RLS geschützt - nur Admins haben Zugriff

  // Get all feedback (admin only - RLS enforced)
  async getAllFeedback(filters = {}) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Admin-Check (zusätzliche Sicherheit, RLS ist die Hauptsicherung)
    const isAdmin = await auth.isAdmin(user);
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    let query = supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    // RLS wird den Zugriff blockieren wenn kein Admin
    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('permission')) {
        throw new Error('Admin access required');
      }
      throw error;
    }
    
    return (data || []).map(f => ({
      id: f.id,
      userId: f.user_id,
      type: f.type,
      message: f.message,
      email: f.email,
      pageUrl: f.page_url,
      userAgent: f.user_agent,
      status: f.status || 'new',
      createdAt: f.created_at,
      adminNotes: f.admin_notes,
    }));
  },

  // Update feedback status (admin only - RLS enforced)
  async updateFeedbackStatus(id, status, adminNotes = null) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const isAdmin = await auth.isAdmin(user);
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    const updateData = { status };
    if (adminNotes !== null) {
      updateData.admin_notes = adminNotes;
    }

    const { data, error } = await supabase
      .from('feedback')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('permission')) {
        throw new Error('Admin access required');
      }
      throw error;
    }
    return data;
  },

  // Delete feedback (admin only - RLS enforced)
  async deleteFeedback(id) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const isAdmin = await auth.isAdmin(user);
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('permission')) {
        throw new Error('Admin access required');
      }
      throw error;
    }
  },

  // Get feedback stats (admin only)
  async getFeedbackStats() {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const isAdmin = await auth.isAdmin(user);
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    const { data, error } = await supabase
      .from('feedback')
      .select('type, status, created_at');

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('permission')) {
        throw new Error('Admin access required');
      }
      throw error;
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: data?.length || 0,
      thisWeek: (data || []).filter(f => new Date(f.created_at) > weekAgo).length,
      byType: {
        bug: (data || []).filter(f => f.type === 'bug').length,
        feature: (data || []).filter(f => f.type === 'feature').length,
        general: (data || []).filter(f => f.type === 'general').length,
      },
      byStatus: {
        new: (data || []).filter(f => f.status === 'new' || !f.status).length,
        in_progress: (data || []).filter(f => f.status === 'in_progress').length,
        resolved: (data || []).filter(f => f.status === 'resolved').length,
        closed: (data || []).filter(f => f.status === 'closed').length,
      },
    };
  },

  // ============ ADMIN: LEADS MANAGEMENT ============
  
  // Get all leads (admin only)
  async getAllLeads(filters = {}) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const isAdmin = await auth.isAdmin(user);
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.converted !== undefined) {
      query = query.eq('converted_to_user', filters.converted);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data || []).map(l => ({
      id: l.id,
      email: l.email,
      surveyTitle: l.survey_title,
      surveyQuestion: l.survey_question,
      source: l.source,
      converted: l.converted_to_user,
      convertedAt: l.converted_at,
      createdAt: l.created_at,
    }));
  },

  // Get lead stats (admin only)
  async getLeadStats() {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const isAdmin = await auth.isAdmin(user);
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    const { data, error } = await supabase
      .from('leads')
      .select('converted_to_user, created_at');

    if (error) {
      throw error;
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: data?.length || 0,
      thisWeek: (data || []).filter(l => new Date(l.created_at) > weekAgo).length,
      converted: (data || []).filter(l => l.converted_to_user).length,
      conversionRate: data?.length 
        ? Math.round(((data || []).filter(l => l.converted_to_user).length / data.length) * 100)
        : 0,
    };
  },

  // ============ ANALYTICS ============
  
  // Get survey stats for current user
  async getSurveyStats() {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('surveys')
      .select('created_at')
      .eq('user_id', user.id);

    if (error) throw error;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      total: data?.length || 0,
      thisWeek: (data || []).filter(s => new Date(s.created_at) > weekAgo).length,
      thisMonth: (data || []).filter(s => new Date(s.created_at) > monthAgo).length,
    };
  },
};

export default supabase;
