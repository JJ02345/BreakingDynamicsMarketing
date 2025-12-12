// Auth Service - Supabase Authentication Wrapper
import { supabase } from '@/squads/core';
import type { User as SupabaseUser, Session, AuthChangeEvent } from '@supabase/supabase-js';
import type { AdminStatusCache } from '../types';

// Admin status cache - reduced TTL for security (60 seconds instead of 5 minutes)
let adminStatusCache: AdminStatusCache = {
  userId: null,
  isAdmin: false,
  timestamp: 0,
};
const ADMIN_CACHE_TTL = 60 * 1000; // 60 seconds

export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Clear admin cache on sign in
    adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    // Clear admin cache on sign out
    adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };
    if (error) throw error;
  },

  async getUser(): Promise<SupabaseUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  async getSession(): Promise<Session | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange((event, session) => {
      // Clear admin cache on auth state change
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
        adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };
      }
      callback(event, session);
    });
  },

  async isAdmin(user?: SupabaseUser | null): Promise<boolean> {
    try {
      const currentUser = user ?? (await this.getUser());
      if (!currentUser) return false;

      const now = Date.now();

      // Check cache (reduced TTL for security)
      if (
        adminStatusCache.userId === currentUser.id &&
        now - adminStatusCache.timestamp < ADMIN_CACHE_TTL
      ) {
        return adminStatusCache.isAdmin;
      }

      // Try RPC call first
      const { data, error } = await supabase.rpc('is_admin', {
        check_user_id: currentUser.id,
      });

      if (error) {
        console.error('[Auth] Admin check RPC failed:', error);

        // Fallback to direct table query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (fallbackError) {
          console.error('[Auth] Admin check fallback also failed');
          return false;
        }

        const isAdmin = !!fallbackData;
        adminStatusCache = { userId: currentUser.id, isAdmin, timestamp: now };
        return isAdmin;
      }

      const isAdmin = !!data;
      adminStatusCache = { userId: currentUser.id, isAdmin, timestamp: now };
      return isAdmin;
    } catch (err) {
      console.error('[Auth] Admin check error:', err);
      return false;
    }
  },

  invalidateAdminCache() {
    adminStatusCache = { userId: null, isAdmin: false, timestamp: 0 };
  },
};

export default authService;
