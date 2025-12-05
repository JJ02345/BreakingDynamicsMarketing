// ============================================
// POST COMPILER - LinkedIn Post Generator
// ============================================
// Konvertiert Editor-Bausteine in LinkedIn-kompatiblen Plain Text
// mit Unicode-Tricks für Formatierung (da LinkedIn kein HTML unterstützt)
//
// Autor: Breaking Dynamics Team
// Version: 1.0.0
// ============================================

// ============================================
// LINKEDIN LIMITS (für Validierung)
// ============================================
export const LINKEDIN_LIMITS = {
  POST_TEXT: 3000,      // Max. Zeichen für Post-Text
  POLL_QUESTION: 140,   // Max. Zeichen für Poll-Frage
  POLL_OPTION: 30,      // Max. Zeichen pro Poll-Option
  POLL_OPTIONS_COUNT: 4 // Max. Anzahl Poll-Optionen
};

// ============================================
// UNICODE BOLD CONVERTER
// ============================================
// Konvertiert normalen Text in mathematische fettgedruckte
// Sans-Serif Unicode-Zeichen für LinkedIn-kompatible "Fettschrift"
//
// Beispiel: 'Hallo' -> '𝗛𝗮𝗹𝗹𝗼'
//
// Unicode-Bereiche:
// - Großbuchstaben A-Z: U+1D5D4 bis U+1D5ED (𝗔-𝗭)
// - Kleinbuchstaben a-z: U+1D5EE bis U+1D607 (𝗮-𝘇)
// - Ziffern 0-9: U+1D7EC bis U+1D7F5 (𝟬-𝟵)
// ============================================

/**
 * Konvertiert Text in Unicode Bold Sans-Serif
 * @param {string} text - Der zu konvertierende Text
 * @returns {string} - Text in Unicode-Fettschrift
 */
export function toBoldUnicode(text) {
  // Sicherheitsprüfung: Leerer oder ungültiger Input
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Unicode-Startpunkte für Bold Sans-Serif
  const BOLD_UPPERCASE_START = 0x1D5D4; // 𝗔
  const BOLD_LOWERCASE_START = 0x1D5EE; // 𝗮
  const BOLD_DIGIT_START = 0x1D7EC;     // 𝟬

  let result = '';

  for (const char of text) {
    const code = char.charCodeAt(0);

    // Großbuchstaben A-Z (65-90)
    if (code >= 65 && code <= 90) {
      result += String.fromCodePoint(BOLD_UPPERCASE_START + (code - 65));
    }
    // Kleinbuchstaben a-z (97-122)
    else if (code >= 97 && code <= 122) {
      result += String.fromCodePoint(BOLD_LOWERCASE_START + (code - 97));
    }
    // Ziffern 0-9 (48-57)
    else if (code >= 48 && code <= 57) {
      result += String.fromCodePoint(BOLD_DIGIT_START + (code - 48));
    }
    // Alle anderen Zeichen (Emojis, Umlaute, Sonderzeichen) bleiben unverändert
    else {
      result += char;
    }
  }

  return result;
}

/**
 * Konvertiert Text in Unicode Italic Sans-Serif
 * @param {string} text - Der zu konvertierende Text
 * @returns {string} - Text in Unicode-Kursivschrift
 */
export function toItalicUnicode(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Unicode-Startpunkte für Italic Sans-Serif
  const ITALIC_UPPERCASE_START = 0x1D608; // 𝘈
  const ITALIC_LOWERCASE_START = 0x1D622; // 𝘢

  let result = '';

  for (const char of text) {
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      result += String.fromCodePoint(ITALIC_UPPERCASE_START + (code - 65));
    }
    else if (code >= 97 && code <= 122) {
      result += String.fromCodePoint(ITALIC_LOWERCASE_START + (code - 97));
    }
    // Zahlen haben keine Kursiv-Variante, bleiben normal
    else {
      result += char;
    }
  }

  return result;
}

/**
 * Konvertiert Text in Unicode Bold Italic Sans-Serif
 * @param {string} text - Der zu konvertierende Text
 * @returns {string} - Text in Unicode-Fett-Kursivschrift
 */
export function toBoldItalicUnicode(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Unicode-Startpunkte für Bold Italic Sans-Serif
  const BOLD_ITALIC_UPPERCASE_START = 0x1D63C; // 𝘼
  const BOLD_ITALIC_LOWERCASE_START = 0x1D656; // 𝙖

  let result = '';

  for (const char of text) {
    const code = char.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      result += String.fromCodePoint(BOLD_ITALIC_UPPERCASE_START + (code - 65));
    }
    else if (code >= 97 && code <= 122) {
      result += String.fromCodePoint(BOLD_ITALIC_LOWERCASE_START + (code - 97));
    }
    else {
      result += char;
    }
  }

  return result;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Bereinigt Text von überflüssigen Leerzeichen und Zeilenumbrüchen
 * @param {string} text - Zu bereinigender Text
 * @returns {string} - Bereinigter Text
 */
