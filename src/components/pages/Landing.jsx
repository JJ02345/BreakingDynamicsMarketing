import React, { useEffect } from 'react';
import { LoginModal } from '../auth';
import {
  LandingNav,
  LandingHero,
  LandingFeatures,
  LandingComingSoon,
  LandingNewsletter,
  LandingCommunity,
  LandingFooter
} from '../landing';
import { db } from '../../lib/supabase';

const Landing = function(props) {
  // Track page view on mount
  useEffect(() => {
    db.trackPageView('landing');
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden">
      <LandingNav onShowLogin={props.showLogin} />
      <LandingHero />
      <LandingFeatures />
      <LandingComingSoon />
      <LandingNewsletter />
      <LandingCommunity />
      <LandingFooter />
      {props.loginModal && (
        <LoginModal
          onClose={() => props.setLoginModal(false)}
          onLogin={props.handleLogin}
          setPendingEmail={props.setPendingEmail}
        />
      )}
    </div>
  );
};

export default Landing;
