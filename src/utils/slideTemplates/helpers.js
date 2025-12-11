import { BLOCK_TYPES } from './blockTypes';
import { SLIDE_TEMPLATES } from './templates';

export const FONT_SIZES = {
  xs: { label: 'XS', size: '14px', lineHeight: '1.4' },
  sm: { label: 'S', size: '18px', lineHeight: '1.4' },
  base: { label: 'M', size: '24px', lineHeight: '1.5' },
  lg: { label: 'L', size: '32px', lineHeight: '1.3' },
  xl: { label: 'XL', size: '48px', lineHeight: '1.2' },
  xxl: { label: 'XXL', size: '64px', lineHeight: '1.1' },
  xxxl: { label: 'XXXL', size: '80px', lineHeight: '1.0' }
};

export const createSlide = (templateId, slideNumber = 1) => {
  const template = SLIDE_TEMPLATES[templateId] || SLIDE_TEMPLATES.blank;

  return {
    id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: templateId,
    blocks: template.defaultBlocks.map((block, index) => ({
      id: `block-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      type: block.type,
      content: { ...BLOCK_TYPES[block.type].defaultContent, ...block.content }
    })),
    styles: { ...template.defaultStyles },
    order: slideNumber
  };
};

export const createDefaultCarousel = () => {
  return [
    createSlide('cover', 1),
    createSlide('option', 2),
    createSlide('option', 3),
    createSlide('cta', 4)
  ];
};

export const createBlock = (blockType) => {
  const blockDef = BLOCK_TYPES[blockType];
  if (!blockDef) return null;

  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: blockType,
    content: { ...blockDef.defaultContent }
  };
};