function cleanText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/\u00A0/g, ' ')      // Non-breaking spaces ersetzen
    .replace(/&nbsp;/g, ' ')       // HTML nbsp ersetzen
    .replace(/\r\n?/g, '\n')       // Windows-Zeilenumbrüche normalisieren
    .replace(/\n{4,}/g, '\n\n\n')  // Max. 3 Zeilenumbrüche
    .trim();
}

/**
 * Prüft ob ein Block gültigen Content hat
 * @param {object} block - Block-Objekt
 * @returns {boolean} - true wenn Block Content hat
 */
function hasContent(block) {
  if (!block || !block.data) {
    return false;
  }

  const data = block.data;

  switch (block.type) {
    case 'TITLE':
    case 'CUSTOM':
    case 'CTA':
    case 'MENTION':
    case 'NUMBER':
    case 'CHALLENGE':
      return Boolean(data.text?.trim());
    
    case 'HASHTAG':
      return Boolean(data.tags?.trim());
    
    case 'POLL':
      return Boolean(data.q?.trim());
    
    case 'DIVIDER':
      return true; // Divider hat immer Content
    
    case 'DURATION':
      return Boolean(data.val);
    
    case 'SCHEDULE':
      return Boolean(data.date || data.time);
    
    default:
      return false;
  }
}

/**
 * Generiert Poll-Emojis für Optionen
 * @param {number} index - Index der Option (0-3)
 * @returns {string} - Emoji für die Option
 */
function getPollEmoji(index) {
  const emojis = ['🅰️', '🅱️', '©️', '🅳'];
  return emojis[index] || `${index + 1}.`;
}

// ============================================
// BLOCK FORMATTERS
// ============================================
// Jeder Formatter ist für einen Block-Typ zuständig

/**
 * Formatiert einen TITLE Block
 * Verwendet Unicode Bold für Hervorhebung
 */
function formatTitle(block) {
  const text = block.data?.text?.trim();
  if (!text) return '';
  
  return toBoldUnicode(text) + '\n\n';
}

/**
 * Formatiert einen CUSTOM Text Block
 * Normaler Text mit Zeilenumbrüchen
 */
function formatCustomText(block) {
  const text = block.data?.text?.trim();
  if (!text) return '';
  
  return text + '\n\n';
}

/**
 * Formatiert einen POLL Block
 * Da LinkedIn's native Poll-API nicht verfügbar ist,
 * erstellen wir eine Text-basierte "Pseudo-Umfrage"
 */
function formatPoll(block, options = {}) {
  const question = block.data?.q?.trim();
  const opts = block.data?.opts || [];
  
  if (!question) return '';

  // Filtere leere Optionen heraus
  const validOptions = opts.filter(opt => opt?.trim());
  
  if (validOptions.length === 0) {
    // Nur Frage ohne Optionen
    return `🎯 ${question}\n\n`;
  }

  let result = '';
  
  // Frage mit Emoji
  result += `🎯 ${question}\n\n`;
  
  // Optionen mit Buchstaben-Emojis
  validOptions.forEach((opt, index) => {
    result += `${getPollEmoji(index)} ${opt.trim()}\n`;
  });
  
  // Call-to-Action für Abstimmung
  if (options.includePollCTA !== false) {
    result += '\n👇 Stimme ab in den Kommentaren!\n';
  }
  
  result += '\n';
  
  return result;
}

/**
 * Formatiert einen CTA Block
 * Call-to-Action mit Finger-Emoji
 */
function formatCTA(block) {
  const text = block.data?.text?.trim();
  if (!text) return '';
  
  return `👉 ${text}\n\n`;
}

/**
 * Formatiert einen HASHTAG Block
 * Hashtags werden ans Ende des Posts gestellt
 */
function formatHashtags(block) {
  const tags = block.data?.tags?.trim();
  if (!tags) return '';
  
  // Stelle sicher, dass Hashtags mit # beginnen
  // und durch Leerzeichen getrennt sind
  const formattedTags = tags
    .split(/\s+/)
    .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
    .join(' ');
  
  return formattedTags;
}

/**
 * Formatiert einen DIVIDER Block
 * Visueller Trenner zwischen Abschnitten
 */
function formatDivider(block) {
  const style = block.data?.style || 'line';
  
  if (style === 'stars') {
    return '\n✦ ✦ ✦\n\n';
  }
  
  // Default: Linie
  return '\n━━━━━━━━━━\n\n';
}

