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
    nameDE: 'Eigenes Design',
    description: 'Start with basic elements',
    descriptionDE: 'Starte mit Basis-Elementen',
    defaultBlocks: [
      { type: 'HEADING', content: { text: 'Deine Überschrift', fontSize: 'xxl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'SUBHEADING', content: { text: 'Dein Untertitel hier', fontSize: 'lg', fontWeight: 'normal', textAlign: 'center', color: '#B0B0B0' } }
    ],
    defaultStyles: {
      background: 'gradient-dark',
      padding: 'lg'
    }
  },
  // === NEUE TEMPLATES ===
  tip: {
    id: 'tip',
    name: 'Tip Slide',
    nameDE: 'Tipp Slide',
    description: 'Share one actionable tip',
    descriptionDE: 'Teile einen umsetzbaren Tipp',
    defaultBlocks: [
      { type: 'NUMBER', content: { number: '01', label: '', color: '#FF6B35' } },
      { type: 'HEADING', content: { text: 'Tipp Titel hier', fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' } },
      { type: 'PARAGRAPH', content: { text: 'Erkläre warum dieser Tipp funktioniert und wie man ihn anwenden kann.', fontSize: 'base', textAlign: 'left', color: '#B0B0B0' } }
    ],
    defaultStyles: {
      background: 'solid-dark',
      padding: 'lg'
    }
  },
  step: {
    id: 'step',
    name: 'Step Slide',
    nameDE: 'Schritt Slide',
    description: 'Show a process step',
    descriptionDE: 'Zeige einen Prozess-Schritt',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'Schritt 1', backgroundColor: '#FF6B35', textColor: '#FFFFFF' } },
      { type: 'HEADING', content: { text: 'Was du tun musst', fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' } },
      { type: 'PARAGRAPH', content: { text: 'Beschreibe den Schritt klar und verständlich. Was soll das Ergebnis sein?', fontSize: 'base', textAlign: 'left', color: '#B0B0B0' } },
      { type: 'ICON', content: { emoji: '→', size: 'lg' } }
    ],
    defaultStyles: {
      background: 'gradient-dark',
      padding: 'lg'
    }
  },
  result: {
    id: 'result',
    name: 'Result Slide',
    nameDE: 'Ergebnis Slide',
    description: 'Show the outcome',
    descriptionDE: 'Zeige das Ergebnis',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '✅', size: 'xxl' } },
      { type: 'HEADING', content: { text: 'Das Ergebnis', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'PARAGRAPH', content: { text: 'Was hast du erreicht? Was hat sich verändert?', fontSize: 'base', textAlign: 'center', color: '#B0B0B0' } }
    ],
    defaultStyles: {
      background: 'gradient-emerald',
      padding: 'lg'
    }
  },
  myth: {
    id: 'myth',
    name: 'Myth Slide',
    nameDE: 'Mythos Slide',
    description: 'Present a common myth',
    descriptionDE: 'Präsentiere einen verbreiteten Mythos',
    defaultBlocks: [
      { type: 'BADGE', content: { text: '❌ Mythos', backgroundColor: '#EF4444', textColor: '#FFFFFF' } },
      { type: 'HEADING', content: { text: '"Das stimmt doch gar nicht..."', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'PARAGRAPH', content: { text: 'Beschreibe den verbreiteten Irrglauben.', fontSize: 'base', textAlign: 'center', color: '#B0B0B0' } }
    ],
    defaultStyles: {
      background: 'gradient-fire',
      padding: 'lg'
    }
  },
  reality: {
    id: 'reality',
    name: 'Reality Slide',
    nameDE: 'Realität Slide',
    description: 'Reveal the truth',
    descriptionDE: 'Enthülle die Wahrheit',
    defaultBlocks: [
      { type: 'BADGE', content: { text: '✓ Realität', backgroundColor: '#10B981', textColor: '#FFFFFF' } },
      { type: 'HEADING', content: { text: 'So ist es wirklich', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'PARAGRAPH', content: { text: 'Erkläre die Wahrheit und warum es wichtig ist, sie zu kennen.', fontSize: 'base', textAlign: 'center', color: '#B0B0B0' } }
    ],
    defaultStyles: {
      background: 'gradient-emerald',
      padding: 'lg'
    }
  },
  before: {
    id: 'before',
    name: 'Before Slide',
    nameDE: 'Vorher Slide',
    description: 'Show the starting point',
    descriptionDE: 'Zeige den Ausgangspunkt',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'VORHER', backgroundColor: '#6B7280', textColor: '#FFFFFF' } },
      { type: 'HEADING', content: { text: 'Die Situation vorher', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'BULLET_LIST', content: { items: ['Problem 1', 'Problem 2', 'Problem 3'], bulletStyle: 'x', color: '#EF4444' } }
    ],
    defaultStyles: {
      background: 'solid-dark',
      padding: 'lg'
    }
  },
  after: {
    id: 'after',
    name: 'After Slide',
    nameDE: 'Nachher Slide',
    description: 'Show the transformation',
    descriptionDE: 'Zeige die Transformation',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'NACHHER', backgroundColor: '#10B981', textColor: '#FFFFFF' } },
      { type: 'HEADING', content: { text: 'Die Situation heute', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'BULLET_LIST', content: { items: ['Erfolg 1', 'Erfolg 2', 'Erfolg 3'], bulletStyle: 'check', color: '#10B981' } }
    ],
    defaultStyles: {
      background: 'gradient-emerald',
      padding: 'lg'
    }
  },
  journey: {
    id: 'journey',
    name: 'Journey Slide',
    nameDE: 'Reise Slide',
    description: 'Part of your story',
    descriptionDE: 'Teil deiner Geschichte',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '📍', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Kapitel deiner Geschichte', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'PARAGRAPH', content: { text: 'Erzähle was passiert ist und was du dabei gefühlt hast.', fontSize: 'base', textAlign: 'center', color: '#B0B0B0' } }
    ],
    defaultStyles: {
      background: 'gradient-purple',
      padding: 'lg'
    }
  },
  lesson: {
    id: 'lesson',
    name: 'Lesson Slide',
    nameDE: 'Lektion Slide',
    description: 'Share a key learning',
    descriptionDE: 'Teile eine wichtige Erkenntnis',
    defaultBlocks: [
      { type: 'NUMBER', content: { number: '01', label: '', color: '#F59E0B' } },
      { type: 'HEADING', content: { text: 'Was ich gelernt habe', fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' } },
      { type: 'PARAGRAPH', content: { text: 'Beschreibe die Lektion und warum sie wichtig für dein Publikum ist.', fontSize: 'base', textAlign: 'left', color: '#B0B0B0' } }
    ],
    defaultStyles: {
      background: 'gradient-gold',
      padding: 'lg'
    }
  },
  opinion: {
    id: 'opinion',
    name: 'Opinion Slide',
    nameDE: 'Meinung Slide',
    description: 'State your controversial view',
    descriptionDE: 'Teile deine kontroverse Ansicht',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '🔥', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Meine unpopuläre Meinung:', fontSize: 'lg', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'QUOTE', content: { text: '"Hier steht deine kontroverse Aussage"', author: '', fontSize: 'xl', fontStyle: 'normal' } }
    ],
    defaultStyles: {
      background: 'gradient-fire',
      padding: 'lg'
    }
  },
  proof: {
    id: 'proof',
    name: 'Proof Slide',
    nameDE: 'Beweis Slide',
    description: 'Back up your claim',
    descriptionDE: 'Untermauere deine Aussage',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'BEWEIS', backgroundColor: '#3B82F6', textColor: '#FFFFFF' } },
      { type: 'HEADING', content: { text: 'Darum stimmt das', fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' } },
      { type: 'BULLET_LIST', content: { items: ['Argument 1', 'Argument 2', 'Argument 3'], bulletStyle: 'arrow', color: '#FFFFFF' } }
    ],
    defaultStyles: {
      background: 'gradient-blue',
      padding: 'lg'
    }
  },
  aboutIntro: {
    id: 'aboutIntro',
    name: 'About Intro',
    nameDE: 'Über Mich Intro',
    description: 'Introduce yourself',
    descriptionDE: 'Stelle dich vor',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '👋', size: 'xxl' } },
      { type: 'HEADING', content: { text: 'Hey, ich bin [Name]!', fontSize: 'xl', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'SUBHEADING', content: { text: 'Swipe um mehr über mich zu erfahren →', fontSize: 'base', fontWeight: 'normal', textAlign: 'center', color: '#FF6B35' } }
    ],
    defaultStyles: {
      background: 'gradient-orange',
      padding: 'lg'
    }
  },
  aboutWho: {
    id: 'aboutWho',
    name: 'Who I Am',
    nameDE: 'Wer ich bin',
    description: 'Share your identity',
    descriptionDE: 'Teile deine Identität',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'WER', backgroundColor: '#0EA5E9', textColor: '#FFFFFF' } },
      { type: 'HEADING', content: { text: 'Das bin ich', fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' } },
      { type: 'PARAGRAPH', content: { text: 'Kurze Bio: Rolle, Erfahrung, Besonderheit.', fontSize: 'base', textAlign: 'left', color: '#B0B0B0' } }
    ],
    defaultStyles: {
      background: 'gradient-blue',
      padding: 'lg'
    }
  },
  aboutWhat: {
    id: 'aboutWhat',
    name: 'What I Do',
    nameDE: 'Was ich mache',
    description: 'Share your work',
    descriptionDE: 'Teile deine Arbeit',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'WAS', backgroundColor: '#8B5CF6', textColor: '#FFFFFF' } },
      { type: 'HEADING', content: { text: 'Das mache ich', fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' } },
      { type: 'BULLET_LIST', content: { items: ['Expertise 1', 'Expertise 2', 'Expertise 3'], bulletStyle: 'check', color: '#8B5CF6' } }
    ],
    defaultStyles: {
      background: 'gradient-purple',
      padding: 'lg'
    }
  },
  aboutWhy: {
    id: 'aboutWhy',
    name: 'Why I Do It',
    nameDE: 'Warum ich das mache',
    description: 'Share your motivation',
    descriptionDE: 'Teile deine Motivation',
    defaultBlocks: [
      { type: 'BADGE', content: { text: 'WARUM', backgroundColor: '#EC4899', textColor: '#FFFFFF' } },
      { type: 'HEADING', content: { text: 'Meine Mission', fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' } },
      { type: 'QUOTE', content: { text: '"Ich helfe [Zielgruppe] dabei, [Ergebnis] zu erreichen."', author: '', fontSize: 'lg', fontStyle: 'normal' } }
    ],
    defaultStyles: {
      background: 'gradient-rose',
      padding: 'lg'
    }
  },
  funFact: {
    id: 'funFact',
    name: 'Fun Fact',
    nameDE: 'Fun Fact',
    description: 'Share something fun',
    descriptionDE: 'Teile etwas Lustiges',
    defaultBlocks: [
      { type: 'ICON', content: { emoji: '🎉', size: 'xl' } },
      { type: 'HEADING', content: { text: 'Fun Fact über mich:', fontSize: 'lg', fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' } },
      { type: 'PARAGRAPH', content: { text: 'Etwas Persönliches das dich menschlich macht.', fontSize: 'base', textAlign: 'center', color: '#B0B0B0' } }
    ],
    defaultStyles: {
      background: 'mesh-vibrant',
      padding: 'lg'
    }
  }
};

// ============================================
// BACKGROUND STYLES - Erweitert mit Premium Gradienten
// ============================================
export const BACKGROUND_STYLES = {
  // === SOLIDS ===
  'solid-dark': {
    name: 'Dark',
    nameDE: 'Dunkel',
    category: 'solid',
    style: { backgroundColor: '#0A0A0B' }
  },
  'solid-black': {
    name: 'Black',
    nameDE: 'Schwarz',
    category: 'solid',
    style: { backgroundColor: '#000000' }
  },
  'solid-charcoal': {
    name: 'Charcoal',
    nameDE: 'Anthrazit',
    category: 'solid',
    style: { backgroundColor: '#1A1A1D' }
  },
  'solid-navy': {
    name: 'Navy',
    nameDE: 'Marine',
    category: 'solid',
    style: { backgroundColor: '#0d1b2a' }
  },
  'solid-white': {
    name: 'White',
    nameDE: 'Weiß',
    category: 'solid',
    style: { backgroundColor: '#FFFFFF' }
  },
  // === PREMIUM GRADIENTS ===
  'gradient-orange': {
    name: 'Sunset',
    nameDE: 'Sonnenuntergang',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }
  },
  'gradient-fire': {
    name: 'Fire',
    nameDE: 'Feuer',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1010 40%, #4a1515 70%, #1a0a0a 100%)' }
  },
  'gradient-dark': {
    name: 'Midnight',
    nameDE: 'Mitternacht',
    category: 'gradient',
    style: { background: 'linear-gradient(180deg, #0A0A0B 0%, #1a1a2e 100%)' }
  },
  'gradient-purple': {
    name: 'Cosmic',
    nameDE: 'Kosmisch',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a1a2e 100%)' }
  },
  'gradient-aurora': {
    name: 'Aurora',
    nameDE: 'Polarlicht',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a1628 0%, #1a2744 30%, #2d1b4e 70%, #0a1628 100%)' }
  },
  'gradient-blue': {
    name: 'Ocean',
    nameDE: 'Ozean',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a192f 0%, #172a45 50%, #0a192f 100%)' }
  },
  'gradient-cyan': {
    name: 'Ice',
    nameDE: 'Eis',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a1a2e 0%, #0d3b4a 50%, #0a1a2e 100%)' }
  },
  'gradient-green': {
    name: 'Forest',
    nameDE: 'Wald',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a1a0a 0%, #1a2f1a 50%, #0a1a0a 100%)' }
  },
  'gradient-emerald': {
    name: 'Emerald',
    nameDE: 'Smaragd',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #0a1a14 0%, #0d3d2e 50%, #0a1a14 100%)' }
  },
  'gradient-gold': {
    name: 'Gold',
    nameDE: 'Gold',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a1508 0%, #2d2510 50%, #1a1508 100%)' }
  },
  'gradient-rose': {
    name: 'Rose',
    nameDE: 'Rose',
    category: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a0a14 0%, #3d1a2e 50%, #1a0a14 100%)' }
  },
  // === MESH GRADIENTS (Premium) ===
  'mesh-vibrant': {
    name: 'Vibrant',
    nameDE: 'Lebhaft',
    category: 'mesh',
    style: { background: 'radial-gradient(at 20% 80%, #2d1b4e 0%, transparent 50%), radial-gradient(at 80% 20%, #1a2f1a 0%, transparent 50%), radial-gradient(at 50% 50%, #1a1a2e 0%, #0A0A0B 100%)' }
  },
  'mesh-sunset': {
    name: 'Warm',
    nameDE: 'Warm',
    category: 'mesh',
    style: { background: 'radial-gradient(at 0% 100%, #4a1515 0%, transparent 50%), radial-gradient(at 100% 0%, #2d2510 0%, transparent 50%), radial-gradient(at 50% 50%, #1a1a2e 0%, #0A0A0B 100%)' }
  },
  'mesh-cool': {
    name: 'Cool',
    nameDE: 'Kühl',
    category: 'mesh',
    style: { background: 'radial-gradient(at 0% 0%, #172a45 0%, transparent 50%), radial-gradient(at 100% 100%, #0d3d2e 0%, transparent 50%), radial-gradient(at 50% 50%, #0a192f 0%, #0A0A0B 100%)' }
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
