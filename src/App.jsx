import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Contexts
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';

// Components
import { EmailConfirmation } from './components/auth';
import { Editor } from './components/editor';
import { Landing, Dashboard, LegalPage } from './components/pages';
import { FeedbackWidget, ProtectedRoute } from './components/common';

// Admin Dashboard
import AdminDashboard from './AdminDashboard';

// ============================================
// APP ROUTES COMPONENT
// ============================================
const AppRoutes = function() {
  const { pendingEmail, setPendingEmail, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  // Show email confirmation page when awaiting verification
  if (pendingEmail) {
    return <EmailConfirmation email={pendingEmail} onBack={() => setPendingEmail(null)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminPage />
        </ProtectedRoute>
      } />
      <Route path="/datenschutz" element={<LegalPage title="Datenschutz" />} />
      <Route path="/agb" element={<LegalPage title="AGB" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// ============================================
// PAGE WRAPPER COMPONENTS (connect to AppContext)
// ============================================
const LandingPage = function() {
  const app = useApp();
  return <Landing {...app} />;
};

const EditorPage = function() {
  const app = useApp();
  return <Editor {...app} />;
};

const DashboardPage = function() {
  const app = useApp();
  return <Dashboard {...app} />;
};

const AdminPage = function() {
  return <AdminDashboard />;
};

// ============================================
// MAIN APP WITH PROVIDERS
// ============================================
const AppWithProviders = function() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <AppProvider>
            <AppRoutes />
            <FeedbackWidget />
          </AppProvider>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default AppWithProviders;
