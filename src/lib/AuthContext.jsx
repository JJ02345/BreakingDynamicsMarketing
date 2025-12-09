import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, supabase, db } from './supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Handle the OAuth/Email confirmation redirect
    const handleAuthRedirect = async () => {
      const hashParams = window.location.hash;
      
      // Check if we have auth params in URL (from email confirmation or OAuth)
      if (hashParams && (
        hashParams.includes('access_token') || 
        hashParams.includes('type=signup') || 
        hashParams.includes('type=recovery') ||
        hashParams.includes('type=magiclink')
      )) {
        try {
          // Supabase will automatically handle the hash and set the session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Auth redirect error:', error);
            setError(error.message);
          } else if (data?.session) {
            setUser(data.session.user);
            // Clear the hash from URL for cleaner look
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (err) {
          console.error('Failed to handle auth redirect:', err);
          setError(err.message);
        }
      }
    };

    // Initialize auth state
    const initAuth = async () => {
      try {
        // First handle any redirect params (email confirmation, OAuth, etc.)
        await handleAuthRedirect();
        
        // Then check for existing session
        const session = await auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        console.error('Init auth error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setUser(session?.user || null);
      setLoading(false);
      
      // Clear any previous errors on successful auth
      if (event === 'SIGNED_IN') {
        setError(null);
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }

      // Handle token refresh errors
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    setError(null);
    try {
      const data = await auth.signUp(email, password);
      // Track registration event
      db.trackUserSignedUp();
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signIn = async (email, password) => {
    setError(null);
    try {
      const data = await auth.signIn(email, password);
      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await auth.signOut();
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
