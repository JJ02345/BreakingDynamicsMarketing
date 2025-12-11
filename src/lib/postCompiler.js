// Re-export from modular structure for backward compatibility
export {
  LINKEDIN_LIMITS,
  toBoldUnicode,
  toItalicUnicode,
  toBoldItalicUnicode,
  compilePostFromBlocks,
  createPreview,
  extractHashtags,
  countWords,
  validateBlock
} from './postCompiler/index';

import {
  LINKEDIN_LIMITS,
  toBoldUnicode,
  toItalicUnicode,
  toBoldItalicUnicode,
  compilePostFromBlocks,
  createPreview,
  extractHashtags,
  countWords,
  validateBlock
} from './postCompiler/index';

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
