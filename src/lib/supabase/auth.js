import { supabase } from './client';

// Cache für Admin-Status (vermeidet wiederholte DB-Abfragen)
let adminStatusCache = {
  userId: null,
  isAdmin: false,
  timestamp: 0,
};
const ADMIN_CACHE_TTL = 5 * 60 * 1000; // 5 Minuten

export const auth = {
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };

    if (data?.user?.email) {
      const { db } = await import('./db');
      db.convertLead(data.user.email).catch(console.error);
    }

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };
    if (error) throw error;
  },

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
        adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };
      }

      if (event === 'SIGNED_IN' && session?.user?.email) {
        const { db } = await import('./db');
        db.convertLead(session.user.email).catch(console.error);
      }

      callback(event, session);
    });
  },

  async isAdmin(user = null) {
    try {
      if (!user) {
        user = await this.getUser();
      }
      if (!user) return false;

      const now = Date.now();
      if (adminStatusCache.userId === user.id && now - adminStatusCache.timestamp < ADMIN_CACHE_TTL) {
        return adminStatusCache.isAdmin;
      }

      const { data, error } = await supabase.rpc('is_admin', { check_user_id: user.id });

      if (error) {
        console.error('Admin check RPC failed:', error);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fallbackError) {
          console.error('Admin check fallback also failed:', fallbackError);
          return false;
        }

        const isAdmin = !!fallbackData;
        adminStatusCache = { userId: user.id, isAdmin, timestamp: now };
        return isAdmin;
      }

      const isAdmin = !!data;
      adminStatusCache = { userId: user.id, isAdmin, timestamp: now };
      return isAdmin;
    } catch (err) {
      console.error('Admin check error:', err);
      return false;
    }
  },

  invalidateAdminCache() {
    adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };
  },
};

export default auth;
