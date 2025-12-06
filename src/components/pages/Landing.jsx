import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Rocket, LogIn, ChevronRight, Gauge, Target, TrendingUp, Users,
  FileText, ClipboardList, Download, Linkedin, PenTool, BarChart3,
  Smartphone, Globe, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useLanguage, LanguageSwitcher } from '../../context/LanguageContext';
import { LoginModal } from '../auth';

const Landing = function(props) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] shadow-lg shadow-[#FF6B35]/20">
              <Zap className="h-6 w-6 text-[#0A0A0B]" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] blur-xl opacity-40" />
            </div>
            <div>
              <p className="font-['Syne'] text-lg font-bold tracking-tight">Breaking Dynamics</p>
              <p className="text-xs font-medium text-[#FF6B35] tracking-wider uppercase">{t('landing.tagline')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-ghost text-sm">{t('nav.dashboard')}</Link>
            ) : (
              <button onClick={props.showLogin} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
                <LogIn className="h-4 w-4" />{t('nav.login')}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-glow-top" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF6B35]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#0A66C2]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="animate-slide-up delay-0 mb-6 inline-flex items-center gap-2 badge-orange">
              <Zap className="h-3.5 w-3.5" />
              <span>{t('landing.badge')}</span>
            </div>
            <h1 className="animate-slide-up delay-100 font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              {t('landing.headline1')}
              <br />
              <span className="text-gradient">{t('landing.headline2')}</span>
            </h1>
            <p className="animate-slide-up delay-200 text-lg text-white/60 max-w-2xl mx-auto">
              {t('landing.heroDesc')}
            </p>
          </div>

          {/* Two Product Cards */}
          <div className="animate-slide-up delay-300 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* LEFT: LinkedIn Carousel (Online) */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C5A]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative card-glow p-8 h-full flex flex-col border-2 border-transparent hover:border-[#FF6B35]/30 transition-all duration-300">
                {/* Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="badge-orange">
                    <Globe className="h-3 w-3" />
                    {t('landing.online')}
                  </span>
                  <span className="badge-cyan">
                    <Linkedin className="h-3 w-3" />
                    LinkedIn
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C5A]/10 border border-[#FF6B35]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8 text-[#FF6B35]" />
                </div>

                {/* Title & Description */}
                <h2 className="font-['Syne'] text-2xl font-bold mb-3 text-white">
                  {t('landing.carouselTitle')}
                </h2>
                <p className="text-white/50 mb-6 flex-grow">
                  {t('landing.carouselDesc')}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {[
                    t('landing.carouselFeature1'),
                    t('landing.carouselFeature2'),
                    t('landing.carouselFeature3'),
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-[#FF6B35] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/carousel" className="btn-primary w-full justify-center">
                  <PenTool className="h-4 w-4" />
                  {t('landing.carouselCTA')}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* RIGHT: Offline Surveys */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/20 to-[#00D4FF]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative card-glow p-8 h-full flex flex-col border-2 border-transparent hover:border-[#0A66C2]/30 transition-all duration-300">
                {/* Badge */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0A66C2]/10 text-[#00D4FF] border border-[#0A66C2]/20">
                    <Smartphone className="h-3 w-3 inline mr-1" />
                    {t('landing.offline')}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20">
                    <BarChart3 className="h-3 w-3 inline mr-1" />
                    {t('landing.realtime')}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A66C2]/20 to-[#00D4FF]/10 border border-[#0A66C2]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ClipboardList className="h-8 w-8 text-[#00D4FF]" />
                </div>

                {/* Title & Description */}
                <h2 className="font-['Syne'] text-2xl font-bold mb-3 text-white">
                  {t('landing.surveyTitle')}
                </h2>
                <p className="text-white/50 mb-6 flex-grow">
                  {t('landing.surveyDesc')}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {[
                    t('landing.surveyFeature1'),
                    t('landing.surveyFeature2'),
                    t('landing.surveyFeature3'),
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 className="h-4 w-4 text-[#00D4FF] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/editor" className="w-full justify-center flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-[#0A66C2] to-[#00D4FF] text-white hover:opacity-90 hover:scale-[1.02]">
                  <ClipboardList className="h-4 w-4" />
                  {t('landing.surveyCTA')}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="animate-slide-up delay-400 mt-20 flex items-center justify-center gap-8 sm:gap-16">
            {[
              { value: t('landing.stat1Value'), label: t('landing.stat1Label') },
              { value: t('landing.stat2Value'), label: t('landing.stat2Label') },
              { value: t('landing.stat3Value'), label: t('landing.stat3Label') },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-['Syne'] text-3xl sm:text-4xl font-bold text-gradient-orange">{stat.value}</p>
                <p className="text-xs sm:text-sm text-white/40 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-diagonal" />
        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="accent-line mx-auto mb-6" />
            <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold mb-4">
              {t('landing.whyTitle')}
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              {t('landing.whySubtitle')}
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Gauge,
                title: t('landing.feature1Title'),
                desc: t('landing.feature1Desc'),
                accent: '#FF6B35'
              },
              {
                icon: Target,
                title: t('landing.feature2Title'),
                desc: t('landing.feature2Desc'),
                accent: '#00D4FF'
              },
              {
                icon: TrendingUp,
                title: t('landing.feature3Title'),
                desc: t('landing.feature3Desc'),
                accent: '#00E676'
              }
            ].map((item, i) => (
              <div
                key={i}
                className="card-glow p-8 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]"
                  style={{
                    background: `linear-gradient(135deg, ${item.accent}20 0%, ${item.accent}10 100%)`,
                    border: `1px solid ${item.accent}30`
                  }}
                >
                  <item.icon className="h-7 w-7" style={{ color: item.accent }} />
                </div>
                <h3 className="font-['Syne'] text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-glow-center" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="badge-cyan mb-6 inline-flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            <span>{t('landing.communityBadge')}</span>
          </div>
          <h2 className="font-['Syne'] text-4xl sm:text-5xl font-bold mb-6">
            {t('landing.communityTitle')}
            <span className="text-gradient"> {t('landing.communityTitle2')}</span>
          </h2>
          <p className="text-white/50 text-lg mb-8">
            {t('landing.communityDesc')}
          </p>

          {/* Avatar Stack */}
          <div className="flex justify-center mb-8">
            <div className="flex -space-x-3">
              {['R', 'L', 'Z', 'T', 'F'].map((letter, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8C5A]/20 border-2 border-[#0A0A0B] flex items-center justify-center text-xl shadow-lg font-bold text-white/60">
                  {letter}
                </div>
              ))}
              <div className="w-12 h-12 rounded-full bg-[#FF6B35] border-2 border-[#0A0A0B] flex items-center justify-center text-sm font-bold text-[#0A0A0B] shadow-lg">
                +99
              </div>
            </div>
          </div>

          <Link to="/wip" className="btn-primary btn-xl">
            {t('landing.communityButton')}
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A0A0B] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A]">
                <Zap className="h-4 w-4 text-[#0A0A0B]" />
              </div>
              <span className="font-['Syne'] font-bold">Breaking Dynamics</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/40">
              <Link to="/datenschutz" className="hover:text-white transition-colors">{t('landing.privacy')}</Link>
              <Link to="/agb" className="hover:text-white transition-colors">{t('landing.terms')}</Link>
              <span>© 2025</span>
            </div>
          </div>
        </div>
      </footer>

      {props.loginModal && <LoginModal onClose={() => props.setLoginModal(false)} onLogin={props.handleLogin} setPendingEmail={props.setPendingEmail} />}
    </div>
  );
};

export default Landing;
