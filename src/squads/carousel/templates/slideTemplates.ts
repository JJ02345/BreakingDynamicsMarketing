// Slide Templates for Carousel
// Pre-defined slide layouts and carousel templates

import type { SlideType, Block, Slide, CarouselTemplate } from '../types';
import { BLOCK_TYPES } from './blockTypes';

// ============================================
// SLIDE TEMPLATE DEFINITIONS
// ============================================

interface SlideTemplateBlock {
  type: string;
  content?: Partial<Record<string, unknown>>;
}

interface SlideTemplate {
  id: SlideType;
  name: string;
  nameDE: string;
  defaultBlocks: SlideTemplateBlock[];
  defaultStyles: {
    background: string;
    padding?: string;
  };
}

export const SLIDE_TEMPLATES: Record<string, SlideTemplate> = {
  // Cover slide
  cover: {
    id: 'cover',
    name: 'Cover',
    nameDE: 'Titelbild',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '🚀', size: 'xxl' } },
      { type: 'HEADING', content: { text: 'Dein Titel hier', fontSize: '72px', fontWeight: '900' } },
      { type: 'BADGE', content: { text: '→ SWIPE', backgroundColor: '#FF6B35' } }
    ],
    defaultStyles: { background: 'gradient-orange', padding: 'xl' }
  },

  // Content slide
  content: {
    id: 'content',
    name: 'Content',
    nameDE: 'Inhalt',
    defaultBlocks: [
      { type: 'NUMBER', content: { number: '01', color: '#FF6B35' } },
      { type: 'HEADING', content: { text: 'Hauptaussage', fontSize: '44px' } },
      { type: 'PARAGRAPH', content: { text: 'Erklärender Text hier...', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-dark', padding: 'xl' }
  },

  // CTA slide
  cta: {
    id: 'cta',
    name: 'Call to Action',
    nameDE: 'Handlungsaufforderung',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '🎯', size: 'xxl' } },
      { type: 'HEADING', content: { text: 'FOLGE MIR', fontSize: '64px', fontWeight: '900' } },
      { type: 'PARAGRAPH', content: { text: 'Für mehr Content wie diesen', fontSize: '24px', color: '#B0B0B0' } },
      { type: 'PARAGRAPH', content: { text: '💬  ♻️  🔔', fontSize: '36px', color: '#FF6B35' } }
    ],
    defaultStyles: { background: 'gradient-orange', padding: 'xl' }
  },

  // Blank slide
  blank: {
    id: 'blank',
    name: 'Blank',
    nameDE: 'Leer',
    defaultBlocks: [],
    defaultStyles: { background: 'solid-dark', padding: 'xl' }
  },

  // Tip slide
  tip: {
    id: 'tip',
    name: 'Tip',
    nameDE: 'Tipp',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'TIPP', backgroundColor: '#10B981' } },
      { type: 'HEADING', content: { text: 'Wertvoller Tipp', fontSize: '44px' } },
      { type: 'PARAGRAPH', content: { text: 'Detaillierte Erklärung...', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-dark', padding: 'xl' }
  },

  // Step slide
  step: {
    id: 'step',
    name: 'Step',
    nameDE: 'Schritt',
    defaultBlocks: [
      { type: 'NUMBER', content: { number: '01', color: '#3B82F6' } },
      { type: 'HEADING', content: { text: 'Schritt-Überschrift', fontSize: '44px' } },
      { type: 'PARAGRAPH', content: { text: 'Was zu tun ist...', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-blue', padding: 'xl' }
  },

  // Myth slide
  myth: {
    id: 'myth',
    name: 'Myth',
    nameDE: 'Mythos',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'MYTHOS', backgroundColor: '#EF4444' } },
      { type: 'ICON', content: { emoji: '❌', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Der Mythos', fontSize: '44px' } }
    ],
    defaultStyles: { background: 'gradient-fire', padding: 'xl' }
  },

  // Reality slide
  reality: {
    id: 'reality',
    name: 'Reality',
    nameDE: 'Realität',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'REALITÄT', backgroundColor: '#10B981' } },
      { type: 'ICON', content: { emoji: '✅', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Die Wahrheit', fontSize: '44px' } }
    ],
    defaultStyles: { background: 'gradient-emerald', padding: 'xl' }
  },

  // Option slide
  option: {
    id: 'option',
    name: 'Option',
    nameDE: 'Option',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'OPTION A', backgroundColor: '#FF6B35' } },
      { type: 'HEADING', content: { text: 'Option Titel', fontSize: '44px' } },
      { type: 'BULLET_LIST', content: { items: ['Vorteil 1', 'Vorteil 2', 'Vorteil 3'] } }
    ],
    defaultStyles: { background: 'gradient-dark', padding: 'xl' }
  },

  // Comparison slide
  comparison: {
    id: 'comparison',
    name: 'Comparison',
    nameDE: 'Vergleich',
    defaultBlocks: [
      { type: 'HEADING', content: { text: 'Fazit', fontSize: '44px' } },
      { type: 'PARAGRAPH', content: { text: 'Zusammenfassung des Vergleichs...', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-purple', padding: 'xl' }
  },

  // Journey slide
  journey: {
    id: 'journey',
    name: 'Journey',
    nameDE: 'Reise',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '📍', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Der Weg', fontSize: '44px' } },
      { type: 'PARAGRAPH', content: { text: 'Die Geschichte geht weiter...', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-aurora', padding: 'xl' }
  },

  // Quote slide
  quote: {
    id: 'quote',
    name: 'Quote',
    nameDE: 'Zitat',
    defaultBlocks: [
      { type: 'QUOTE', content: { text: '"Ein inspirierendes Zitat hier"', author: '- Autor', fontSize: 'xl' } }
    ],
    defaultStyles: { background: 'gradient-purple', padding: 'xl' }
  },

  // Stats slide
  stats: {
    id: 'stats',
    name: 'Stats',
    nameDE: 'Statistik',
    defaultBlocks: [
      { type: 'NUMBER', content: { number: '85%', label: 'Erfolgsquote', color: '#FF6B35' } },
      { type: 'PARAGRAPH', content: { text: 'Kontext zur Statistik', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-dark', padding: 'xl' }
  },

  // Before slide
  before: {
    id: 'before',
    name: 'Before',
    nameDE: 'Vorher',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'VORHER', backgroundColor: '#EF4444' } },
      { type: 'ICON', content: { emoji: '😫', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Das Problem', fontSize: '44px' } }
    ],
    defaultStyles: { background: 'gradient-fire', padding: 'xl' }
  },

  // After slide
  after: {
    id: 'after',
    name: 'After',
    nameDE: 'Nachher',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'NACHHER', backgroundColor: '#10B981' } },
      { type: 'ICON', content: { emoji: '🎉', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Die Lösung', fontSize: '44px' } }
    ],
    defaultStyles: { background: 'gradient-emerald', padding: 'xl' }
  },

  // Lesson slide
  lesson: {
    id: 'lesson',
    name: 'Lesson',
    nameDE: 'Lektion',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '💡', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Lektion gelernt', fontSize: '44px' } },
      { type: 'PARAGRAPH', content: { text: 'Was ich daraus gelernt habe...', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-gold', padding: 'xl' }
  },

  // Opinion slide
  opinion: {
    id: 'opinion',
    name: 'Opinion',
    nameDE: 'Meinung',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'UNPOPULAR OPINION', backgroundColor: '#8B5CF6' } },
      { type: 'HEADING', content: { text: 'Kontroverse These', fontSize: '44px' } }
    ],
    defaultStyles: { background: 'gradient-purple', padding: 'xl' }
  },

  // Proof slide
  proof: {
    id: 'proof',
    name: 'Proof',
    nameDE: 'Beweis',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '📊', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Der Beweis', fontSize: '44px' } },
      { type: 'PARAGRAPH', content: { text: 'Fakten und Daten...', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-dark', padding: 'xl' }
  },

  // About intro slide
  aboutIntro: {
    id: 'aboutIntro',
    name: 'About Intro',
    nameDE: 'Über mich Intro',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '👋', size: 'xxl' } },
      { type: 'HEADING', content: { text: 'HI, ICH BIN...', fontSize: '64px', fontWeight: '900' } }
    ],
    defaultStyles: { background: 'gradient-orange', padding: 'xl' }
  },

  // About who slide
  aboutWho: {
    id: 'aboutWho',
    name: 'About Who',
    nameDE: 'Wer ich bin',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'WER ICH BIN', backgroundColor: '#FF6B35' } },
      { type: 'HEADING', content: { text: 'Mein Background', fontSize: '44px' } },
      { type: 'PARAGRAPH', content: { text: 'Kurze Vorstellung...', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-dark', padding: 'xl' }
  },

  // About what slide
  aboutWhat: {
    id: 'aboutWhat',
    name: 'About What',
    nameDE: 'Was ich mache',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'WAS ICH MACHE', backgroundColor: '#3B82F6' } },
      { type: 'BULLET_LIST', content: { items: ['Expertise 1', 'Expertise 2', 'Expertise 3'] } }
    ],
    defaultStyles: { background: 'gradient-blue', padding: 'xl' }
  },

  // About why slide
  aboutWhy: {
    id: 'aboutWhy',
    name: 'About Why',
    nameDE: 'Warum ich das mache',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'MEINE MISSION', backgroundColor: '#10B981' } },
      { type: 'HEADING', content: { text: 'Warum ich das mache', fontSize: '44px' } },
      { type: 'PARAGRAPH', content: { text: 'Meine Motivation...', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-emerald', padding: 'xl' }
  },

  // Fun fact slide
  funFact: {
    id: 'funFact',
    name: 'Fun Fact',
    nameDE: 'Fun Fact',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'FUN FACT', backgroundColor: '#8B5CF6' } },
      { type: 'ICON', content: { emoji: '🎮', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Wusstest du...', fontSize: '44px' } }
    ],
    defaultStyles: { background: 'gradient-purple', padding: 'xl' }
  },

  // Result slide
  result: {
    id: 'result',
    name: 'Result',
    nameDE: 'Ergebnis',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '🏆', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Das Ergebnis', fontSize: '44px' } },
      { type: 'PARAGRAPH', content: { text: 'Was du erreichen wirst...', fontSize: '24px', color: '#B0B0B0' } }
    ],
    defaultStyles: { background: 'gradient-gold', padding: 'xl' }
  }
};

