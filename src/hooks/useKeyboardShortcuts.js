/**
 * useKeyboardShortcuts - Custom hook for keyboard shortcuts
 * Provides keyboard shortcuts for faster editor workflow
 */

import { useEffect, useCallback, useState } from 'react';

// Detect OS for displaying correct modifier key
const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

// Define all available shortcuts
export const SHORTCUTS = {
  // Navigation
  prevSlide: { key: 'ArrowLeft', label: { de: 'Vorherige Folie', en: 'Previous slide' } },
  nextSlide: { key: 'ArrowRight', label: { de: 'Nächste Folie', en: 'Next slide' } },
  firstSlide: { key: 'Home', label: { de: 'Erste Folie', en: 'First slide' } },
  lastSlide: { key: 'End', label: { de: 'Letzte Folie', en: 'Last slide' } },

  // Actions
  save: { key: 's', ctrl: true, label: { de: 'Speichern', en: 'Save' } },
  exportPdf: { key: 'e', ctrl: true, label: { de: 'Als PDF exportieren', en: 'Export as PDF' } },
  newSlide: { key: 'n', ctrl: true, label: { de: 'Neue Folie', en: 'New slide' } },
  duplicateSlide: { key: 'd', ctrl: true, label: { de: 'Folie duplizieren', en: 'Duplicate slide' } },
  deleteSlide: { key: 'Delete', label: { de: 'Folie löschen', en: 'Delete slide' } },
  deleteSlideBackspace: { key: 'Backspace', ctrl: true, label: { de: 'Folie löschen', en: 'Delete slide' } },

  // View
  togglePreview: { key: 'p', ctrl: true, label: { de: 'Vorschau umschalten', en: 'Toggle preview' } },
  openAI: { key: 'g', ctrl: true, label: { de: 'KI-Generator öffnen', en: 'Open AI generator' } },

  // Help
  showHelp: { key: '?', shift: true, label: { de: 'Hilfe anzeigen', en: 'Show help' } },
  closeModal: { key: 'Escape', label: { de: 'Modal schließen', en: 'Close modal' } },
};

// Get display string for shortcut
export const getShortcutDisplay = (shortcut) => {
  const parts = [];
  const modKey = isMac ? '⌘' : 'Ctrl';

  if (shortcut.ctrl) parts.push(modKey);
  if (shortcut.shift) parts.push('Shift');
  if (shortcut.alt) parts.push(isMac ? '⌥' : 'Alt');

  // Format special keys
  let keyDisplay = shortcut.key;
  switch (shortcut.key) {
    case 'ArrowLeft': keyDisplay = '←'; break;
    case 'ArrowRight': keyDisplay = '→'; break;
    case 'ArrowUp': keyDisplay = '↑'; break;
    case 'ArrowDown': keyDisplay = '↓'; break;
    case 'Delete': keyDisplay = 'Del'; break;
    case 'Backspace': keyDisplay = '⌫'; break;
    case 'Escape': keyDisplay = 'Esc'; break;
    case ' ': keyDisplay = 'Space'; break;
    default:
      if (keyDisplay.length === 1) keyDisplay = keyDisplay.toUpperCase();
  }

  parts.push(keyDisplay);
  return parts.join(isMac ? '' : '+');
};

/**
 * Hook for handling keyboard shortcuts in the editor
 */
const useKeyboardShortcuts = (handlers, options = {}) => {
  const { enabled = true, ignoreInputs = true } = options;
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (!enabled) return;

    // Ignore if typing in input/textarea (unless specified)
    if (ignoreInputs && (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.isContentEditable
    )) {
      // Allow Escape to work even in inputs
      if (e.key !== 'Escape') return;
    }

    const ctrl = e.ctrlKey || e.metaKey; // metaKey for Mac
    const shift = e.shiftKey;
    const alt = e.altKey;

    // Match against defined shortcuts
    for (const [action, shortcut] of Object.entries(SHORTCUTS)) {
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase() || e.key === shortcut.key;
      const ctrlMatch = !!shortcut.ctrl === ctrl;
      const shiftMatch = !!shortcut.shift === shift;
      const altMatch = !!shortcut.alt === alt;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        // Special case: help modal
        if (action === 'showHelp') {
          e.preventDefault();
          setHelpModalOpen(true);
          return;
        }

        if (action === 'closeModal') {
          if (helpModalOpen) {
            e.preventDefault();
            setHelpModalOpen(false);
            return;
          }
          // Let close modal propagate to handlers
        }

        // Call the handler if defined
        if (handlers[action]) {
          e.preventDefault();
          handlers[action](e);
          return;
        }
      }
    }
  }, [enabled, ignoreInputs, handlers, helpModalOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    helpModalOpen,
    setHelpModalOpen,
    shortcuts: SHORTCUTS,
    getShortcutDisplay,
    isMac,
  };
};

export default useKeyboardShortcuts;
