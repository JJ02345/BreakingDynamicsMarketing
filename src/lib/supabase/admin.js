import { supabase } from './client';
import { auth } from './auth';

async function requireAdmin() {
  const user = await auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const isAdmin = await auth.isAdmin(user);
  if (!isAdmin) throw new Error('Admin access required');
  return user;
}

export const admin = {
  // ============ FEEDBACK MANAGEMENT ============
  async getAllFeedback(filters = {}) {
    await requireAdmin();

    let query = supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

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

  async updateFeedbackStatus(id, status, adminNotes = null) {
    await requireAdmin();

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

  async deleteFeedback(id) {
    await requireAdmin();

    const { error } = await supabase.from('feedback').delete().eq('id', id);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('permission')) {
        throw new Error('Admin access required');
      }
      throw error;
    }
  },

  async getFeedbackStats() {
    await requireAdmin();

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

  // ============ LEADS MANAGEMENT ============
  async getAllLeads(filters = {}) {
    await requireAdmin();

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.converted !== undefined) {
      query = query.eq('converted_to_user', filters.converted);
    }

    const { data, error } = await query;
    if (error) throw error;

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

  async getLeadStats() {
    await requireAdmin();

    const { data, error } = await supabase
      .from('leads')
      .select('converted_to_user, created_at');

    if (error) throw error;

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
  async getConversionFunnel(daysBack = 30) {
    await requireAdmin();
    const { data, error } = await supabase.rpc('get_conversion_funnel', { days_back: daysBack });
    if (error) throw error;
    return data;
  },

  async getDailyStats(daysBack = 30) {
    await requireAdmin();
    const { data, error } = await supabase.rpc('get_daily_stats', { days_back: daysBack });
    if (error) throw error;
    return data;
  },

  async getEventStats(daysBack = 30) {
    await requireAdmin();
    const { data, error } = await supabase.rpc('get_event_stats', { days_back: daysBack });
    if (error) throw error;
    return data;
  },
};

export default admin;
