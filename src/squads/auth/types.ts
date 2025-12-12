// Auth Squad Types
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: SupabaseUser | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  pendingEmail: string | null;
}

export interface AuthResult {
  success: boolean;
  data?: {
    user: SupabaseUser | null;
    session: Session | null;
  };
  error?: string;
}

export interface AdminStatusCache {
  userId: string | null;
  isAdmin: boolean;
  timestamp: number;
}

export interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  checkAdmin: () => Promise<boolean>;
  setPendingEmail: (email: string | null) => void;
}
