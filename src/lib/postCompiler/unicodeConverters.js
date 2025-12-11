// Unicode Bold Sans-Serif Converter
export function toBoldUnicode(text) {
  if (!text || typeof text !== 'string') return '';

  const BOLD_UPPERCASE_START = 0x1D5D4;
  const BOLD_LOWERCASE_START = 0x1D5EE;
  const BOLD_DIGIT_START = 0x1D7EC;

  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      result += String.fromCodePoint(BOLD_UPPERCASE_START + (code - 65));
    } else if (code >= 97 && code <= 122) {
      result += String.fromCodePoint(BOLD_LOWERCASE_START + (code - 97));
    } else if (code >= 48 && code <= 57) {
      result += String.fromCodePoint(BOLD_DIGIT_START + (code - 48));
    } else {
      result += char;
    }
  }
  return result;
}

// Unicode Italic Sans-Serif Converter
export function toItalicUnicode(text) {
  if (!text || typeof text !== 'string') return '';

  const ITALIC_UPPERCASE_START = 0x1D608;
  const ITALIC_LOWERCASE_START = 0x1D622;

  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      result += String.fromCodePoint(ITALIC_UPPERCASE_START + (code - 65));
    } else if (code >= 97 && code <= 122) {
      result += String.fromCodePoint(ITALIC_LOWERCASE_START + (code - 97));
    } else {
      result += char;
    }
  }
  return result;
}

// Unicode Bold Italic Sans-Serif Converter
export function toBoldItalicUnicode(text) {
  if (!text || typeof text !== 'string') return '';

  const BOLD_ITALIC_UPPERCASE_START = 0x1D63C;
  const BOLD_ITALIC_LOWERCASE_START = 0x1D656;

  let result = '';
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      result += String.fromCodePoint(BOLD_ITALIC_UPPERCASE_START + (code - 65));
    } else if (code >= 97 && code <= 122) {
      result += String.fromCodePoint(BOLD_ITALIC_LOWERCASE_START + (code - 97));
    } else {
      result += char;
    }
  }
  return result;
}
