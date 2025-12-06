// ============================================
// SLIDE TEMPLATES - LinkedIn Carousel Builder
// ============================================

import { Type, Image, Smile, Minus, User, Hash, List, Quote, Sparkles } from 'lucide-react';

// ============================================
// BLOCK TYPES
// ============================================
export const BLOCK_TYPES = {
  HEADING: {
    id: 'HEADING',
    name: 'Heading',
    nameDE: 'Überschrift',
    icon: Type,
    defaultContent: {
      text: 'Überschrift hier',
      fontSize: 'xl',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#FFFFFF'
    }
  },
  SUBHEADING: {
    id: 'SUBHEADING',
    name: 'Subheading',
    nameDE: 'Unterüberschrift',
    icon: Type,
    defaultContent: {
      text: 'Unterüberschrift',
      fontSize: 'lg',
      fontWeight: 'medium',
      textAlign: 'center',
      color: '#FFFFFF'
    }
  },
  PARAGRAPH: {
    id: 'PARAGRAPH',
    name: 'Paragraph',
    nameDE: 'Absatz',
    icon: List,
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
    icon: Image,
    defaultContent: {
      src: null,
      alt: 'Bild',
      fit: 'cover',
      borderRadius: 'lg'
    }
  },
  ICON: {
    id: 'ICON',
    name: 'Icon/Emoji',
    nameDE: 'Icon/Emoji',
    icon: Smile,
    defaultContent: {
      emoji: '🚀',
      size: 'xl'
    }
  },
  BADGE: {
    id: 'BADGE',
    name: 'Badge',
    nameDE: 'Badge',
    icon: Hash,
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
    icon: Minus,
    defaultContent: {
      style: 'solid',
      color: '#FFFFFF',
      opacity: 0.2,
      width: '50%'
    }
  },
  BRANDING: {
    id: 'BRANDING',
    name: 'Branding',
    nameDE: 'Branding',
    icon: User,
    defaultContent: {
      name: 'Dein Name',
      handle: '@deinhandle',
      showAvatar: true,
      avatarUrl: null
    }
  },
  QUOTE: {
    id: 'QUOTE',
    name: 'Quote',
    nameDE: 'Zitat',
    icon: Quote,
    defaultContent: {
      text: '"Hier steht ein inspirierendes Zitat"',
      author: '',
      fontSize: 'lg',
      fontStyle: 'italic'
    }
  },
  BULLET_LIST: {
    id: 'BULLET_LIST',
    name: 'Bullet List',
    nameDE: 'Aufzählung',
    icon: List,
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
    icon: Hash,
    defaultContent: {
      number: '01',
      label: '',
      color: '#FF6B35'
    }
  }
};

