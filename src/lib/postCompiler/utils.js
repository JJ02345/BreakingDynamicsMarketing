import { LINKEDIN_LIMITS } from './constants';

export function createPreview(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
}

export function extractHashtags(text) {
  if (!text) return [];
  const matches = text.match(/#\w+/g);
  return matches || [];
}

export function countWords(text) {
  if (!text) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
}

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
  }

  return { valid: errors.length === 0, errors };
}
