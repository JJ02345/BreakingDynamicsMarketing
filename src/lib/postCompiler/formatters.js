import { toBoldUnicode } from './unicodeConverters';

function getPollEmoji(index) {
  const emojis = ['🅰️', '🅱️', '©️', '🅳'];
  return emojis[index] || `${index + 1}.`;
}

export function formatTitle(block) {
  const text = block.data?.text?.trim();
  if (!text) return '';
  return toBoldUnicode(text) + '\n\n';
}

export function formatCustomText(block) {
  const text = block.data?.text?.trim();
  if (!text) return '';
  return text + '\n\n';
}

export function formatPoll(block, options = {}) {
  const question = block.data?.q?.trim();
  const opts = block.data?.opts || [];
  if (!question) return '';

  const validOptions = opts.filter(opt => opt?.trim());
  if (validOptions.length === 0) {
    return `🎯 ${question}\n\n`;
  }

  let result = `🎯 ${question}\n\n`;
  validOptions.forEach((opt, index) => {
    result += `${getPollEmoji(index)} ${opt.trim()}\n`;
  });

  if (options.includePollCTA !== false) {
    result += '\n👇 Stimme ab in den Kommentaren!\n';
  }
  result += '\n';
  return result;
}

export function formatCTA(block) {
  const text = block.data?.text?.trim();
  if (!text) return '';
  return `👉 ${text}\n\n`;
}

export function formatHashtags(block) {
  const tags = block.data?.tags?.trim();
  if (!tags) return '';
  return tags
    .split(/\s+/)
    .map(tag => tag.startsWith('#') ? tag : `#${tag}`)
    .join(' ');
}

export function formatDivider(block) {
  const style = block.data?.style || 'line';
  if (style === 'stars') return '\n✦ ✦ ✦\n\n';
  return '\n━━━━━━━━━━\n\n';
}

export function formatMention(block) {
  const text = block.data?.text?.trim();
  if (!text) return '';
  const mention = text.startsWith('@') ? text : `@${text}`;
  return `${mention} `;
}

export function formatNumber(block) {
  const text = block.data?.text?.trim();
  if (!text) return '';
  return `📊 ${text}\n\n`;
}

export function formatDuration(block) {
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

export function formatSchedule(block, options = {}) {
  if (!options.includeSchedule) return '';
  const date = block.data?.date;
  const time = block.data?.time;
  if (!date && !time) return '';

  let result = '📅 Geplant: ';
  if (date) result += new Date(date).toLocaleDateString('de-DE');
  if (time) result += ` um ${time} Uhr`;
  return result + '\n\n';
}
