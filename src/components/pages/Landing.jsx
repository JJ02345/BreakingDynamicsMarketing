import React from 'react';
import { LoginModal } from '../auth';
import {
  LandingNav,
  LandingHero,
  LandingFeatures,
  LandingCommunity,
  LandingFooter
} from '../landing';

const Landing = function(props) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden">
      <LandingNav onShowLogin={props.showLogin} />
      <LandingHero />
      <LandingFeatures />
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
