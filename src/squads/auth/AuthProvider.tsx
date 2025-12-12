// Auth Provider - Authentication Context
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/squads/core';
import { useEventBus } from '@/command';
import { authService } from './services/authService';
import type { AuthContextValue, AuthResult } from './types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { emit } = useEventBus();

  useEffect(() => {
    // Handle OAuth/Email confirmation redirect
    const handleAuthRedirect = async () => {
      const hashParams = window.location.hash;

      if (
        hashParams &&
        (hashParams.includes('access_token') ||
          hashParams.includes('type=signup') ||
          hashParams.includes('type=recovery') ||
          hashParams.includes('type=magiclink'))
      ) {
        try {
          const { data, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error('[Auth] Redirect error:', sessionError);
            setError(sessionError.message);
          } else if (data?.session) {
            setUser(data.session.user);
            // Clear hash from URL
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (err) {
          console.error('[Auth] Failed to handle redirect:', err);
          setError(err instanceof Error ? err.message : 'Authentication failed');
        }
      }
    };

    // Initialize auth state
    const initAuth = async () => {
      // Timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.warn('[Auth] Initialization timeout - proceeding without auth');
        setLoading(false);
      }, 3000);

      try {
        await handleAuthRedirect();
        const session = await authService.getSession();
        const currentUser = session?.user || null;
        setUser(currentUser);

        // Check admin status if user exists
        if (currentUser) {
          const adminStatus = await authService.isAdmin(currentUser);
          setIsAdmin(adminStatus);
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      console.log('[Auth] State changed:', event);
      const newUser = session?.user || null;
      setUser(newUser);
      setLoading(false);

      if (event === 'SIGNED_IN' && newUser) {
        setError(null);
        const adminStatus = await authService.isAdmin(newUser);
        setIsAdmin(adminStatus);
        emit('auth:user-signed-in', { userId: newUser.id, email: newUser.email || '' });
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
        emit('auth:user-signed-out', undefined);
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('[Auth] Token refreshed');
      }
    });

    return () => subscription.unsubscribe();
  }, [emit]);

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setError(null);
    try {
      const data = await authService.signUp(email, password);
      emit('analytics:track', { event: 'user_signed_up', data: { method: 'email' } });
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  }, [emit]);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setError(null);
    try {
      const data = await authService.signIn(email, password);
      setUser(data.user);

      // Check admin status
      if (data.user) {
        const adminStatus = await authService.isAdmin(data.user);
        setIsAdmin(adminStatus);
      }

      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await authService.signOut();
      setUser(null);
      setIsAdmin(false);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const checkAdmin = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    const adminStatus = await authService.isAdmin(user);
    setIsAdmin(adminStatus);
    return adminStatus;
  }, [user]);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin,
    signUp,
    signIn,
    signOut,
    checkAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
