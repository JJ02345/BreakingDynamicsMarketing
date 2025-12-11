import { LINKEDIN_LIMITS } from './constants';
import {
  formatTitle, formatCustomText, formatPoll, formatCTA,
  formatHashtags, formatDivider, formatMention, formatNumber,
  formatDuration, formatSchedule
} from './formatters';

function cleanText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\u00A0/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

function hasContent(block) {
  if (!block || !block.data) return false;
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
      return true;
    case 'DURATION':
      return Boolean(data.val);
    case 'SCHEDULE':
      return Boolean(data.date || data.time);
    default:
      return false;
  }
}

export function compilePostFromBlocks(blocks, options = {}) {
  const opts = {
    includeChallenge: false,
    includePollCTA: true,
    includeSchedule: false,
    includeDuration: false,
    validate: true,
    ...options
  };

  if (!blocks || !Array.isArray(blocks)) {
    return {
      text: '',
      warnings: ['Keine Blöcke zum Kompilieren vorhanden'],
      stats: { characters: 0, blocks: 0 }
    };
  }

  const warnings = [];
  let result = '';
  let hashtagsText = '';

  for (const block of blocks) {
    if (!block || !block.type) continue;
    if (block.type === 'CHALLENGE' && !opts.includeChallenge) continue;
    if (block.type === 'SCHEDULE' && !opts.includeSchedule) continue;
    if (block.type === 'DURATION' && !opts.includeDuration) continue;
    if (!hasContent(block)) continue;

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
        result += `💡 ${block.data.text.trim()}\n\n`;
        break;
      default:
        warnings.push(`Unbekannter Block-Typ: ${block.type}`);
    }
  }

  if (hashtagsText.trim()) {
    result += '\n' + hashtagsText.trim();
  }

  const cleanedText = cleanText(result);

  if (opts.validate) {
    if (cleanedText.length > LINKEDIN_LIMITS.POST_TEXT) {
      warnings.push(`Post überschreitet LinkedIn-Limit: ${cleanedText.length}/${LINKEDIN_LIMITS.POST_TEXT} Zeichen`);
    }

    const pollBlock = blocks.find(b => b.type === 'POLL');
    if (pollBlock?.data) {
      if (pollBlock.data.q?.length > LINKEDIN_LIMITS.POLL_QUESTION) {
        warnings.push(`Poll-Frage zu lang: ${pollBlock.data.q.length}/${LINKEDIN_LIMITS.POLL_QUESTION} Zeichen`);
      }
      pollBlock.data.opts?.forEach((opt, idx) => {
        if (opt?.length > LINKEDIN_LIMITS.POLL_OPTION) {
          warnings.push(`Poll-Option ${idx + 1} zu lang: ${opt.length}/${LINKEDIN_LIMITS.POLL_OPTION} Zeichen`);
        }
      });
    }
  }

  return {
    text: cleanedText,
    warnings,
    stats: {
      characters: cleanedText.length,
      maxCharacters: LINKEDIN_LIMITS.POST_TEXT,
      percentUsed: Math.round((cleanedText.length / LINKEDIN_LIMITS.POST_TEXT) * 100),
      blocks: blocks.filter(b => hasContent(b)).length,
      hasWarnings: warnings.length > 0
    }
  };
}