/**
 * Formatiert einen MENTION Block
 * @-Erwähnungen für LinkedIn
 */
function formatMention(block) {
  const text = block.data?.text?.trim();
  if (!text) return '';
  
  // Stelle sicher, dass Mention mit @ beginnt
  const mention = text.startsWith('@') ? text : `@${text}`;
  
  return `${mention} `;
}

/**
 * Formatiert einen NUMBER Block
 * Zahlen/Statistiken mit Hervorhebung
 */
function formatNumber(block) {
  const text = block.data?.text?.trim();
  if (!text) return '';
  
  return `📊 ${text}\n\n`;
}

/**
 * Formatiert einen DURATION Block
 * Zeigt die Laufzeit der Umfrage an
 */
function formatDuration(block) {
  const val = block.data?.val;
  if (!val) return '';
  
  const labels = {
    '1day': '⏱️ Umfrage läuft: 24 Stunden',
    '3days': '⏱️ Umfrage läuft: 3 Tage',
    '1week': '⏱️ Umfrage läuft: 1 Woche'
  };
  
  const label = labels[val];
  if (!label) return '';
  
  return `${label}\n\n`;
}

/**
 * Formatiert einen SCHEDULE Block
 * Zeigt geplanten Veröffentlichungszeitpunkt
 * (Wird normalerweise NICHT im Post angezeigt, nur intern)
 */
function formatSchedule(block, options = {}) {
  // Schedule wird standardmäßig nicht im Post angezeigt
  if (!options.includeSchedule) {
    return '';
  }
  
  const date = block.data?.date;
  const time = block.data?.time;
  
  if (!date && !time) return '';
  
  let result = '📅 Geplant: ';
  if (date) {
    result += new Date(date).toLocaleDateString('de-DE');
  }
  if (time) {
    result += ` um ${time} Uhr`;
  }
  
  return result + '\n\n';
}

// ============================================
// MAIN COMPILER FUNCTION
// ============================================

/**
 * Kompiliert ein Array von Editor-Blöcken in einen LinkedIn-kompatiblen Post
 * 
 * @param {Array} blocks - Array von Block-Objekten aus dem Editor
 * @param {Object} options - Optionale Konfiguration
 * @param {boolean} options.includeChallenge - Challenge-Block einbeziehen (default: false)
 * @param {boolean} options.includePollCTA - "Stimme ab" CTA bei Polls (default: true)
 * @param {boolean} options.includeSchedule - Schedule im Post anzeigen (default: false)
 * @param {boolean} options.includeDuration - Duration im Post anzeigen (default: false)
 * @param {boolean} options.validate - Validierung gegen LinkedIn-Limits (default: true)
 * 
 * @returns {Object} - { text: string, warnings: string[], stats: object }
 */
