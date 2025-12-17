/**
 * KeyboardShortcutsModal - Displays available keyboard shortcuts
 */

import React from 'react';
import { X, Keyboard, Navigation, MousePointerClick, Eye, HelpCircle } from 'lucide-react';
import { SHORTCUTS, getShortcutDisplay } from '../../hooks/useKeyboardShortcuts';
import { useLanguage } from '../../context/LanguageContext';

const ShortcutItem = ({ shortcut, language }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-white/70 text-sm">
      {shortcut.label[language] || shortcut.label.en}
    </span>
    <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white/90 font-mono min-w-[40px] text-center">
      {getShortcutDisplay(shortcut)}
    </kbd>
  </div>
);

const ShortcutGroup = ({ title, icon: Icon, shortcuts, language }) => (
  <div className="mb-6 last:mb-0">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-[#FF6B35]" />
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
    <div className="space-y-1 pl-6">
      {shortcuts.map(([key, shortcut]) => (
        <ShortcutItem key={key} shortcut={shortcut} language={language} />
      ))}
    </div>
  </div>
);

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  // Group shortcuts by category
  const navigationShortcuts = Object.entries(SHORTCUTS).filter(([key]) =>
    ['prevSlide', 'nextSlide', 'firstSlide', 'lastSlide'].includes(key)
  );

  const actionShortcuts = Object.entries(SHORTCUTS).filter(([key]) =>
    ['save', 'exportPdf', 'newSlide', 'duplicateSlide', 'deleteSlide', 'deleteSlideBackspace'].includes(key)
  );

  const viewShortcuts = Object.entries(SHORTCUTS).filter(([key]) =>
    ['togglePreview', 'openAI'].includes(key)
  );

  const helpShortcuts = Object.entries(SHORTCUTS).filter(([key]) =>
    ['showHelp', 'closeModal'].includes(key)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg mx-4 bg-gradient-to-b from-[#1A1A1D] to-[#141416] rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative p-5 border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/10 via-purple-500/5 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center">
                <Keyboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {language === 'de' ? 'Tastenkürzel' : 'Keyboard Shortcuts'}
                </h2>
                <p className="text-xs text-white/50">
                  {language === 'de' ? 'Schneller arbeiten im Editor' : 'Work faster in the editor'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          <ShortcutGroup
            title={language === 'de' ? 'Navigation' : 'Navigation'}
            icon={Navigation}
            shortcuts={navigationShortcuts}
            language={language}
          />

          <ShortcutGroup
            title={language === 'de' ? 'Aktionen' : 'Actions'}
            icon={MousePointerClick}
            shortcuts={actionShortcuts}
            language={language}
          />

          <ShortcutGroup
            title={language === 'de' ? 'Ansicht' : 'View'}
            icon={Eye}
            shortcuts={viewShortcuts}
            language={language}
          />

          <ShortcutGroup
            title={language === 'de' ? 'Hilfe' : 'Help'}
            icon={HelpCircle}
            shortcuts={helpShortcuts}
            language={language}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <p className="text-center text-xs text-white/40">
            {language === 'de'
              ? 'Drücke Shift + ? um dieses Fenster jederzeit zu öffnen'
              : 'Press Shift + ? to open this window anytime'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
