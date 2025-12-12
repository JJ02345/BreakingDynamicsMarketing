// Block Type Definitions for Carousel
// Defines all available block types and their default content

import type { BlockType, BlockContent } from '../types';

export interface BlockTypeDefinition {
  id: BlockType;
  name: string;
  nameDE: string;
  icon: string; // Icon name from lucide-react
  defaultContent: BlockContent;
  category?: 'text' | 'media' | 'layout' | 'data';
}

export const BLOCK_TYPES: Record<string, BlockTypeDefinition> = {
  HEADING: {
    id: 'HEADING',
    name: 'Heading',
    nameDE: 'Überschrift',
    icon: 'Type',
    category: 'text',
    defaultContent: {
      text: 'Überschrift hier',
      fontSize: 'xl',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#FFFFFF'
    }
  },
  SUBHEADING: {
    id: 'HEADING', // Uses HEADING type internally
    name: 'Subheading',
    nameDE: 'Unterüberschrift',
    icon: 'Type',
    category: 'text',
    defaultContent: {
      text: 'Unterüberschrift',
      fontSize: 'lg',
      fontWeight: '500',
      textAlign: 'center',
      color: '#FFFFFF'
    }
  },
  PARAGRAPH: {
    id: 'PARAGRAPH',
    name: 'Paragraph',
    nameDE: 'Absatz',
    icon: 'AlignLeft',
    category: 'text',
    defaultContent: {
      text: 'Beschreibungstext hier eingeben...',
      fontSize: 'base',
      fontWeight: 'normal',
      textAlign: 'left',
      color: '#E5E5E5'
    }
  },
  IMAGE: {
    id: 'IMAGE',
    name: 'Image',
    nameDE: 'Bild',
    icon: 'Image',
    category: 'media',
    defaultContent: {
      src: '',
      alt: 'Bild',
      objectFit: 'cover',
      borderRadius: '12px'
    }
  },
  ICON: {
    id: 'ICON',
    name: 'Icon/Emoji',
    nameDE: 'Icon/Emoji',
    icon: 'Smile',
    category: 'media',
    defaultContent: {
      emoji: '🚀',
      size: 'xl'
    }
  },
  BADGE: {
    id: 'BADGE',
    name: 'Badge',
    nameDE: 'Badge',
    icon: 'Tag',
    category: 'layout',
    defaultContent: {
      text: 'Option A',
      backgroundColor: '#FF6B35',
      textColor: '#FFFFFF'
    }
  },
  DIVIDER: {
    id: 'DIVIDER',
    name: 'Divider',
    nameDE: 'Trennlinie',
    icon: 'Minus',
    category: 'layout',
    defaultContent: {
      style: 'solid',
      color: '#FFFFFF',
      thickness: 2,
      width: '50%'
    }
  },
  BRANDING: {
    id: 'BRANDING',
    name: 'Branding',
    nameDE: 'Branding',
    icon: 'User',
    category: 'layout',
    defaultContent: {
      name: 'Dein Name',
      tagline: '@deinhandle',
      showName: true,
      showTagline: true,
      avatarUrl: ''
    }
  },
  QUOTE: {
    id: 'QUOTE',
    name: 'Quote',
    nameDE: 'Zitat',
    icon: 'Quote',
    category: 'text',
    defaultContent: {
      text: '"Hier steht ein inspirierendes Zitat"',
      author: '',
      fontSize: 'lg'
    }
  },
  BULLET_LIST: {
    id: 'BULLET_LIST',
    name: 'Bullet List',
    nameDE: 'Aufzählung',
    icon: 'List',
    category: 'text',
    defaultContent: {
      items: ['Punkt 1', 'Punkt 2', 'Punkt 3'],
      bulletStyle: 'check',
      color: '#FFFFFF'
    }
  },
  NUMBER: {
    id: 'NUMBER',
    name: 'Big Number',
    nameDE: 'Große Zahl',
    icon: 'Hash',
    category: 'data',
    defaultContent: {
      number: '01',
      label: '',
      color: '#FF6B35'
    }
  }
};

// Font size mapping
export const FONT_SIZES = {
  xs: { label: 'XS', size: '14px', lineHeight: '1.4' },
  sm: { label: 'S', size: '18px', lineHeight: '1.4' },
  base: { label: 'M', size: '24px', lineHeight: '1.5' },
  lg: { label: 'L', size: '32px', lineHeight: '1.3' },
  xl: { label: 'XL', size: '48px', lineHeight: '1.2' },
  xxl: { label: 'XXL', size: '64px', lineHeight: '1.1' },
  xxxl: { label: 'XXXL', size: '80px', lineHeight: '1.0' }
} as const;

// PDF Font size map (pixels for rendering)
export const PDF_FONT_SIZE_MAP: Record<string, string> = {
  xs: '16px',
  sm: '20px',
  base: '28px',
  lg: '40px',
  xl: '56px',
  xxl: '72px',
  xxxl: '96px'
};

export function getFontSize(fontSize?: string): string {
  if (!fontSize) return PDF_FONT_SIZE_MAP.base;
  if (typeof fontSize === 'string' && fontSize.endsWith('px')) {
    return fontSize;
  }
  return PDF_FONT_SIZE_MAP[fontSize] || PDF_FONT_SIZE_MAP.base;
}

export default BLOCK_TYPES;
