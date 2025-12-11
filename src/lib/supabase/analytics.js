import { supabase } from './client';
import { auth } from './auth';

// Session ID management
function getSessionId() {
  let sessionId = sessionStorage.getItem('bd_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('bd_session_id', sessionId);
  }
  return sessionId;
}

export const analytics = {
  async trackEvent(eventName, eventData = {}) {
    try {
      const user = await auth.getUser();
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_name: eventName,
          event_data: eventData,
          user_id: user?.id || null,
          session_id: getSessionId(),
          page_url: window.location.href,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });

      if (error) {
        console.error('Failed to track event:', error);
      }
    } catch (err) {
      console.error('Analytics tracking error:', err);
    }
  },

  async incrementCarouselCount() {
    try {
      const { error } = await supabase.rpc('increment_carousel_count');
      if (error) {
        console.error('Failed to increment carousel count:', error);
      }
    } catch (err) {
      console.error('Carousel count increment error:', err);
    }
  },

  async getCarouselCount() {
    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('value')
        .eq('key', 'total_carousels')
        .maybeSingle();

      if (error || !data) return 0;
      return parseInt(data.value) || 0;
    } catch (err) {
      console.error('Failed to get carousel count:', err);
      return 0;
    }
  },

  // Convenience event trackers
  async trackCarouselCreated(templateId) {
    await this.trackEvent('carousel_created', { template: templateId });
  },

  async trackCarouselExported(slideCount) {
    await this.trackEvent('carousel_exported', { slides: slideCount });
    await this.incrementCarouselCount();
  },

  async trackAIGenerated(pattern, slideCount) {
    await this.trackEvent('ai_carousel_generated', { pattern, slides: slideCount });
  },

  async trackSlideAdded(slideType) {
    await this.trackEvent('slide_added', { type: slideType });
  },

  async trackTemplateUsed(templateId) {
    await this.trackEvent('template_used', { template: templateId });
  },

  async trackPageView(pageName) {
    await this.trackEvent('page_view', { page: pageName });
  },

  async trackUserSignedUp() {
    await this.trackEvent('user_signed_up', {});
  },

  async trackEditorOpened() {
    await this.trackEvent('editor_opened', {});
  },
};

export default analytics;