export function compilePostFromBlocks(blocks, options = {}) {
  // Default-Optionen
  const opts = {
    includeChallenge: false,    // Challenge ist intern, nicht für LinkedIn
    includePollCTA: true,       // CTA bei Umfragen
    includeSchedule: false,     // Schedule ist intern
    includeDuration: false,     // Duration ist LinkedIn-spezifisch
    validate: true,             // Validierung aktiviert
    ...options
  };

  // Validierung: Input prüfen
  if (!blocks || !Array.isArray(blocks)) {
    return {
      text: '',
      warnings: ['Keine Blöcke zum Kompilieren vorhanden'],
      stats: { characters: 0, blocks: 0 }
    };
  }

  const warnings = [];
  let result = '';
  let hashtagsText = ''; // Hashtags werden am Ende gesammelt

  // Durch alle Blöcke iterieren
  for (const block of blocks) {
    // Überspringe ungültige Blöcke
    if (!block || !block.type) {
      continue;
    }

    // Challenge wird nicht im Post angezeigt (intern)
    if (block.type === 'CHALLENGE' && !opts.includeChallenge) {
      continue;
    }

    // Schedule wird nicht im Post angezeigt (intern)
    if (block.type === 'SCHEDULE' && !opts.includeSchedule) {
      continue;
    }

    // Duration wird separat behandelt (LinkedIn-Feature)
    if (block.type === 'DURATION' && !opts.includeDuration) {
      continue;
    }

    // Prüfe ob Block Content hat
    if (!hasContent(block)) {
      continue;
    }

    // Block formatieren je nach Typ
    switch (block.type) {
      case 'TITLE':
        result += formatTitle(block);
        break;
      
      case 'CUSTOM':
        result += formatCustomText(block);
        break;
      
      case 'POLL':
        result += formatPoll(block, opts);
        break;
      
      case 'CTA':
        result += formatCTA(block);
        break;
      
      case 'HASHTAG':
        // Hashtags sammeln für das Ende
        hashtagsText += formatHashtags(block) + ' ';
        break;
      
      case 'DIVIDER':
        result += formatDivider(block);
        break;
      
      case 'MENTION':
        result += formatMention(block);
        break;
      
      case 'NUMBER':
        result += formatNumber(block);
        break;
      
      case 'DURATION':
        result += formatDuration(block);
        break;
      
      case 'SCHEDULE':
        result += formatSchedule(block, opts);
        break;
      
      case 'CHALLENGE':
        // Challenge als Kommentar/Hinweis
        result += `💡 ${block.data.text.trim()}\n\n`;
        break;
      
      default:
        // Unbekannter Block-Typ
        warnings.push(`Unbekannter Block-Typ: ${block.type}`);
    }
  }

  // Hashtags am Ende anfügen
  if (hashtagsText.trim()) {
    result += '\n' + hashtagsText.trim();
  }

  // Text bereinigen
  const cleanedText = cleanText(result);

  // Validierung gegen LinkedIn-Limits
  if (opts.validate) {
    if (cleanedText.length > LINKEDIN_LIMITS.POST_TEXT) {
      warnings.push(
        `Post überschreitet LinkedIn-Limit: ${cleanedText.length}/${LINKEDIN_LIMITS.POST_TEXT} Zeichen`
      );
    }

    // Poll-Validierung
    const pollBlock = blocks.find(b => b.type === 'POLL');
    if (pollBlock?.data) {
      if (pollBlock.data.q?.length > LINKEDIN_LIMITS.POLL_QUESTION) {
        warnings.push(
          `Poll-Frage zu lang: ${pollBlock.data.q.length}/${LINKEDIN_LIMITS.POLL_QUESTION} Zeichen`
        );
      }
      
      pollBlock.data.opts?.forEach((opt, idx) => {
        if (opt?.length > LINKEDIN_LIMITS.POLL_OPTION) {
          warnings.push(
            `Poll-Option ${idx + 1} zu lang: ${opt.length}/${LINKEDIN_LIMITS.POLL_OPTION} Zeichen`
          );
        }
      });
    }
  }

  // Statistiken berechnen
  const stats = {
    characters: cleanedText.length,
    maxCharacters: LINKEDIN_LIMITS.POST_TEXT,
    percentUsed: Math.round((cleanedText.length / LINKEDIN_LIMITS.POST_TEXT) * 100),
    blocks: blocks.filter(b => hasContent(b)).length,
    hasWarnings: warnings.length > 0
  };

  return {
    text: cleanedText,
    warnings,
    stats
  };
}

// ============================================
// ADDITIONAL UTILITIES
// ============================================

/**
 * Erstellt eine Vorschau des Posts (gekürzt)
 * @param {string} text - Vollständiger Post-Text
 * @param {number} maxLength - Maximale Länge der Vorschau
 * @returns {string} - Gekürzte Vorschau
 */
export function createPreview(text, maxLength = 150) {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Extrahiert Hashtags aus einem Text
 * @param {string} text - Text mit Hashtags
 * @returns {string[]} - Array von Hashtags
 */
export function extractHashtags(text) {
  if (!text) return [];
  
  const matches = text.match(/#\w+/g);
  return matches || [];
}

/**
 * Zählt Wörter in einem Text
 * @param {string} text - Zu zählender Text
 * @returns {number} - Anzahl Wörter
 */
export function countWords(text) {
  if (!text) return 0;
  
  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
}

/**
 * Validiert einen einzelnen Block gegen LinkedIn-Limits
 * @param {object} block - Block-Objekt
 * @returns {object} - { valid: boolean, errors: string[] }
 */
export function validateBlock(block) {
  const errors = [];

  if (!block || !block.type) {
    return { valid: false, errors: ['Ungültiger Block'] };
  }

  switch (block.type) {
    case 'POLL':
      if (block.data?.q?.length > LINKEDIN_LIMITS.POLL_QUESTION) {
        errors.push(`Frage zu lang (max. ${LINKEDIN_LIMITS.POLL_QUESTION} Zeichen)`);
      }
      block.data?.opts?.forEach((opt, idx) => {
        if (opt?.length > LINKEDIN_LIMITS.POLL_OPTION) {
          errors.push(`Option ${idx + 1} zu lang (max. ${LINKEDIN_LIMITS.POLL_OPTION} Zeichen)`);
        }
      });
      break;
    
    // Weitere Block-Typen können hier validiert werden
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================
// EXPORT DEFAULT
// ============================================
export default {
  compilePostFromBlocks,
  toBoldUnicode,
  toItalicUnicode,
  toBoldItalicUnicode,
  createPreview,
  extractHashtags,
  countWords,
  validateBlock,
  LINKEDIN_LIMITS
};
