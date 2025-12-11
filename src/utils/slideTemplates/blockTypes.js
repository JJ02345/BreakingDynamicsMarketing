import { Type, Image, Smile, Minus, User, Hash, List, Quote } from 'lucide-react';

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

export default BLOCK_TYPES;
