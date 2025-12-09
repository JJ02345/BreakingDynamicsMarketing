import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Contexts
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { AppProvider, useApp } from './context/AppContext';

// Eagerly loaded (needed on first paint)
import { Landing } from './components/pages';
import { FeedbackWidget, ProtectedRoute } from './components/common';

// Lazy loaded components (code-splitting)
const CarouselEditor = lazy(() => import('./components/editor/CarouselEditor'));
const Editor = lazy(() => import('./components/editor/Editor'));
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const OfflineSurveyEditor = lazy(() => import('./components/survey/OfflineSurveyEditor'));
const OnlineSurveyEditor = lazy(() => import('./components/survey/OnlineSurveyEditor'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const EmailConfirmation = lazy(() => import('./components/auth/EmailConfirmation'));
const LegalPage = lazy(() => import('./components/pages/LegalPage'));
const Datenschutz = lazy(() => import('./components/pages/Datenschutz'));
const Impressum = lazy(() => import('./components/pages/Impressum'));
const WorkInProgress = lazy(() => import('./components/pages/WorkInProgress'));

// Loading fallback component - ensures visible background
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]" style={{ minHeight: '100vh', backgroundColor: '#0A0A0B' }}>
    <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
  </div>
);

// ===========================================
// FEATURE FLAG: Survey-Tools verstecken
// Auf true setzen um Survey-Routen wieder anzuzeigen
// ===========================================
const SHOW_SURVEY_ROUTES = false;

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
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/carousel" element={<CarouselEditorPage />} />

        {/* Survey Routes - HIDDEN via Feature Flag */}
        {SHOW_SURVEY_ROUTES && (
          <>
            <Route path="/editor" element={<SurveyEditorPage />} />
            <Route path="/survey" element={<OfflineSurveyEditorPage />} />
            <Route path="/survey/online" element={<OnlineSurveyEditorPage />} />
          </>
        )}

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
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/agb" element={<LegalPage title="AGB" />} />
        <Route path="/wip" element={<WorkInProgress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
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

const SurveyEditorPage = function() {
  return <OfflineSurveyEditor />;
};

const OfflineSurveyEditorPage = function() {
  return <OfflineSurveyEditor />;
};

const OnlineSurveyEditorPage = function() {
  return <OnlineSurveyEditor />;
};

const DashboardPage = function() {
  const app = useApp();
  return <Dashboard {...app} />;
};

const AdminPage = function() {
  return <AdminDashboard />;
};

const CarouselEditorPage = function() {
  const app = useApp();
  return <CarouselEditor {...app} />;
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