// ============================================
// CAROUSEL TEMPLATES
// ============================================

export const CAROUSEL_TEMPLATES: CarouselTemplate[] = [
  {
    id: 'optionComparison',
    name: 'Option Comparison',
    nameDE: 'Optionen-Vergleich',
    description: 'Compare two options side by side',
    descriptionDE: 'Zwei Optionen nebeneinander vergleichen',
    icon: '⚖️',
    slideCount: 5
  },
  {
    id: 'storySelling',
    name: 'Story Selling',
    nameDE: 'Story Selling',
    description: 'Tell a compelling story',
    descriptionDE: 'Eine fesselnde Geschichte erzählen',
    icon: '📖',
    slideCount: 6
  },
  {
    id: 'statsShowcase',
    name: 'Stats Showcase',
    nameDE: 'Statistik-Showcase',
    description: 'Present impressive statistics',
    descriptionDE: 'Beeindruckende Statistiken präsentieren',
    icon: '📊',
    slideCount: 5
  },
  {
    id: 'tipsList',
    name: 'Tips List',
    nameDE: 'Tipps-Liste',
    description: 'Share valuable tips',
    descriptionDE: 'Wertvolle Tipps teilen',
    icon: '💡',
    slideCount: 7
  },
  {
    id: 'howToGuide',
    name: 'How-To Guide',
    nameDE: 'Anleitung',
    description: 'Step-by-step instructions',
    descriptionDE: 'Schritt-für-Schritt Anleitung',
    icon: '📝',
    slideCount: 6
  },
  {
    id: 'mythVsReality',
    name: 'Myth vs Reality',
    nameDE: 'Mythos vs Realität',
    description: 'Debunk common myths',
    descriptionDE: 'Verbreitete Mythen entlarven',
    icon: '🔍',
    slideCount: 6
  },
  {
    id: 'beforeAfter',
    name: 'Before & After',
    nameDE: 'Vorher & Nachher',
    description: 'Show transformation',
    descriptionDE: 'Transformation zeigen',
    icon: '✨',
    slideCount: 5
  },
  {
    id: 'lessonsLearned',
    name: 'Lessons Learned',
    nameDE: 'Gelerntes',
    description: 'Share your learnings',
    descriptionDE: 'Deine Erkenntnisse teilen',
    icon: '🎓',
    slideCount: 6
  },
  {
    id: 'unpopularOpinion',
    name: 'Unpopular Opinion',
    nameDE: 'Kontroverse Meinung',
    description: 'Share a controversial take',
    descriptionDE: 'Eine kontroverse These teilen',
    icon: '🔥',
    slideCount: 5
  },
  {
    id: 'aboutMe',
    name: 'About Me',
    nameDE: 'Über mich',
    description: 'Introduce yourself',
    descriptionDE: 'Stelle dich vor',
    icon: '👤',
    slideCount: 6
  },
  {
    id: 'blank',
    name: 'Blank',
    nameDE: 'Leer',
    description: 'Start from scratch',
    descriptionDE: 'Von vorne beginnen',
    icon: '📄',
    slideCount: 1
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Create a slide from a template
 */
export function createSlide(templateId: string, slideNumber: number = 1): Slide {
  const template = SLIDE_TEMPLATES[templateId] || SLIDE_TEMPLATES.blank;

  return {
    id: generateId('slide'),
    type: template.id,
    blocks: template.defaultBlocks.map((blockDef, index) => {
      const blockType = BLOCK_TYPES[blockDef.type];
      return {
        id: generateId('block'),
        type: blockDef.type as any,
        content: { ...blockType?.defaultContent, ...blockDef.content }
      };
    }),
    styles: { ...template.defaultStyles } as any,
    order: slideNumber
  };
}

/**
 * Create a block from type
 */
export function createBlock(blockType: string): Block | null {
  const blockDef = BLOCK_TYPES[blockType];
  if (!blockDef) return null;

  return {
    id: generateId('block'),
    type: blockType as any,
    content: { ...blockDef.defaultContent }
  };
}

/**
 * Create a default carousel
 */
export function createDefaultCarousel(): Slide[] {
  return [
    createSlide('cover', 1),
    createSlide('option', 2),
    createSlide('option', 3),
    createSlide('cta', 4)
  ];
}

/**
 * Get slides for a template ID
 */
export function getSlidesForTemplate(templateId: string): Slide[] {
  switch (templateId) {
    case 'optionComparison':
      return [
        createSlide('cover', 1),
        createSlide('option', 2),
        createSlide('option', 3),
        createSlide('comparison', 4),
        createSlide('cta', 5)
      ];
    case 'storySelling':
      return [
        createSlide('cover', 1),
        createSlide('journey', 2),
        createSlide('journey', 3),
        createSlide('journey', 4),
        createSlide('quote', 5),
        createSlide('cta', 6)
      ];
    case 'statsShowcase':
      return [
        createSlide('cover', 1),
        createSlide('stats', 2),
        createSlide('stats', 3),
        createSlide('stats', 4),
        createSlide('cta', 5)
      ];
    case 'tipsList':
      return [
        createSlide('cover', 1),
        createSlide('tip', 2),
        createSlide('tip', 3),
        createSlide('tip', 4),
        createSlide('tip', 5),
        createSlide('tip', 6),
        createSlide('cta', 7)
      ];
    case 'howToGuide':
      return [
        createSlide('cover', 1),
        createSlide('step', 2),
        createSlide('step', 3),
        createSlide('step', 4),
        createSlide('result', 5),
        createSlide('cta', 6)
      ];
    case 'mythVsReality':
      return [
        createSlide('cover', 1),
        createSlide('myth', 2),
        createSlide('reality', 3),
        createSlide('myth', 4),
        createSlide('reality', 5),
        createSlide('cta', 6)
      ];
    case 'beforeAfter':
      return [
        createSlide('cover', 1),
        createSlide('before', 2),
        createSlide('journey', 3),
        createSlide('after', 4),
        createSlide('cta', 5)
      ];
    case 'lessonsLearned':
      return [
        createSlide('cover', 1),
        createSlide('journey', 2),
        createSlide('lesson', 3),
        createSlide('lesson', 4),
        createSlide('lesson', 5),
        createSlide('cta', 6)
      ];
    case 'unpopularOpinion':
      return [
        createSlide('cover', 1),
        createSlide('opinion', 2),
        createSlide('proof', 3),
        createSlide('proof', 4),
        createSlide('cta', 5)
      ];
    case 'aboutMe':
      return [
        createSlide('aboutIntro', 1),
        createSlide('aboutWho', 2),
        createSlide('aboutWhat', 3),
        createSlide('aboutWhy', 4),
        createSlide('funFact', 5),
        createSlide('cta', 6)
      ];
    case 'blank':
    default:
      return [createSlide('blank', 1)];
  }
}

export default {
  SLIDE_TEMPLATES,
  CAROUSEL_TEMPLATES,
  createSlide,
  createBlock,
  createDefaultCarousel,
  getSlidesForTemplate
};
