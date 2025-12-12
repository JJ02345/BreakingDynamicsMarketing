// Protected Route Component - Guards authenticated routes
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { PageLoader } from '@/squads/core';
import { LoginModal } from './LoginModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  // Show loading while checking auth
  if (loading) {
    return <PageLoader message="Checking authentication..." />;
  }

  // Not authenticated - show login modal
  if (!isAuthenticated) {
    return (
      <>
        <Navigate to="/" state={{ from: location }} replace />
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onLogin={() => setShowLogin(false)}
          />
        )}
      </>
    );
  }

  // Requires admin but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
