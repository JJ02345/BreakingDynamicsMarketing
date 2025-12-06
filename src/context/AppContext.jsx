import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/supabase';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [editSurvey, setEditSurvey] = useState(null);
  const [loginModal, setLoginModal] = useState(false);
  const [surveysLoading, setSurveysLoading] = useState(false);
  const [surveysError, setSurveysError] = useState(null);

  const [pendingEmail, setPendingEmailState] = useState(() => {
    try {
      return localStorage.getItem('pendingEmail') || null;
    } catch {
      return null;
    }
  });

  const setPendingEmail = (email) => {
    setPendingEmailState(email);
    try {
      if (email) {
        localStorage.setItem('pendingEmail', email);
      } else {
        localStorage.removeItem('pendingEmail');
      }
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated && pendingEmail) {
      setPendingEmail(null);
    }
  }, [isAuthenticated, pendingEmail]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSurveys();
    } else {
      setSurveys([]);
      setSurveysError(null);
    }
  }, [isAuthenticated]);

  const loadSurveys = async () => {
    setSurveysLoading(true);
    setSurveysError(null);
    try {
      const data = await db.getSurveys();
      setSurveys(data);
    } catch (err) {
      console.error('Failed to load surveys:', err);
      setSurveysError(err.message);
    } finally {
      setSurveysLoading(false);
    }
  };

  const handleLogin = () => {
    setLoginModal(false);
    loadSurveys();
  };

  const handleLogout = async () => {
    await signOut();
  };

  const showLogin = () => {
    setLoginModal(true);
  };

  return (
    <AppContext.Provider value={{
      user,
      authLoading,
      isAuthenticated,
      surveys,
      setSurveys,
      editSurvey,
      setEditSurvey,
      loginModal,
      setLoginModal,
      surveysLoading,
      surveysError,
      pendingEmail,
      setPendingEmail,
      loadSurveys,
      handleLogin,
      handleLogout,
      showLogin,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
