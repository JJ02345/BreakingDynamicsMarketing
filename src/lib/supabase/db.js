import { supabase } from './client';
import { auth } from './auth';

export const db = {
  // ============ SURVEYS ============
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

  async getSurveys() {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

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

  // ============ CAROUSELS ============
  async createCarousel(carouselData) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('carousels')
      .insert({
        user_id: user.id,
        title: carouselData.title,
        slides: carouselData.slides,
        settings: carouselData.settings || { width: 1080, height: 1080 },
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCarousels() {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('carousels')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(c => ({
      id: c.id,
      title: c.title,
      slides: c.slides,
      settings: c.settings,
      created: c.created_at,
      updated: c.updated_at,
    }));
  },

  async updateCarousel(id, carouselData) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('carousels')
      .update({
        title: carouselData.title,
        slides: carouselData.slides,
        settings: carouselData.settings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCarousel(id) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('carousels')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // ============ LEADS ============
  async saveLead(leadData) {
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
    }

    try {
      const response = await supabase.functions.invoke('send-survey-email', {
        body: {
          email: leadData.email,
          surveyTitle: leadData.surveyTitle,
          surveyText: leadData.surveyText,
          surveyQuestion: leadData.surveyQuestion,
        },
      });

      if (response.error) throw response.error;
      return { success: true, lead: data, emailSent: true };
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return { success: true, lead: data, emailSent: false, emailError: emailError.message };
    }
  },

  async convertLead(email) {
    const { error } = await supabase
      .from('leads')
      .update({
        converted_to_user: true,
        converted_at: new Date().toISOString(),
      })
      .eq('email', email)
      .eq('converted_to_user', false);

    if (error) {
      console.error('Failed to convert lead:', error);
    }
  },

  // ============ FEEDBACK ============
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

  // ============ NEWSLETTER ============
  async subscribeNewsletter(email) {
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return { success: true, alreadySubscribed: true };
    }

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        source: 'landing_page',
        subscribed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { success: true, alreadySubscribed: true };
      }
      throw error;
    }

    return { success: true, data };
  },

  // ============ CUSTOM SLIDES ============
  async saveCustomSlide(slideData) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('custom_slides')
      .insert({
        user_id: user.id,
        name: slideData.name,
        slide_data: slideData.slide,
        preview_image: slideData.previewImage || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCustomSlides() {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('custom_slides')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(s => ({
      id: s.id,
      name: s.name,
      slide: s.slide_data,
      previewImage: s.preview_image,
      createdAt: s.created_at,
    }));
  },

  async deleteCustomSlide(id) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('custom_slides')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // ============ USER STATS ============
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

export default db;
