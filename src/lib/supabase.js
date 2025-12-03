import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Auth Helper Functions
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
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
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
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database Helper Functions
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

  // ============ FEEDBACK ============
  
  // Submit feedback
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
      total: data.length,
      thisWeek: data.filter(s => new Date(s.created_at) > weekAgo).length,
      thisMonth: data.filter(s => new Date(s.created_at) > monthAgo).length,
    };
  },
};

export default supabase;