// ============================================
// SLIDE TEMPLATES
// ============================================
export const SLIDE_TEMPLATES = {
  cover: {
    id: 'cover',
    name: 'Cover Slide',
    nameDE: 'Cover Slide',
    description: 'Eye-catching first slide with hook',
    descriptionDE: 'Aufmerksamkeitsstarke erste Slide',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '🎯', size: 'xxl' } },
      { type: 'HEADING', content: { text: 'Die eine Frage, die alles verändert', fontSize: 'xxl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'SUBHEADING', content: { text: 'Swipe für die Antwort →', fontSize: 'lg', fontWeight: 'normal', textAlign: 'center', color: '#FF6B35' } },
      { type: 'BRANDING', content: { name: 'Dein Name', handle: '@handle', showAvatar: true } }
    ],
    defaultStyles: {
      background: 'gradient-orange',
      padding: 'lg'
    }
  },
  option: {
    id: 'option',
    name: 'Option Slide',
    nameDE: 'Option Slide',
    description: 'Present one option/argument',
    descriptionDE: 'Präsentiere eine Option',
    defaultBlocks: [
      { type: 'NUMBER', content: { number: '01', label: '', color: '#FF6B35' } },
      { type: 'HEADING', content: { text: 'Option A: Der Klassiker', fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' } },
      { type: 'PARAGRAPH', content: { text: 'Beschreibe hier die erste Option. Was sind die Vorteile? Warum sollte man sich dafür entscheiden?', fontSize: 'base', textAlign: 'left', color: '#B0B0B0' } },
      { type: 'DIVIDER', content: { style: 'solid', opacity: 0.1, width: '100%' } }
    ],
    defaultStyles: {
      background: 'solid-dark',
      padding: 'lg'
    }
  },
  comparison: {
    id: 'comparison',
    name: 'Comparison Slide',
    nameDE: 'Vergleich Slide',
    description: 'Compare two options side by side',
    descriptionDE: 'Vergleiche zwei Optionen',
    defaultBlocks: [
      { type: 'HEADING', content: { text: 'Option A vs Option B', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'DIVIDER', content: { style: 'solid', opacity: 0.2, width: '80%' } },
      { type: 'BULLET_LIST', content: { items: ['Pro 1', 'Pro 2', 'Pro 3'], bulletStyle: 'check', color: '#00E676' } }
    ],
    defaultStyles: {
      background: 'solid-dark',
      padding: 'lg'
    }
  },
  stats: {
    id: 'stats',
    name: 'Stats Slide',
    nameDE: 'Statistik Slide',
    description: 'Show impressive numbers',
    descriptionDE: 'Zeige beeindruckende Zahlen',
    defaultBlocks: [
      { type: 'NUMBER', content: { number: '87%', label: 'der Gründer', color: '#FF6B35' } },
      { type: 'HEADING', content: { text: 'scheitern in den ersten 3 Jahren', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'SUBHEADING', content: { text: 'Aber du kannst es anders machen.', fontSize: 'base', fontWeight: 'normal', textAlign: 'center', color: '#B0B0B0' } }
    ],
    defaultStyles: {
      background: 'gradient-dark',
      padding: 'lg'
    }
  },
  quote: {
    id: 'quote',
    name: 'Quote Slide',
    nameDE: 'Zitat Slide',
    description: 'Feature a powerful quote',
    descriptionDE: 'Präsentiere ein starkes Zitat',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '💬', size: 'xl' } },
      { type: 'QUOTE', content: { text: '"Der beste Zeitpunkt zu starten war gestern. Der zweitbeste ist jetzt."', author: '', fontSize: 'xl', fontStyle: 'italic' } },
      { type: 'BRANDING', content: { name: 'Dein Name', handle: '@handle', showAvatar: true } }
    ],
    defaultStyles: {
      background: 'gradient-purple',
      padding: 'lg'
    }
  },
  cta: {
    id: 'cta',
    name: 'CTA Slide',
    nameDE: 'CTA Slide',
    description: 'Call-to-action ending',
    descriptionDE: 'Handlungsaufforderung am Ende',
    defaultBlocks: [
      { type: 'HEADING', content: { text: 'Was denkst du?', fontSize: 'xxl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'SUBHEADING', content: { text: 'Teile deine Meinung in den Kommentaren!', fontSize: 'lg', fontWeight: 'normal', textAlign: 'center', color: '#B0B0B0' } },
      { type: 'DIVIDER', content: { style: 'solid', opacity: 0.2, width: '60%' } },
      { type: 'PARAGRAPH', content: { text: '💬 Kommentieren\n♻️ Reposten\n🔔 Folgen für mehr', fontSize: 'base', textAlign: 'center', color: '#FF6B35' } },
      { type: 'BRANDING', content: { name: 'Dein Name', handle: '@handle', showAvatar: true } }
    ],
    defaultStyles: {
      background: 'gradient-orange',
      padding: 'lg'
    }
  },
  blank: {
    id: 'blank',
    name: 'Blank Slide',
    nameDE: 'Leere Slide',
    description: 'Start from scratch',
    descriptionDE: 'Von Grund auf neu',
    defaultBlocks: [],
    defaultStyles: {
      background: 'solid-dark',
      padding: 'lg'
    }
  }
};

// ============================================
// BACKGROUND STYLES
// ============================================
export const BACKGROUND_STYLES = {
  'solid-dark': {
    name: 'Dark',
    nameDE: 'Dunkel',
    style: { backgroundColor: '#0A0A0B' }
  },
  'solid-black': {
    name: 'Black',
    nameDE: 'Schwarz',
    style: { backgroundColor: '#000000' }
  },
  'solid-white': {
    name: 'White',
    nameDE: 'Weiß',
    style: { backgroundColor: '#FFFFFF' }
  },
  'gradient-orange': {
    name: 'Orange Gradient',
    nameDE: 'Orange Verlauf',
    style: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }
  },
  'gradient-dark': {
    name: 'Dark Gradient',
    nameDE: 'Dunkler Verlauf',
    style: { background: 'linear-gradient(180deg, #0A0A0B 0%, #1a1a2e 100%)' }
  },
  'gradient-purple': {
    name: 'Purple Gradient',
    nameDE: 'Lila Verlauf',
    style: { background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a1a2e 100%)' }
  },
  'gradient-blue': {
    name: 'Blue Gradient',
    nameDE: 'Blau Verlauf',
    style: { background: 'linear-gradient(135deg, #0a192f 0%, #172a45 50%, #0a192f 100%)' }
  },
  'gradient-green': {
    name: 'Green Gradient',
    nameDE: 'Grün Verlauf',
    style: { background: 'linear-gradient(135deg, #0a1a0a 0%, #1a2f1a 50%, #0a1a0a 100%)' }
  }
};

// ============================================
// FONT SIZE PRESETS
// ============================================
export const FONT_SIZES = {
  xs: { label: 'XS', size: '14px', lineHeight: '1.4' },
  sm: { label: 'S', size: '18px', lineHeight: '1.4' },
  base: { label: 'M', size: '24px', lineHeight: '1.5' },
  lg: { label: 'L', size: '32px', lineHeight: '1.3' },
  xl: { label: 'XL', size: '48px', lineHeight: '1.2' },
  xxl: { label: 'XXL', size: '64px', lineHeight: '1.1' },
  xxxl: { label: 'XXXL', size: '80px', lineHeight: '1.0' }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
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
