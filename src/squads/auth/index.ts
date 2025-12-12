// Auth Squad - Public API

// Provider & Hook
export { AuthProvider, useAuth } from './AuthProvider';

// Components
export { LoginModal } from './components/LoginModal';
export { ProtectedRoute } from './components/ProtectedRoute';
export { EmailConfirmation } from './components/EmailConfirmation';

// Service (for advanced use cases)
export { authService } from './services/authService';

// Types
export type {
  User,
  AuthState,
  AuthResult,
  AuthContextValue,
  AdminStatusCache,
} from './types';
