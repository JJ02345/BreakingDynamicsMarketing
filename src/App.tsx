// src/App.tsx - Supreme Commander
// Main application with Squad-based architecture

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Command Center
import { CommandProvider } from './command';

// Squad Public APIs
import { AuthProvider, useAuth, ProtectedRoute, EmailConfirmation } from './squads/auth';
import { LanguageProvider, ToastProvider, PageLoader } from './squads/core';
import { AIProvider } from './squads/ai';

// Legacy components that need gradual migration
import { FeedbackWidget } from './components/common';
import { Landing } from './components/pages';

// Lazy loaded components (code-splitting)
const CarouselEditor = lazy(() => import('./components/editor/CarouselEditor'));
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const OfflineSurveyEditor = lazy(() => import('./components/survey/OfflineSurveyEditor'));
const OnlineSurveyEditor = lazy(() => import('./components/survey/OnlineSurveyEditor'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const LegalPage = lazy(() => import('./components/pages/LegalPage'));
const Datenschutz = lazy(() => import('./components/pages/Datenschutz'));
const Impressum = lazy(() => import('./components/pages/Impressum'));
const WorkInProgress = lazy(() => import('./components/pages/WorkInProgress'));

// ===========================================
// FEATURE FLAG: Survey-Tools verstecken
// Auf true setzen um Survey-Routen wieder anzuzeigen
// ===========================================
const SHOW_SURVEY_ROUTES = false;

// ============================================
// APP ROUTES COMPONENT
// ============================================
function AppRoutes() {
  const { user, isLoading, pendingEmail, setPendingEmail } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  // Show email confirmation page when awaiting verification
  if (pendingEmail) {
    return <EmailConfirmation email={pendingEmail} onBack={() => setPendingEmail(null)} />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/carousel" element={<CarouselEditor />} />

        {/* Survey Routes - HIDDEN via Feature Flag */}
        {SHOW_SURVEY_ROUTES && (
          <>
            <Route path="/survey" element={<OfflineSurveyEditor />} />
            <Route path="/survey/online" element={<OnlineSurveyEditor />} />
          </>
        )}

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/agb" element={<LegalPage title="AGB" />} />
        <Route path="/wip" element={<WorkInProgress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

// ============================================
// MAIN APP WITH PROVIDERS
// ============================================
export default function App() {
  return (
    <BrowserRouter>
      <CommandProvider>
        <LanguageProvider>
          <ToastProvider>
            <AuthProvider>
              <AIProvider>
                <AppRoutes />
                <FeedbackWidget />
              </AIProvider>
            </AuthProvider>
          </ToastProvider>
        </LanguageProvider>
      </CommandProvider>
    </BrowserRouter>
  );
}
